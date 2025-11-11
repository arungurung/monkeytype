import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchQuote, fetchQuoteByLength } from './quotesApi';

// Mock fetch globally
global.fetch = vi.fn();

describe('Quotes API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchQuote', () => {
    it('should fetch and return a quote successfully', async () => {
      const mockResponse = {
        text: 'This is a test quote',
        author: 'Test Author',
        tags: ['test', 'quote'],
        id: 123,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchQuote();

      expect(result).toEqual({
        _id: expect.stringContaining('Test Author'),
        content: 'This is a test quote',
        author: 'Test Author',
        authorSlug: 'test-author',
        length: 20,
        tags: ['test', 'quote'],
      });
    });

    it('should throw error when API fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(fetchQuote()).rejects.toThrow('Failed to fetch quote');
    });

    it('should throw error when no quote text in response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ author: 'Test' }),
      });

      await expect(fetchQuote()).rejects.toThrow('No quote found');
    });
  });

  describe('fetchQuoteByLength (deprecated)', () => {
    it('should fetch and return a quote (ignores length parameters)', async () => {
      const mockResponse = {
        text: 'A quote of any length',
        author: 'Test Author',
        tags: ['test'],
        id: 456,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchQuoteByLength(0, 100);

      expect(result.content).toBe('A quote of any length');
      expect(result.author).toBe('Test Author');
      expect(result.length).toBe(21);
    });
  });
});
