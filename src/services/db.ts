import { type SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 2;

  let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  ) || { user_version: 0 };
  
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  
  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        total_amount INTEGER NOT NULL,
        note TEXT
      );
      CREATE TABLE IF NOT EXISTS transaction_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        item_price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        unit TEXT, 
        category TEXT,
        total_price INTEGER NOT NULL,
        FOREIGN KEY (transaction_id) REFERENCES transactions (id)
      );
    `);
    
    currentDbVersion = 1;
  }

  if (currentDbVersion < 2) {
    await db.execAsync(`
      ALTER TABLE transaction_items ADD COLUMN unit TEXT;
    `);
    currentDbVersion = 2;
  }
  
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export interface TransactionItem {
  id?: number;
  transaction_id?: number;
  item_name: string;
  item_price: number;
  quantity: number;
  unit?: string;
  category: string;
  total_price: number;
}

export interface Transaction {
  id?: number;
  date: string;
  total_amount: number;
  note?: string;
  items?: TransactionItem[];
}

export const insertTransaction = async (db: SQLiteDatabase, transaction: Transaction) => {
    try {
        await db.runAsync('BEGIN TRANSACTION');
        
        const result = await db.runAsync(
            'INSERT INTO transactions (date, total_amount, note) VALUES (?, ?, ?)',
            [transaction.date, transaction.total_amount, transaction.note || '']
        );
        
        const transactionId = result.lastInsertRowId;
        
        if (transaction.items && transaction.items.length > 0) {
            for (const item of transaction.items) {
                await db.runAsync(
                    'INSERT INTO transaction_items (transaction_id, item_name, item_price, quantity, unit, category, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [transactionId, item.item_name, item.item_price, item.quantity, item.unit || null, item.category, item.total_price]
                );
            }
        }
        
        await db.runAsync('COMMIT');
        return transactionId;
    } catch (error) {
        await db.runAsync('ROLLBACK');
        console.error("Error inserting transaction:", error);
        throw error;
    }
};

export const getTransactions = async (db: SQLiteDatabase) => {
    return await db.getAllAsync<Transaction>('SELECT * FROM transactions ORDER BY date DESC');
};

export const getTransactionsWithItems = async (db: SQLiteDatabase) => {
    const transactions = await db.getAllAsync<Transaction>('SELECT * FROM transactions ORDER BY date DESC');
    for (const t of transactions) {
        if (t.id) {
            t.items = await db.getAllAsync<TransactionItem>('SELECT * FROM transaction_items WHERE transaction_id = ?', [t.id]);
        }
    }
    return transactions;
};

export const getTransactionDetails = async (db: SQLiteDatabase, id: number) => {
    const transaction = await db.getFirstAsync<Transaction>('SELECT * FROM transactions WHERE id = ?', [id]);
    if (transaction) {
        transaction.items = await db.getAllAsync<TransactionItem>('SELECT * FROM transaction_items WHERE transaction_id = ?', [id]);
    }
    return transaction;
};

export const deleteTransaction = async (db: SQLiteDatabase, id: number) => {
    try {
        await db.runAsync('BEGIN TRANSACTION');
        await db.runAsync('DELETE FROM transaction_items WHERE transaction_id = ?', [id]);
        await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
        await db.runAsync('COMMIT');
    } catch (error) {
        await db.runAsync('ROLLBACK');
        console.error("Error deleting transaction:", error);
        throw error;
    }
};
