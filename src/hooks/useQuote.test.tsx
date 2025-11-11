import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuote } from './useQuote';
import * as quotesApi from '../services/quotesApi';

vi.mock('../services/quotesApi');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useQuote Hook - Optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should only fetch once and cache the result', async () => {
    const mockQuote = {
      _id: '1',
      content: 'Test quote',
      author: 'Test Author',
      authorSlug: 'test-author',
      length: 10,
      tags: [],
    };

    vi.spyOn(quotesApi, 'fetchQuote').mockResolvedValue(mockQuote);

    const { result, rerender } = renderHook(
      () => useQuote('quote', true),
      { wrapper: createWrapper() }
    );

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.data).toEqual(mockQuote);
    });

    // API should be called only once
    expect(quotesApi.fetchQuote).toHaveBeenCalledTimes(1);

    // Rerender the hook (simulating component rerender)
    rerender();

    // API should still only be called once (cached)
    expect(quotesApi.fetchQuote).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockQuote);
  });

  it('should not refetch on mount if cache exists', async () => {
    const mockQuote = {
      _id: '1',
      content: 'Cached quote',
      author: 'Cached Author',
      authorSlug: 'cached-author',
      length: 12,
      tags: [],
    };

    vi.spyOn(quotesApi, 'fetchQuote').mockResolvedValue(mockQuote);

    const wrapper = createWrapper();

    // First render
    const { result: result1, unmount } = renderHook(
      () => useQuote('quote', true),
      { wrapper }
    );

    await waitFor(() => {
      expect(result1.current.data).toEqual(mockQuote);
    });

    expect(quotesApi.fetchQuote).toHaveBeenCalledTimes(1);

    // Unmount and remount (simulating navigation away and back)
    unmount();

    const { result: result2 } = renderHook(
      () => useQuote('quote', true),
      { wrapper }
    );

    // Should use cached data without refetching
    await waitFor(() => {
      expect(result2.current.data).toEqual(mockQuote);
    });

    // Should still only be called once (using cache)
    expect(quotesApi.fetchQuote).toHaveBeenCalledTimes(1);
  });

  it('should refetch quote when explicitly requested', async () => {
    const firstQuote = {
      _id: '1',
      content: 'First quote',
      author: 'Author 1',
      authorSlug: 'author-1',
      length: 11,
      tags: [],
    };

    const secondQuote = {
      _id: '2',
      content: 'Second quote',
      author: 'Author 2',
      authorSlug: 'author-2',
      length: 12,
      tags: [],
    };

    vi.spyOn(quotesApi, 'fetchQuote')
      .mockResolvedValueOnce(firstQuote)
      .mockResolvedValueOnce(secondQuote);

    const wrapper = createWrapper();

    // Fetch first quote
    const { result } = renderHook(
      () => useQuote('quote', true),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(firstQuote);
    });

    // Manually refetch
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.data).toEqual(secondQuote);
    });

    // Should be called twice (initial + refetch)
    expect(quotesApi.fetchQuote).toHaveBeenCalledTimes(2);
  });
});
