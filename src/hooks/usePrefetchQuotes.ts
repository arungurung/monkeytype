import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchQuote } from "../services/quotesApi";

/**
 * Hook to prefetch quote on app initialization
 * This ensures a quote is ready when user switches to quote mode
 */
export function usePrefetchQuotes() {
	const queryClient = useQueryClient();

	useEffect(() => {
		// Prefetch quote mode
		queryClient.prefetchQuery({
			queryKey: ["quote", "quote"],
			queryFn: () => fetchQuote(),
			staleTime: Number.POSITIVE_INFINITY,
		});
	}, [queryClient]);
}
