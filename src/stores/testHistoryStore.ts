import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TestMode } from "../utils/wordGenerator";

// TypeScript types for test results
export interface TestResult {
	id: string;
	date: number; // Unix timestamp
	wpm: number;
	accuracy: number;
	timeElapsed: number; // in seconds
	textLength: number;
	errorCount: number;
	text: string; // Sample text used for the test
	mode?: string; // Test mode (30, 60, or 90 words) - optional for backward compatibility
	author?: string; // Quote author (for quote mode)
}

export interface TestHistoryState {
	results: TestResult[];
	selectedMode: TestMode;
	selectedCategory: "time" | "words" | "quote";
	addResult: (result: Omit<TestResult, "id" | "date">) => void;
	clearHistory: () => void;
	deleteResult: (id: string) => void;
	setSelectedMode: (mode: TestMode) => void;
	setSelectedCategory: (category: "time" | "words" | "quote") => void;
	getStats: () => {
		totalTests: number;
		averageWpm: number;
		bestWpm: number;
		worstWpm: number;
		averageAccuracy: number;
		bestAccuracy: number;
	};
}

export const useTestHistoryStore = create<TestHistoryState>()(
	persist(
		(set, get) => ({
			results: [],
			selectedMode: "30",
			selectedCategory: "words",

			addResult: (result) => {
				const newResult: TestResult = {
					...result,
					id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					date: Date.now(),
				};

				set((state) => ({
					results: [newResult, ...state.results], // Most recent first
				}));
			},

			clearHistory: () => {
				set({ results: [] });
			},

			deleteResult: (id) => {
				set((state) => ({
					results: state.results.filter((result) => result.id !== id),
				}));
			},

			setSelectedMode: (mode) => {
				set({ selectedMode: mode });
			},

			setSelectedCategory: (category) => {
				set({ selectedCategory: category });
			},

			getStats: () => {
				const { results } = get();

				if (results.length === 0) {
					return {
						totalTests: 0,
						averageWpm: 0,
						bestWpm: 0,
						worstWpm: 0,
						averageAccuracy: 0,
						bestAccuracy: 0,
					};
				}

				const wpms = results.map((r) => r.wpm);
				const accuracies = results.map((r) => r.accuracy);

				return {
					totalTests: results.length,
					averageWpm: Math.round(
						wpms.reduce((a, b) => a + b, 0) / wpms.length,
					),
					bestWpm: Math.max(...wpms),
					worstWpm: Math.min(...wpms),
					averageAccuracy: Math.round(
						accuracies.reduce((a, b) => a + b, 0) / accuracies.length,
					),
					bestAccuracy: Math.max(...accuracies),
				};
			},
		}),
		{
			name: "monkeytype-history", // localStorage key
		},
	),
);
