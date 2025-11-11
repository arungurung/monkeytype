interface TimerDisplayProps {
	timeRemaining: number;
}

/**
 * Timer display for time-based test modes
 */
export function TimerDisplay({ timeRemaining }: TimerDisplayProps) {
	return (
		<div className="mb-6 flex justify-center animate-in fade-in slide-in-from-top-4 duration-500">
			<div className="bg-slate-900/50 backdrop-blur-sm border border-[oklch(92%_0.084_155.995)]/30 rounded-xl px-6 py-3">
				<div className="text-3xl font-bold text-[oklch(92%_0.084_155.995)] tabular-nums">
					{timeRemaining}s
				</div>
			</div>
		</div>
	);
}
