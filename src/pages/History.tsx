import { useTestHistoryStore } from "../stores/testHistoryStore";
import { Trash2, Download, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { StatsChart } from "../components/StatsChart";
import { useState, useMemo } from "react";
import { isTimeMode, isQuoteMode } from "../utils/wordGenerator";

export function History() {
	const { results, deleteResult, clearHistory, getStats } =
		useTestHistoryStore();
	const stats = getStats();
	const [expandedModes, setExpandedModes] = useState<Set<string>>(new Set());

	// Group results by main category (Time/Words/Quote) and then by mode
	const groupedResults = useMemo(() => {
		const timeGroup = new Map<string, typeof results>();
		const wordsGroup = new Map<string, typeof results>();
		const quoteGroup = new Map<string, typeof results>();
		
		for (const result of results) {
			const mode = result.mode || "Custom";
			const isTime = isTimeMode(mode as any);
			const isQuote = isQuoteMode(mode as any);
			
			let targetGroup;
			if (isQuote) {
				targetGroup = quoteGroup;
			} else if (isTime) {
				targetGroup = timeGroup;
			} else {
				targetGroup = wordsGroup;
			}
			
			if (!targetGroup.has(mode)) {
				targetGroup.set(mode, []);
			}
			targetGroup.get(mode)!.push(result);
		}
		
		const categories: Array<{
			category: string;
			modes: Array<{ mode: string; tests: typeof results; count: number }>;
		}> = [];
		
		if (timeGroup.size > 0) {
			categories.push({
				category: "Time",
				modes: Array.from(timeGroup.entries()).map(([mode, tests]) => ({
					mode,
					tests,
					count: tests.length,
				})),
			});
		}
		
		if (wordsGroup.size > 0) {
			categories.push({
				category: "Words",
				modes: Array.from(wordsGroup.entries()).map(([mode, tests]) => ({
					mode,
					tests,
					count: tests.length,
				})),
			});
		}
		
		if (quoteGroup.size > 0) {
			categories.push({
				category: "Quote",
				modes: Array.from(quoteGroup.entries()).map(([mode, tests]) => ({
					mode,
					tests,
					count: tests.length,
				})),
			});
		}
		
		return categories;
	}, [results]);

	const toggleMode = (mode: string) => {
		setExpandedModes(prev => {
			const next = new Set(prev);
			if (next.has(mode)) {
				next.delete(mode);
			} else {
				next.add(mode);
			}
			return next;
		});
	};

	// Format mode for display (e.g., "15s" -> "15 seconds", "30" -> "30 words")
	const formatMode = (mode: string, category: string) => {
		if (category === "Time") {
			return `${mode.replace("s", "")} seconds`;
		}
		if (category === "Words") {
			return `${mode} words`;
		}
		return mode; // Quote modes display as-is (short, medium, long)
	};

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatTime = (seconds: number) => {
		return `${Math.floor(seconds)}s`;
	};

	const exportToJSON = () => {
		const dataStr = JSON.stringify(results, null, 2);
		const dataBlob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `monkeytype-history-${Date.now()}.json`;
		link.click();
		URL.revokeObjectURL(url);
	};

	const handleClearHistory = () => {
		if (
			window.confirm(
				"Are you sure you want to clear all test history? This cannot be undone.",
			)
		) {
			clearHistory();
		}
	};

	return (
		<div className="max-w-7xl mx-auto w-full">
			{/* Stats Summary */}
			<div className="mb-8">
				<h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 flex items-center gap-3">
					<TrendingUp className="w-8 h-8 text-[oklch(92%_0.084_155.995)]" />
					Your Statistics
				</h1>

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
					<div className="bg-linear-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center">
						<div className="text-2xl sm:text-3xl font-bold text-[oklch(92%_0.084_155.995)]">
							{stats.totalTests}
						</div>
						<div className="text-xs sm:text-sm text-gray-400 mt-1">
							Total Tests
						</div>
					</div>
					<div className="bg-linear-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center">
						<div className="text-2xl sm:text-3xl font-bold text-green-400">
							{stats.averageWpm}
						</div>
						<div className="text-xs sm:text-sm text-gray-400 mt-1">
							Avg WPM
						</div>
					</div>
					<div className="bg-linear-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center">
						<div className="text-2xl sm:text-3xl font-bold text-blue-400">
							{stats.bestWpm}
						</div>
						<div className="text-xs sm:text-sm text-gray-400 mt-1">Best WPM</div>
					</div>
					<div className="bg-linear-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center">
						<div className="text-2xl sm:text-3xl font-bold text-purple-400">
							{stats.worstWpm}
						</div>
						<div className="text-xs sm:text-sm text-gray-400 mt-1">
							Worst WPM
						</div>
					</div>
					<div className="bg-linear-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center">
						<div className="text-2xl sm:text-3xl font-bold text-cyan-400">
							{stats.averageAccuracy}%
						</div>
						<div className="text-xs sm:text-sm text-gray-400 mt-1">
							Avg Accuracy
						</div>
					</div>
					<div className="bg-linear-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center">
						<div className="text-2xl sm:text-3xl font-bold text-pink-400">
							{stats.bestAccuracy}%
						</div>
						<div className="text-xs sm:text-sm text-gray-400 mt-1">
							Best Accuracy
						</div>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-wrap gap-3 mb-6">
				<button
					type="button"
					onClick={exportToJSON}
					disabled={results.length === 0}
					className="bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Download className="w-4 h-4" />
					Export Data
				</button>
				<button
					type="button"
					onClick={handleClearHistory}
					disabled={results.length === 0}
					className="bg-linear-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-700 disabled:to-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Trash2 className="w-4 h-4" />
					Clear History
				</button>
			</div>

			{/* Test History Grouped by Category and Mode */}
			<div className="space-y-6">
				{results.length === 0 ? (
					<div className="bg-linear-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-16 text-center text-gray-400">
						<p className="text-lg">No test history yet</p>
						<p className="text-sm mt-2">
							Complete some typing tests to see your progress!
						</p>
					</div>
				) : (
					groupedResults.map(({ category, modes }) => (
						<div key={category} className="space-y-3">
							{/* Category Header */}
							<h2 className="text-2xl font-bold text-white flex items-center gap-2">
								<span className="text-[oklch(92%_0.084_155.995)]">{category}</span>
								<span className="text-gray-500 text-lg">
									({modes.reduce((sum, m) => sum + m.count, 0)} {modes.reduce((sum, m) => sum + m.count, 0) === 1 ? "test" : "tests"})
								</span>
							</h2>
							
							{/* Modes within category */}
							<div className="space-y-3">
								{modes.map(({ mode, tests, count }) => {
									const isExpanded = expandedModes.has(mode);
									const displayedTests = isExpanded ? tests : tests.slice(0, 5);
									const hasMoreTests = tests.length > 5;

									return (
										<div
											key={mode}
											className="bg-linear-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden"
										>
											{/* Mode Header */}
											<div className="bg-slate-800/50 border-b border-white/5 px-4 py-3 flex items-center justify-between">
												<div className="flex items-center gap-3">
													<h3 className="text-lg font-semibold text-[oklch(92%_0.084_155.995)]">
														{formatMode(mode, category)}
													</h3>
													<span className="text-sm text-gray-400">
														({count} {count === 1 ? "test" : "tests"})
													</span>
												</div>
											</div>

											{/* Tests Table */}
											<div className="overflow-x-auto">
												<table className="w-full">
													<thead className="bg-slate-800/30 border-b border-white/5">
														<tr>
															<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
																Date
															</th>
															<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
																WPM
															</th>
															<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
																Accuracy
															</th>
															<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
																Time
															</th>
															<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
																Errors
															</th>
															{category === "Quote" && (
																<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
																	Author
																</th>
															)}
															<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
																Actions
															</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-white/5">
														{displayedTests.map((result) => (
															<tr
																key={result.id}
																className="hover:bg-white/5 transition-colors"
															>
																<td className="px-4 py-3 text-sm text-gray-300">
																	{formatDate(result.date)}
																</td>
																<td className="px-4 py-3 text-center">
																	<span className="text-lg font-semibold text-green-400">
																		{result.wpm}
																	</span>
																</td>
																<td className="px-4 py-3 text-center">
																	<span className="text-lg font-semibold text-blue-400">
																		{result.accuracy}%
																	</span>
																</td>
																<td className="px-4 py-3 text-center text-sm text-gray-300">
																	{formatTime(result.timeElapsed)}
																</td>
																<td className="px-4 py-3 text-center">
																	<span
																		className={`text-sm font-medium ${
																			result.errorCount === 0
																				? "text-green-400"
																				: "text-red-400"
																		}`}
																	>
																		{result.errorCount}
																	</span>
																</td>
																{category === "Quote" && (
																	<td className="px-4 py-3 text-center text-sm text-gray-300 italic">
																		{result.author || "Unknown"}
																	</td>
																)}
																<td className="px-4 py-3 text-center">
																	<button
																		type="button"
																		onClick={() => deleteResult(result.id)}
																		className="text-red-400 hover:text-red-300 transition-colors p-1"
																		aria-label="Delete result"
																	>
																		<Trash2 className="w-4 h-4" />
																	</button>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>

											{/* Show All / Show Less Button */}
											{hasMoreTests && (
												<div className="border-t border-white/5 p-4">
													<button
														type="button"
														onClick={() => toggleMode(mode)}
														className="w-full flex items-center justify-center gap-2 text-[oklch(92%_0.084_155.995)] hover:text-[oklch(88%_0.084_155.995)] transition-colors py-2 font-medium"
													>
														{isExpanded ? (
															<>
																<ChevronUp className="w-5 h-5" />
																Show Less
															</>
														) : (
															<>
																<ChevronDown className="w-5 h-5" />
																View All {count} Tests
															</>
														)}
													</button>
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
					))
				)}
			</div>

			{/* Charts Section */}
			{results.length > 0 && (
				<div className="mt-8">
					<h2 className="text-2xl font-bold text-white mb-6">
						Performance Trends
					</h2>
					<StatsChart results={results} />
				</div>
			)}
		</div>
	);
}
