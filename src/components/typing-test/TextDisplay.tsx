import { memo } from "react";

interface TextDisplayProps {
	text: string;
	userInput: string;
	quoteAuthor: string | null;
	inputRef: React.RefObject<HTMLInputElement>;
	textDisplayRef: React.RefObject<HTMLDivElement>;
	endTime: number | null;
	onTextClick: () => void;
	onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Character span component for rendering individual characters with styling
 */
const CharacterSpan = memo(({ char, index, userInput }: { char: string; index: number; userInput: string }) => {
	const isActive = index === userInput.length;
	const isTyped = index < userInput.length;
	const isCorrect = isTyped && userInput[index] === char;
	const isIncorrect = isTyped && userInput[index] !== char;

	return (
		<span
			key={index}
			className={`relative transition-colors duration-100 ${
				isActive
					? "bg-[oklch(92%_0.084_155.995)]/20 text-white animate-pulse"
					: isIncorrect
						? "text-red-400 bg-red-500/20"
						: isCorrect
							? "text-gray-400"
							: "text-gray-600"
			}`}
		>
			{char === " " ? "\u00A0" : char}
			{isActive && (
				<span className="absolute left-0 top-0 h-full w-0.5 bg-[oklch(92%_0.084_155.995)] animate-pulse" />
			)}
		</span>
	);
});
CharacterSpan.displayName = "CharacterSpan";

/**
 * Text display component for showing the typing test text
 */
export function TextDisplay({
	text,
	userInput,
	quoteAuthor,
	inputRef,
	textDisplayRef,
	endTime,
	onTextClick,
	onInputChange,
}: TextDisplayProps) {
	// Render text as individual character spans
	const renderedText = text.split("").map((char, index) => (
		<CharacterSpan key={index} char={char} index={index} userInput={userInput} />
	));

	return (
		<div
			ref={textDisplayRef}
			onClick={onTextClick}
			className="cursor-text relative min-h-[250px] flex items-center justify-center w-full"
		>
			<div className="text-lg sm:text-xl lg:text-2xl leading-relaxed sm:leading-relaxed lg:leading-relaxed font-mono select-none w-full px-4">
				{renderedText}
				{quoteAuthor && (
					<div className="mt-6 text-sm text-gray-500 italic text-center">
						— {quoteAuthor}
					</div>
				)}
			</div>

			{/* Hidden input for capturing keystrokes */}
			<input
				ref={inputRef}
				type="text"
				value={userInput}
				onChange={onInputChange}
				disabled={endTime !== null}
				className="absolute opacity-0 pointer-events-none"
				autoComplete="off"
				spellCheck={false}
				autoCapitalize="off"
				autoCorrect="off"
				aria-hidden="true"
			/>
		</div>
	);
}
