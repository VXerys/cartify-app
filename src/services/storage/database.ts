/**
 * SQLite Database Service - Offline Storage
 * "The Offline Memory" - Menyimpan riwayat shopping sessions
 */

import type { CartItem } from '@/src/store/useCartStore';
import * as SQLite from 'expo-sqlite';

/**
 * Interface untuk shopping session
 */
export interface ShoppingSession {
  id: number;
  date: string; // ISO string
  totalSpent: number;
  budgetLimit: number;
  itemCount: number;
  createdAt: number; // Timestamp
}

/**
 * Interface untuk session item (joined dengan session)
 */
export interface SessionItemRecord extends CartItem {
  sessionId: number;
}

/**
 * Database singleton class
 */
class Database {
  private static instance: Database;
  private db: SQLite.SQLiteDatabase | null = null;
  private readonly DB_NAME = 'cartify.db';

  private constructor() {}

  /**
   * Singleton pattern
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Inisialisasi database dan create tables
   * Harus dipanggil saat app startup
   */
  public async initDB(): Promise<void> {
    try {
      // Open database connection
      this.db = await SQLite.openDatabaseAsync(this.DB_NAME);

      // Create sessions table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          total_spent REAL NOT NULL,
          budget_limit REAL NOT NULL,
          item_count INTEGER NOT NULL,
          created_at INTEGER NOT NULL
        );
      `);

      // Create session_items table dengan foreign key ke sessions
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS session_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id INTEGER NOT NULL,
          item_id TEXT NOT NULL,
          name TEXT NOT NULL,
          qty INTEGER NOT NULL,
          price REAL NOT NULL,
          total REAL NOT NULL,
          timestamp INTEGER NOT NULL,
          FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
        );
      `);

      // Create index untuk performa query
      await this.db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
        CREATE INDEX IF NOT EXISTS idx_items_session ON session_items(session_id);
      `);

      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Simpan session dan items ke database
   * Dipanggil saat user selesai belanja (checkout/reset)
   */
  public async saveSessionToHistory(
    totalSpent: number,
    budgetLimit: number,
    items: CartItem[]
  ): Promise<number> {
    if (!this.db) {
      throw new Error('Database belum diinisialisasi. Panggil initDB() terlebih dahulu.');
    }

    try {
      const now = Date.now();
      const dateStr = new Date().toISOString();

      // Insert session record
      const sessionResult = await this.db.runAsync(
        `INSERT INTO sessions (date, total_spent, budget_limit, item_count, created_at) 
         VALUES (?, ?, ?, ?, ?)`,
        [dateStr, totalSpent, budgetLimit, items.length, now]
      );

      const sessionId = sessionResult.lastInsertRowId;

      // Insert semua items untuk session ini
      for (const item of items) {
        await this.db.runAsync(
          `INSERT INTO session_items (session_id, item_id, name, qty, price, total, timestamp)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [sessionId, item.id, item.name, item.qty, item.price, item.total, item.timestamp]
        );
      }

      console.log(`✅ Session ${sessionId} saved to history`);
      return sessionId;
    } catch (error) {
      console.error('❌ Failed to save session:', error);
      throw error;
    }
  }

  /**
   * Ambil semua sessions (untuk History screen)
   * @param limit - Jumlah maksimal record yang dikembalikan
   * @param offset - Offset untuk pagination
   */
  public async getAllSessions(
    limit: number = 50,
    offset: number = 0
  ): Promise<ShoppingSession[]> {
    if (!this.db) {
      throw new Error('Database belum diinisialisasi.');
    }

    try {
      const rows = await this.db.getAllAsync<ShoppingSession>(
        `SELECT id, date, total_spent as totalSpent, budget_limit as budgetLimit, 
                item_count as itemCount, created_at as createdAt
         FROM sessions 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      return rows;
    } catch (error) {
      console.error('❌ Failed to fetch sessions:', error);
      return [];
    }
  }

  /**
   * Ambil detail session beserta items-nya
   */
  public async getSessionDetail(sessionId: number): Promise<{
    session: ShoppingSession | null;
    items: SessionItemRecord[];
  }> {
    if (!this.db) {
      throw new Error('Database belum diinisialisasi.');
    }

    try {
      // Get session info
      const sessionRow = await this.db.getFirstAsync<ShoppingSession>(
        `SELECT id, date, total_spent as totalSpent, budget_limit as budgetLimit,
                item_count as itemCount, created_at as createdAt
         FROM sessions 
         WHERE id = ?`,
        [sessionId]
      );

      // Get session items
      const itemRows = await this.db.getAllAsync<SessionItemRecord>(
        `SELECT session_id as sessionId, item_id as id, name, qty, price, total, timestamp
         FROM session_items 
         WHERE session_id = ?
         ORDER BY timestamp ASC`,
        [sessionId]
      );

      return {
        session: sessionRow || null,
        items: itemRows,
      };
    } catch (error) {
      console.error('❌ Failed to fetch session detail:', error);
      return { session: null, items: [] };
    }
  }

  /**
   * Hapus session (dan otomatis hapus items karena CASCADE)
   */
  public async deleteSession(sessionId: number): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database belum diinisialisasi.');
    }

    try {
      await this.db.runAsync('DELETE FROM sessions WHERE id = ?', [sessionId]);
      console.log(`✅ Session ${sessionId} deleted`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete session:', error);
      return false;
    }
  }

  /**
   * Get statistik total (untuk dashboard/analytics)
   */
  public async getStatistics(): Promise<{
    totalSessions: number;
    totalSpent: number;
    averageSpent: number;
  }> {
    if (!this.db) {
      throw new Error('Database belum diinisialisasi.');
    }

    try {
      const result = await this.db.getFirstAsync<{
        total_sessions: number;
        total_spent: number;
        avg_spent: number;
      }>(
        `SELECT 
          COUNT(*) as total_sessions,
          SUM(total_spent) as total_spent,
          AVG(total_spent) as avg_spent
         FROM sessions`
      );

      return {
        totalSessions: result?.total_sessions || 0,
        totalSpent: result?.total_spent || 0,
        averageSpent: result?.avg_spent || 0,
      };
    } catch (error) {
      console.error('❌ Failed to fetch statistics:', error);
      return { totalSessions: 0, totalSpent: 0, averageSpent: 0 };
    }
  }

  /**
   * Clear semua data (untuk testing atau reset app)
   */
  public async clearAllData(): Promise<void> {
    if (!this.db) {
      throw new Error('Database belum diinisialisasi.');
    }

    try {
      await this.db.execAsync(`
        DELETE FROM session_items;
        DELETE FROM sessions;
      `);
      console.log('✅ All data cleared');
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const database = Database.getInstance();
