import { TEST_MODES, type TestMode } from "../../utils/wordGenerator";

interface ModeSelectorProps {
	mode: TestMode;
	modeCategory: "time" | "words" | "quote";
	isTestActive: boolean;
	endTime: number | null;
	onCategoryChange: (category: "time" | "words" | "quote") => void;
	onModeChange: (mode: TestMode) => void;
}

/**
 * Mode selector component for choosing test type and duration
 */
export function ModeSelector({
	mode,
	modeCategory,
	isTestActive,
	endTime,
	onCategoryChange,
	onModeChange,
}: ModeSelectorProps) {
	return (
		<div className="fixed top-[73px] left-0 right-0 z-40 py-4">
			<div className={`container mx-auto px-4 flex items-center justify-center gap-8 transition-opacity duration-300 ${
				isTestActive || endTime ? "opacity-0 pointer-events-none" : "opacity-100"
			}`}>
				{/* Primary Category Selection */}
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => onCategoryChange("time")}
						className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
							modeCategory === "time"
								? "text-[oklch(92%_0.084_155.995)] scale-105"
								: "text-gray-500 hover:text-gray-300"
						}`}
					>
						time
					</button>
					<button
						type="button"
						onClick={() => onCategoryChange("words")}
						className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
							modeCategory === "words"
								? "text-[oklch(92%_0.084_155.995)] scale-105"
								: "text-gray-500 hover:text-gray-300"
						}`}
					>
						words
					</button>
					<button
						type="button"
						onClick={() => onCategoryChange("quote")}
						className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
							modeCategory === "quote"
								? "text-[oklch(92%_0.084_155.995)] scale-105"
								: "text-gray-500 hover:text-gray-300"
						}`}
					>
						quote
					</button>
				</div>

				{/* Secondary Options based on Category - Hidden for quote mode */}
				{modeCategory !== "quote" && (
					<div className="flex items-center gap-3">
						{TEST_MODES.filter(m => m.type === modeCategory).map((testMode, index) => (
							<button
								key={testMode.value}
								type="button"
								onClick={() => onModeChange(testMode.value)}
								style={{ transitionDelay: `${index * 50}ms` }}
								className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
									mode === testMode.value
										? "text-[oklch(92%_0.084_155.995)] scale-105"
										: "text-gray-500 hover:text-gray-300"
								}`}
							>
								{testMode.label}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
