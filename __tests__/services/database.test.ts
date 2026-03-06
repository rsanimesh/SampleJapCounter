import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as SQLite from 'expo-sqlite';

// Re-mock for this test file
vi.mock('expo-sqlite', () => ({
  openDatabaseAsync: vi.fn(() =>
    Promise.resolve({
      execAsync: vi.fn(() => Promise.resolve()),
      runAsync: vi.fn(() => Promise.resolve()),
      getFirstAsync: vi.fn(() => Promise.resolve(null)),
      getAllAsync: vi.fn(() => Promise.resolve([])),
    })
  ),
}));

// Import after mocking
const { initDB, addSession, getStatsForDate, getAllTimeStats, getPaginatedHistory } = await import('../../services/database');

// Mock database instance
const mockDB = {
  execAsync: vi.fn(() => Promise.resolve()),
  runAsync: vi.fn(() => Promise.resolve()),
  getFirstAsync: vi.fn(() => Promise.resolve(null)),
  getAllAsync: vi.fn(() => Promise.resolve([])),
};

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  (SQLite.openDatabaseAsync as ReturnType<typeof vi.fn>).mockResolvedValue(mockDB);
});

describe('Database Service', () => {
  describe('initDB', () => {
    it('should initialize the database with correct schema', async () => {
      await initDB();

      expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith('jap_counter.db');
      expect(mockDB.execAsync).toHaveBeenCalled();
    });

    it('should handle database initialization errors gracefully', async () => {
      mockDB.execAsync.mockRejectedValueOnce(new Error('DB Error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await initDB();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('addSession', () => {
    it('should add a session with correct parameters', async () => {
      await addSession('TestGod', 54, 2, 3600);

      expect(mockDB.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO jap_sessions'),
        expect.arrayContaining(['TestGod', expect.any(String), expect.any(String), 54, 2, 3600])
      );
    });

    it('should throw error on database failure', async () => {
      mockDB.runAsync.mockRejectedValueOnce(new Error('Insert failed'));

      await expect(addSession('TestGod', 54, 2, 3600)).rejects.toThrow('Insert failed');
    });
  });

  describe('getStatsForDate', () => {
    it('should return stats for a specific date', async () => {
      mockDB.getFirstAsync.mockResolvedValueOnce({
        totalBeads: 100,
        totalMalas: 2,
      });

      const result = await getStatsForDate('2024-02-08');

      expect(result).toEqual({
        totalBeads: 316, // (2 * 108) + 100
        totalMalas: 2,
      });
    });

    it('should return zero stats when no data exists', async () => {
      mockDB.getFirstAsync.mockResolvedValueOnce(null);

      const result = await getStatsForDate('2024-02-08');

      expect(result).toEqual({
        totalBeads: 0,
        totalMalas: 0,
      });
    });

    it('should handle database errors gracefully', async () => {
      mockDB.getFirstAsync.mockRejectedValueOnce(new Error('Query failed'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await getStatsForDate('2024-02-08');

      expect(result).toEqual({ totalBeads: 0, totalMalas: 0 });
      consoleSpy.mockRestore();
    });
  });

  describe('getAllTimeStats', () => {
    it('should return all-time stats', async () => {
      mockDB.getFirstAsync.mockResolvedValueOnce({
        totalBeads: 500,
        totalMalas: 10,
      });

      const result = await getAllTimeStats();

      expect(result).toEqual({
        totalBeads: 1580, // (10 * 108) + 500
        totalMalas: 10,
      });
    });

    it('should return zero stats when database is empty', async () => {
      mockDB.getFirstAsync.mockResolvedValueOnce(null);

      const result = await getAllTimeStats();

      expect(result).toEqual({
        totalBeads: 0,
        totalMalas: 0,
      });
    });
  });

  describe('getPaginatedHistory', () => {
    it('should return paginated sessions', async () => {
      const mockSessions = [
        { id: 1, god_name: 'God1', date: '2024-02-08', timestamp: '2024-02-08T10:00:00Z', bead_count: 54, mala_count: 1, duration_sec: 1800 },
        { id: 2, god_name: 'God2', date: '2024-02-07', timestamp: '2024-02-07T10:00:00Z', bead_count: 108, mala_count: 2, duration_sec: 3600 },
      ];
      mockDB.getAllAsync.mockResolvedValueOnce(mockSessions);

      const result = await getPaginatedHistory(10, 0);

      expect(result).toEqual(mockSessions);
      expect(mockDB.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM jap_sessions'),
        [10, 0]
      );
    });

    it('should return empty array on error', async () => {
      mockDB.getAllAsync.mockRejectedValueOnce(new Error('Query failed'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await getPaginatedHistory(10, 0);

      expect(result).toEqual([]);
      consoleSpy.mockRestore();
    });
  });
});
