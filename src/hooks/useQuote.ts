import { useQuery } from "@tanstack/react-query";
import { fetchQuote, type Quote } from "../services/quotesApi";
import { isQuoteMode, type TestMode } from "../utils/wordGenerator";

/**
 * Custom hook to fetch quotes using TanStack Query
 * @param mode Test mode
 * @param enabled Whether to enable the query (default: true)
 * @returns Query result with quote data, loading state, and error
 */
export function useQuote(mode: TestMode, enabled = true) {
	return useQuery<Quote, Error>({
		queryKey: ["quote", mode],
		queryFn: async () => {
			if (!isQuoteMode(mode)) {
				throw new Error(`Invalid quote mode: ${mode}`);
			}
			return fetchQuote();
		},
		enabled: enabled && isQuoteMode(mode),
		// Cache quotes indefinitely until manually refetched
		staleTime: Number.POSITIVE_INFINITY,
		// Keep unused quotes in cache for 10 minutes
		gcTime: 10 * 60 * 1000,
		// Retry failed requests up to 2 times
		retry: 2,
		// Don't refetch on window focus
		refetchOnWindowFocus: false,
		// Don't refetch when query mounts if we have cached data
		refetchOnMount: false,
		// Don't refetch when component reconnects
		refetchOnReconnect: false,
	});
}
