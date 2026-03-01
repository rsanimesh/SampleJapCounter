import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

const getDB = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync('jap_counter.db');
    }
    return db;
};

export const initDB = async () => {
    try {
        const database = await getDB();
        await database.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS jap_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        god_name TEXT NOT NULL,
        date TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        bead_count INTEGER NOT NULL,
        mala_count INTEGER NOT NULL,
        duration_sec INTEGER NOT NULL DEFAULT 0
      );
    `);

        // Migration for existing tables without duration_sec
        try {
            await database.execAsync('ALTER TABLE jap_sessions ADD COLUMN duration_sec INTEGER DEFAULT 0;');
        } catch (e) {
            // Ignore error if column already exists
        }

        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export const addSession = async (
    godName: string,
    beadCount: number,
    malaCount: number,
    duration: number
) => {
    try {
        const database = await getDB();

        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const timestamp = now.toISOString();

        await database.runAsync(
            'INSERT INTO jap_sessions (god_name, date, timestamp, bead_count, mala_count, duration_sec) VALUES (?, ?, ?, ?, ?, ?)',
            [godName, date, timestamp, beadCount, malaCount, duration]
        );

        console.log('Session added successfully');
    } catch (error) {
        console.error('Error adding session:', error);
        throw error;
    }
};

export const getStatsForDate = async (dateString: string) => {
    try {
        const database = await getDB();

        const result = await database.getFirstAsync<{
            totalBeads: number;
            totalMalas: number;
        }>(
            'SELECT SUM(bead_count) as totalBeads, SUM(mala_count) as totalMalas FROM jap_sessions WHERE date = ?',
            [dateString]
        );
        return {
            totalBeads: ((result?.totalMalas || 0) * 108) + (result?.totalBeads || 0),
            totalMalas: result?.totalMalas || 0,
        };
    } catch (error) {
        console.error('Error getting stats for date:', error);
        return { totalBeads: 0, totalMalas: 0 };
    }
};

export const getAllTimeStats = async () => {
    try {
        const database = await getDB();

        const result = await database.getFirstAsync<{
            totalBeads: number;
            totalMalas: number;
        }>(
            'SELECT SUM(bead_count) as totalBeads, SUM(mala_count) as totalMalas FROM jap_sessions'
        );

        return {
            totalBeads: ((result?.totalMalas || 0) * 108) + (result?.totalBeads || 0),
            totalMalas: result?.totalMalas || 0,
        };
    } catch (error) {
        console.error('Error getting all time stats:', error);
        return { totalBeads: 0, totalMalas: 0 };
    }
};

export interface Session {
    id: number;
    god_name: string;
    date: string;
    timestamp: string;
    bead_count: number;
    mala_count: number;
    duration_sec: number;
}

export const getPaginatedHistory = async (limit: number, offset: number): Promise<Session[]> => {
    try {
        const database = await getDB();

        const results = await database.getAllAsync<Session>(
            'SELECT * FROM jap_sessions ORDER BY timestamp DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return results;
    } catch (error) {
        console.error('Error getting paginated history:', error);
        return [];
    }
};
