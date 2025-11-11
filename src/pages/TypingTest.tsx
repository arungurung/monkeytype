import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { useTestHistoryStore } from "../stores/testHistoryStore";
import { generateTextForMode, type TestMode, isTimeMode, getTimeLimit, isQuoteMode } from "../utils/wordGenerator";
import { useQuote } from "../hooks/useQuote";
import { ModeSelector, CompletionMessage, TimerDisplay } from "../components/typing-test";

export function TypingTest() {
	// Get mode and category from store
	const selectedMode = useTestHistoryStore((state) => state.selectedMode);
	const selectedCategory = useTestHistoryStore((state) => state.selectedCategory);
	const setSelectedMode = useTestHistoryStore((state) => state.setSelectedMode);
	const setSelectedCategory = useTestHistoryStore((state) => state.setSelectedCategory);
	const addResult = useTestHistoryStore((state) => state.addResult);
	
	const [mode, setMode] = useState<TestMode>(selectedMode);
	const [modeCategory, setModeCategory] = useState<"time" | "words" | "quote">(selectedCategory);
	const [text, setText] = useState<string>(() => generateTextForMode(selectedMode));
	const [quoteAuthor, setQuoteAuthor] = useState<string | null>(null); // Store quote author
	const [isLoadingQuote, setIsLoadingQuote] = useState(false); // Track quote loading state
	const [userInput, setUserInput] = useState<string>("");
	const [startTime, setStartTime] = useState<number | null>(null);
	const [endTime, setEndTime] = useState<number | null>(null);
	const [isTestActive, setIsTestActive] = useState<boolean>(false);
	const [totalMistakes, setTotalMistakes] = useState<number>(0); // Track all mistakes including corrected ones
	const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // For time-based modes
	const inputRef = useRef<HTMLInputElement>(null);
	const textDisplayRef = useRef<HTMLDivElement>(null);
	const previousInputRef = useRef<string>(""); // Track previous input for comparison
	const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const hasFinishedRef = useRef<boolean>(false); // Prevent duplicate saves
	const startTimeRef = useRef<number | null>(null); // Store start time in ref for timer access
	const totalMistakesRef = useRef<number>(0); // Track mistakes in ref for accurate final count
	const isRefetchingQuoteRef = useRef<boolean>(false); // Prevent duplicate quote fetches
	const currentQuoteModeRef = useRef<TestMode | null>(null); // Track current quote mode to prevent refetch on same mode

	// Fetch quote if in quote mode - always enabled for quote modes to maintain cache
	const { data: quoteData, isLoading: isQuoteLoading, error: quoteError, refetch: refetchQuote } = useQuote(
		mode,
		isQuoteMode(mode)
	);

	// Update loading state
	useEffect(() => {
		if (isQuoteMode(mode)) {
			setIsLoadingQuote(isQuoteLoading);
		} else {
			setIsLoadingQuote(false);
		}
	}, [mode, isQuoteLoading]);

	// Update text when quote is fetched (only when not in active test)
	useEffect(() => {
		if (isQuoteMode(mode) && quoteData && !isTestActive && !endTime) {
			// Update text if:
			// 1. First time loading this mode (currentQuoteModeRef is null or different)
			// 2. Explicitly refetching (isRefetchingQuoteRef is true)
			if (currentQuoteModeRef.current !== mode || isRefetchingQuoteRef.current) {
				setText(quoteData.content);
				setQuoteAuthor(quoteData.author);
				isRefetchingQuoteRef.current = false;
				currentQuoteModeRef.current = mode;
			}
		}
	}, [quoteData, mode, isTestActive, endTime]);

	// Calculate WPM and accuracy - memoized to avoid recalculation on every render
	const stats = useMemo(() => {
		const wordsTyped = userInput.trim().split(/\s+/).length;
		const timeElapsed = startTime
			? ((endTime || Date.now()) - startTime) / 1000 / 60
			: 0;
		const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;

		// Calculate accuracy based on total mistakes (including corrected ones)
		const totalCharsTyped = userInput.length + totalMistakes;
		const accuracy =
			totalCharsTyped > 0
				? Math.round(((totalCharsTyped - totalMistakes) / totalCharsTyped) * 100)
				: 100;

		return { wpm, accuracy, timeElapsed };
	}, [userInput, startTime, endTime, totalMistakes]);

	// Function to end the test and save results
	const finishTest = useCallback(() => {
		// Prevent duplicate calls
		if (hasFinishedRef.current) return;
		hasFinishedRef.current = true;
		
		const endTimeValue = Date.now();
		setEndTime(endTimeValue);
		setIsTestActive(false);
		
		// Clear timer if exists
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
			timerIntervalRef.current = null;
		}
		
		// Get the final input from the ref (most up-to-date value)
		const currentInput = previousInputRef.current;
		
		// Don't save if no input
		if (!currentInput || currentInput.length === 0) {
			return;
		}
		
		// Calculate final stats - use startTimeRef for accurate timing
		const actualStartTime = startTimeRef.current || endTimeValue;
		const wordsTyped = currentInput.trim().split(/\s+/).filter(w => w.length > 0).length;
		const timeInSeconds = (endTimeValue - actualStartTime) / 1000;
		const timeElapsedMinutes = timeInSeconds / 60;
		const finalWpm = timeElapsedMinutes > 0 ? Math.round(wordsTyped / timeElapsedMinutes) : 0;
		
		// Calculate accuracy based on totalMistakesRef tracked during typing
		// totalMistakesRef already includes all errors made (including corrected ones)
		const finalErrorCount = totalMistakesRef.current;
		const totalCharsTyped = currentInput.length + finalErrorCount;
		const finalAccuracy = totalCharsTyped > 0
			? Math.round(((totalCharsTyped - finalErrorCount) / totalCharsTyped) * 100)
			: 100;
		
		const result = {
			wpm: finalWpm,
			accuracy: finalAccuracy,
			timeElapsed: timeInSeconds,
			textLength: isTimeMode(mode) ? currentInput.length : text.length,
			errorCount: finalErrorCount,
			text: isTimeMode(mode) ? currentInput : text,
			mode: mode, // Save the actual mode value (e.g., "15s", "30", "short")
			...(quoteAuthor && { author: quoteAuthor }), // Include author if in quote mode
		};
		
		addResult(result);
		
		// Fetch new quote if in quote mode (for next test) - only if not already refetching
		if (isQuoteMode(mode) && !isRefetchingQuoteRef.current) {
			isRefetchingQuoteRef.current = true;
			refetchQuote();
		}
	}, [startTime, text, totalMistakes, addResult, mode, quoteAuthor, refetchQuote]);


	// Handle input change - useCallback to prevent recreation on every render
	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		// Don't process input if test has finished
		if (hasFinishedRef.current) return;
		
		const value = e.target.value;
		const previousInput = previousInputRef.current;

		if (!isTestActive && value.length > 0) {
			setIsTestActive(true);
			const now = Date.now();
			setStartTime(now);
			startTimeRef.current = now; // Store in ref as well
			
			// Start timer for time-based modes
			if (isTimeMode(mode)) {
				const timeLimit = getTimeLimit(mode);
				if (timeLimit) {
					setTimeRemaining(timeLimit);
					
					timerIntervalRef.current = setInterval(() => {
						setTimeRemaining((prev) => {
							if (prev === null || prev <= 1) {
								// Time's up! Call finishTest on next tick
								setTimeout(() => {
									if (timerIntervalRef.current) {
										clearInterval(timerIntervalRef.current);
										timerIntervalRef.current = null;
									}
									finishTest();
								}, 0);
								return 0;
							}
							return prev - 1;
						});
					}, 1000);
				}
			}
		}

		// Track mistakes: check if new characters are incorrect
		if (value.length > previousInput.length) {
			// User is typing new characters
			for (let i = previousInput.length; i < value.length; i++) {
				if (value[i] !== text[i]) {
					totalMistakesRef.current += 1;
					setTotalMistakes((prev) => prev + 1);
				}
			}
		}

		// Update ref FIRST before state (important for timer finish)
		previousInputRef.current = value;
		setUserInput(value);

		// For word-based modes, check if test is complete
		if (!isTimeMode(mode) && value.length >= text.length) {
			finishTest();
		}
	}, [isTestActive, text, mode, finishTest]);

	// Reset test - useCallback to prevent recreation
	const resetTest = useCallback(() => {
		setUserInput("");
		setStartTime(null);
		startTimeRef.current = null; // Reset ref as well
		setEndTime(null);
		setIsTestActive(false);
		setTotalMistakes(0);
		totalMistakesRef.current = 0; // Reset mistakes ref
		setTimeRemaining(null);
		previousInputRef.current = "";
		hasFinishedRef.current = false; // Reset finish flag
		
		// Clear timer if exists
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
			timerIntervalRef.current = null;
		}
		
		// Fetch new quote if in quote mode - only if not already refetching
		if (isQuoteMode(mode) && !isRefetchingQuoteRef.current) {
			isRefetchingQuoteRef.current = true;
			refetchQuote();
		}
		
		inputRef.current?.focus();
	}, [mode, refetchQuote]);

	// Handle mode change
	const handleModeChange = useCallback((newMode: TestMode) => {
		// Clear text immediately when switching to a different quote mode
		if (isQuoteMode(newMode) && isQuoteMode(mode) && newMode !== mode) {
			setText("");
			setQuoteAuthor(null);
			// Don't set currentQuoteModeRef here - let useEffect handle it
		}
		
		setMode(newMode);
		setSelectedMode(newMode); // Persist to store
		
		// Determine category based on mode
		const newCategory = isQuoteMode(newMode) ? "quote" : isTimeMode(newMode) ? "time" : "words";
		setModeCategory(newCategory);
		
		// For non-quote modes, generate text immediately
		if (!isQuoteMode(newMode)) {
			setText(generateTextForMode(newMode));
			setQuoteAuthor(null);
		}
		// For quote modes, text will be set by useEffect when quote is fetched
		
		setUserInput("");
		setStartTime(null);
		startTimeRef.current = null; // Reset ref
		setEndTime(null);
		setIsTestActive(false);
		setTotalMistakes(0);
		totalMistakesRef.current = 0; // Reset mistakes ref
		setTimeRemaining(null);
		previousInputRef.current = "";
		hasFinishedRef.current = false; // Reset finish flag
		
		// Clear timer if exists
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
			timerIntervalRef.current = null;
		}
		
		inputRef.current?.focus();
	}, [setSelectedMode, mode]);

	// Handle category change
	const handleCategoryChange = useCallback((category: "time" | "words" | "quote") => {
		setModeCategory(category);
		setSelectedCategory(category); // Persist to store
		// Set default mode for the category
		let defaultMode: TestMode;
		if (category === "time") {
			defaultMode = "15s";
		} else if (category === "quote") {
			defaultMode = "quote";
		} else {
			defaultMode = "30";
		}
		handleModeChange(defaultMode);
	}, [handleModeChange, setSelectedCategory]);

	// Click on text display to focus input - useCallback
	const handleTextClick = useCallback(() => {
		inputRef.current?.focus();
	}, []);

	// Memoized character renderer
	const CharacterSpan = memo(({ char, index, userInput }: { char: string; index: number; userInput: string }) => {
		let className = "text-gray-500";

		if (index < userInput.length) {
			if (userInput[index] === char) {
				className = "text-green-400";
			} else {
				className = "text-red-400";
			}
		} else if (index === userInput.length) {
			className = "text-gray-200 border-b-2 border-[oklch(92%_0.084_155.995)] animate-pulse";
		}

		return (
			<span className={className}>
				{char}
			</span>
		);
	});

	CharacterSpan.displayName = "CharacterSpan";

	// Render words to allow proper wrapping - memoized
	const renderedText = useMemo(() => {
		const words = text.split(" ");
		let charIndex = 0;

		return words.map((word, wordIndex) => {
			const wordChars = word.split("").map((char) => {
				const currentIndex = charIndex;
				charIndex++;
				return <CharacterSpan key={currentIndex} char={char} index={currentIndex} userInput={userInput} />;
			});

			// Add space after word (except last word)
			if (wordIndex < words.length - 1) {
				const spaceIndex = charIndex;
				charIndex++;
				
				let spaceClassName = "text-gray-500";
				if (spaceIndex < userInput.length) {
					if (userInput[spaceIndex] === " ") {
						spaceClassName = "text-green-400";
					} else {
					spaceClassName = "text-red-400 bg-red-500/20";
				}
			} else if (spaceIndex === userInput.length) {
				spaceClassName = "text-gray-200 border-b-2 border-[oklch(92%_0.084_155.995)] animate-pulse";
			}				const spaceElement = (
					<span key={`space-${spaceIndex}`} className={spaceClassName}>
						&nbsp;
					</span>
				);
				return (
					<span key={wordIndex} className="inline-block">
						{wordChars}
						{spaceElement}
					</span>
				);
			}

			return (
				<span key={wordIndex} className="inline-block">
					{wordChars}
				</span>
			);
		});
	}, [text, userInput]);

	// Focus input on mount
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	// Focus input after quote finishes loading
	useEffect(() => {
		if (!isLoadingQuote && text) {
			inputRef.current?.focus();
		}
	}, [isLoadingQuote, text]);

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				resetTest();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [resetTest]);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (timerIntervalRef.current) {
				clearInterval(timerIntervalRef.current);
			}
		};
	}, []);

	return (
		<div className="mx-auto w-full">
			{/* Mode Selector - Always reserve space */}
			<ModeSelector
				mode={mode}
				modeCategory={modeCategory}
				isTestActive={isTestActive}
				endTime={endTime}
				onCategoryChange={handleCategoryChange}
				onModeChange={handleModeChange}
			/>

			{/* Content area with padding for fixed bar */}
			<div className="pt-24">
				{/* Loading state for quote fetching */}
				{isQuoteMode(mode) && isQuoteLoading && !isTestActive && !endTime && (
					<div className="mb-6 flex justify-center">
						<div className="text-gray-400 animate-pulse">Loading quote...</div>
					</div>
				)}

				{/* Error state for quote fetching */}
				{isQuoteMode(mode) && quoteError && !isTestActive && !endTime && (
					<div className="mb-6 flex justify-center">
						<div className="text-red-400">Failed to load quote. Please try again.</div>
					</div>
				)}

				{/* Timer Display for time-based modes */}
				{isTestActive && isTimeMode(mode) && timeRemaining !== null && (
					<TimerDisplay timeRemaining={timeRemaining} />
				)}

				{/* Text Display - Only visible element */}
				<div
					ref={textDisplayRef}
					onClick={handleTextClick}
					className="cursor-text relative min-h-[250px] flex items-center justify-center w-full"
				>
					{/* Show text only if not loading a quote, or if already loaded */}
					{(!isQuoteMode(mode) || (isQuoteMode(mode) && !isLoadingQuote && text)) && (
						<div className="text-lg sm:text-xl lg:text-2xl leading-relaxed sm:leading-relaxed lg:leading-relaxed font-mono select-none w-full px-4">
							{renderedText}
							{quoteAuthor && (
								<div className="mt-6 text-sm text-gray-500 italic text-center">
									— {quoteAuthor}
								</div>
							)}
						</div>
					)}

					{/* Hidden input for capturing keystrokes */}
					<input
						ref={inputRef}
						type="text"
						value={userInput}
						onChange={handleInputChange}
						disabled={endTime !== null}
						className="absolute opacity-0 pointer-events-none"
						autoComplete="off"
						spellCheck={false}
						autoCapitalize="off"
						autoCorrect="off"
						aria-hidden="true"
					/>
				</div>

				{/* Completion Message */}
				{endTime && (
					<CompletionMessage
						wpm={stats.wpm}
						accuracy={stats.accuracy}
						timeElapsed={stats.timeElapsed}
						onReset={resetTest}
					/>
				)}
			</div>
		</div>
	);
}
