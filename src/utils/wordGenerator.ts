// Common English words for typing tests
const COMMON_WORDS = [
	"the",
	"be",
	"to",
	"of",
	"and",
	"a",
	"in",
	"that",
	"have",
	"it",
	"for",
	"not",
	"on",
	"with",
	"he",
	"as",
	"you",
	"do",
	"at",
	"this",
	"but",
	"his",
	"by",
	"from",
	"they",
	"we",
	"say",
	"her",
	"she",
	"or",
	"an",
	"will",
	"my",
	"one",
	"all",
	"would",
	"there",
	"their",
	"what",
	"so",
	"up",
	"out",
	"if",
	"about",
	"who",
	"get",
	"which",
	"go",
	"me",
	"when",
	"make",
	"can",
	"like",
	"time",
	"no",
	"just",
	"him",
	"know",
	"take",
	"people",
	"into",
	"year",
	"your",
	"good",
	"some",
	"could",
	"them",
	"see",
	"other",
	"than",
	"then",
	"now",
	"look",
	"only",
	"come",
	"its",
	"over",
	"think",
	"also",
	"back",
	"after",
	"use",
	"two",
	"how",
	"our",
	"work",
	"first",
	"well",
	"way",
	"even",
	"new",
	"want",
	"because",
	"any",
	"these",
	"give",
	"day",
	"most",
	"us",
	"is",
	"was",
	"are",
	"been",
	"has",
	"had",
	"were",
	"said",
	"did",
	"having",
	"may",
	"should",
	"does",
	"did",
	"done",
	"being",
	"am",
	"world",
	"life",
	"hand",
	"part",
	"child",
	"eye",
	"woman",
	"place",
	"case",
	"point",
	"government",
	"company",
	"number",
	"group",
	"problem",
	"fact",
	"right",
	"great",
	"small",
	"large",
	"next",
	"early",
	"young",
	"important",
	"different",
	"public",
	"able",
	"bad",
	"free",
	"human",
	"local",
	"long",
	"little",
	"own",
	"few",
	"good",
	"high",
	"better",
	"open",
	"best",
	"big",
	"simple",
	"sure",
	"clear",
	"yet",
	"matter",
	"set",
	"every",
	"must",
	"include",
	"follow",
	"stop",
	"change",
	"play",
	"move",
	"pay",
	"run",
	"continue",
	"sit",
	"stand",
	"lose",
	"meet",
	"bring",
	"happen",
	"write",
	"provide",
	"call",
	"try",
	"need",
	"feel",
	"become",
	"leave",
	"put",
	"mean",
	"keep",
	"let",
	"begin",
	"seem",
	"help",
	"talk",
	"turn",
	"start",
	"show",
	"hear",
	"might",
	"sound",
	"live",
	"believe",
	"hold",
	"bring",
	"occur",
	"must",
	"read",
	"book",
	"story",
	"room",
	"job",
	"week",
	"hour",
	"game",
	"line",
	"end",
	"member",
	"law",
	"car",
	"city",
	"name",
	"team",
	"minute",
	"idea",
	"kid",
	"body",
	"information",
	"nothing",
	"ago",
	"lead",
	"social",
	"understand",
	"whether",
	"watch",
	"together",
	"follow",
	"around",
	"parent",
	"only",
	"stop",
	"face",
	"create",
	"speak",
	"others",
	"level",
	"allow",
	"add",
	"office",
	"spend",
	"door",
	"health",
	"person",
	"art",
	"sure",
	"war",
	"history",
	"party",
	"result",
	"change",
	"morning",
	"reason",
	"research",
	"girl",
	"guy",
	"moment",
	"air",
	"teacher",
	"force",
	"offer",
];

export type TestMode = "30" | "60" | "90" | "15s" | "30s" | "60s" | "quote";

export const TEST_MODES: { value: TestMode; label: string; type: "words" | "time" | "quote" }[] = [
	{ value: "30", label: "30", type: "words" },
	{ value: "60", label: "60", type: "words" },
	{ value: "90", label: "90", type: "words" },
	{ value: "15s", label: "15", type: "time" },
	{ value: "30s", label: "30", type: "time" },
	{ value: "60s", label: "60", type: "time" },
	{ value: "quote", label: "quote", type: "quote" },
];

/**
 * Generates a random sequence of words for typing test
 * @param wordCount Number of words to generate
 * @returns Space-separated string of random words
 */
export function generateRandomWords(wordCount: number): string {
	const words: string[] = [];

	for (let i = 0; i < wordCount; i++) {
		const randomIndex = Math.floor(Math.random() * COMMON_WORDS.length);
		words.push(COMMON_WORDS[randomIndex]);
	}

	return words.join(" ");
}

/**
 * Generates text based on the selected test mode
 * @param mode Test mode (30, 60, 90 words or 15s, 30s, 60s time)
 * @returns Space-separated string of random words
 */
export function generateTextForMode(mode: TestMode): string {
	// For time-based modes, generate a large pool of words (200-300 words)
	// User will type as many as they can in the time limit
	if (mode.endsWith("s")) {
		return generateRandomWords(200);
	}
	
	// For word-based modes
	const wordCount = Number.parseInt(mode, 10);
	return generateRandomWords(wordCount);
}

/**
 * Get the display label for a mode
 */
export function getModeLabel(mode: TestMode): string {
	const modeConfig = TEST_MODES.find(m => m.value === mode);
	return modeConfig?.label || mode;
}

/**
 * Check if a mode is time-based
 */
export function isTimeMode(mode: TestMode): boolean {
	// Time modes are numeric values ending with 's' (e.g., "15s", "30s", "60s")
	return mode.endsWith("s") && !Number.isNaN(Number.parseInt(mode, 10));
}

/**
 * Get the time limit in seconds for time-based modes
 */
export function getTimeLimit(mode: TestMode): number | null {
	if (!mode.endsWith("s")) return null;
	return Number.parseInt(mode, 10);
}

/**
 * Check if a mode is quote-based
 */
export function isQuoteMode(mode: TestMode): boolean {
	return mode === "quote";
}

/**
 * Get the character length range for quote modes
 * Since API doesn't support length filtering, we accept any quote
 */
export function getQuoteLength(mode: TestMode): { minLength: number; maxLength: number } | null {
	if (mode === "quote") {
		return { minLength: 0, maxLength: Number.MAX_SAFE_INTEGER };
	}
	return null;
}
