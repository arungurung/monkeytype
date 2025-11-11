import { RotateCcw } from "lucide-react";

interface CompletionMessageProps {
	wpm: number;
	accuracy: number;
	timeElapsed: number;
	onReset: () => void;
}

/**
 * Completion message displayed after test finishes
 */
export function CompletionMessage({ wpm, accuracy, timeElapsed, onReset }: CompletionMessageProps) {
	return (
		<div className="mt-12 sm:mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<div className="bg-linear-to-br from-emerald-950/40 via-emerald-900/40 to-teal-950/40 backdrop-blur-sm border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-500/10">
				<div className="text-center mb-6">
					<div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full mb-4 animate-bounce">
						<span className="text-3xl sm:text-4xl">🎉</span>
					</div>
					<h3 className="text-3xl sm:text-4xl font-bold bg-linear-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
						Test Complete!
					</h3>
					<p className="text-gray-400 text-sm sm:text-base">
						Great job! Here are your results
					</p>
				</div>
				<div className="flex flex-wrap justify-center gap-8 sm:gap-12">
					<div className="text-center group">
						<div className="text-4xl sm:text-5xl font-bold text-[oklch(92%_0.084_155.995)] tabular-nums transition-transform group-hover:scale-110">
							{wpm}
						</div>
						<div className="text-xs sm:text-sm text-gray-400 mt-2 font-medium tracking-wide">
							Words Per Minute
						</div>
					</div>
					<div className="text-center group">
						<div className="text-4xl sm:text-5xl font-bold bg-linear-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent tabular-nums transition-transform group-hover:scale-110">
							{accuracy}%
						</div>
						<div className="text-xs sm:text-sm text-gray-400 mt-2 font-medium tracking-wide">
							Accuracy
						</div>
					</div>
					<div className="text-center group">
						<div className="text-4xl sm:text-5xl font-bold bg-linear-to-br from-purple-400 to-pink-500 bg-clip-text text-transparent tabular-nums transition-transform group-hover:scale-110">
							{Math.round(timeElapsed * 60)}s
						</div>
						<div className="text-xs sm:text-sm text-gray-400 mt-2 font-medium tracking-wide">
							Time Taken
						</div>
					</div>
				</div>
				<div className="mt-8 flex justify-center">
					<button
						type="button"
						onClick={onReset}
						className="bg-[oklch(92%_0.084_155.995)] hover:bg-[oklch(88%_0.084_155.995)] active:scale-95 text-slate-950 px-8 py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[oklch(92%_0.084_155.995)]/50 hover:shadow-xl hover:shadow-[oklch(92%_0.084_155.995)]/20 group"
						aria-label="Reset typing test"
					>
						<RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
						<span className="tracking-wide">Try Again</span>
					</button>
				</div>
			</div>
		</div>
	);
}
