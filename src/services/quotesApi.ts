/**
 * Quotes API service using TheQuotesHub.com
 * API Documentation: https://thequoteshub.com/api/
 * Free tier with no API key required
 */

const QUOTES_HUB_API_BASE = "https://thequoteshub.com/api";

export interface Quote {
	_id: string;
	content: string;
	author: string;
	authorSlug: string;
	length: number;
	tags: string[];
}

interface QuotesHubResponse {
	text: string; // API returns "text" not "quote"
	author: string;
	tags?: string[];
	id?: number;
	author_id?: string;
}

/**
 * Fetches a random quote
 * @returns Promise resolving to a Quote object
 */
export async function fetchQuote(): Promise<Quote> {
	const response = await fetch(`${QUOTES_HUB_API_BASE}/random-quote`);

	if (!response.ok) {
		throw new Error(`Failed to fetch quote: ${response.statusText}`);
	}

	const data: QuotesHubResponse = await response.json();
	
	if (!data || !data.text) {
		throw new Error("No quote found");
	}

	return {
		_id: `${data.author}-${Date.now()}`,
		content: data.text,
		author: data.author || "Unknown",
		authorSlug: (data.author || "unknown").toLowerCase().replace(/\s+/g, "-"),
		length: data.text.length,
		tags: data.tags || [],
	};
}

/**
 * Fetches a random quote by length (deprecated - just fetches random quote)
 * @deprecated Use fetchQuote() instead
 */
export async function fetchQuoteByLength(
	_minLength: number,
	_maxLength: number,
): Promise<Quote> {
	return fetchQuote();
}
