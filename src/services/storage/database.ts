import * as SQLite from 'expo-sqlite';

/**
 * Database Service (Offline Memory)
 * Menggunakan expo-sqlite untuk menyimpan riwayat sesi belanja secara permanen.
 *
 * Struktur Tabel:
 * 1. sessions: Mencatat "trips" belanja (ID, tanggal, total, budget).
 * 2. session_items: Item detail per sesi.
 */

// Membuka database (Cartify.db akan dibuat di direktori dokumen aplikasi)
// Untuk Expo SQLite versi baru (SDK 50+), kita menggunakan openDatabaseSync atau async
// Versi SDK 50+ lebih disarankan menggunakan pendekatan baru jika tersedia, tapi
// openDatabaseSync masih umum digunakan.
// Note: Kode ini disesuaikan dengan pola umum expo-sqlite.

let db: SQLite.SQLiteDatabase | null = null;

export const DatabaseService = {

  /**
   * Inisialisasi Database dan Tabel
   */
  initDB: async () => {
    try {
      db = await SQLite.openDatabaseAsync('Cartify.db');

      // Buat tabel sessions
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          total_spent REAL NOT NULL,
          budget_limit REAL NOT NULL,
          status TEXT DEFAULT 'COMPLETED'
        );
      `);

      // Buat tabel session_items
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS session_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id INTEGER,
          qty INTEGER NOT NULL,
          product_name TEXT NOT NULL,
          user_input_price REAL NOT NULL,
          subtotal REAL NOT NULL,
          FOREIGN KEY (session_id) REFERENCES sessions (id)
        );
      `);

      console.log('Database Initialized Successfully');
    } catch (error) {
      console.error('Failed to init DB:', error);
    }
  },

  /**
   * Menyimpan Sesi Belanja ke History
   */
  saveSessionToHistory: async (
    budgetLimit: number,
    totalSpent: number,
    items: { qty: number; name: string; price: number; total: number }[]
  ) => {
    if (!db) await DatabaseService.initDB();
    if (!db) return; // Fail safe

    const date = new Date().toISOString();

    try {
      // 1. Insert Session Header
      // Kita gunakan runAsync untuk operasi tulis
      const result = await db.runAsync(
        'INSERT INTO sessions (date, total_spent, budget_limit) VALUES (?, ?, ?)',
        date,
        totalSpent,
        budgetLimit
      );

      const sessionId = result.lastInsertRowId;

      // 2. Insert Items (Looping insert - untuk performa lebih baik bisa batching tapi ini MVP)
      for (const item of items) {
        await db.runAsync(
          'INSERT INTO session_items (session_id, qty, product_name, user_input_price, subtotal) VALUES (?, ?, ?, ?, ?)',
          sessionId,
          item.qty,
          item.name,
          item.price,
          item.total
        );
      }

      console.log(`Session ${sessionId} saved with ${items.length} items.`);
      return sessionId;
    } catch (error) {
      console.error('Failed to save session:', error);
      throw error;
    }
  },

  /**
   * Mengambil Riwayat Belanja (Terbaru ke Terlama)
   */
  getHistory: async () => {
    if (!db) await DatabaseService.initDB();
    if (!db) return [];

    try {
      const allRows = await db.getAllAsync('SELECT * FROM sessions ORDER BY id DESC');
      return allRows;
    } catch (error) {
      console.error('Failed to get history:', error);
      return [];
    }
  },

  /**
   * Mengambil Detail Item per Sesi
   */
  getSessionItems: async (sessionId: number) => {
    if (!db) await DatabaseService.initDB();
    if (!db) return [];

    try {
      const allRows = await db.getAllAsync(
        'SELECT * FROM session_items WHERE session_id = ?',
        sessionId
      );
      return allRows;
    } catch (error) {
      console.error('Failed to get session items:', error);
      return [];
    }
  }
};
