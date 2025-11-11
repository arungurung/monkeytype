import { useEffect, useState } from "react";

interface SplashScreenProps {
	isLoading: boolean;
	onComplete: () => void;
}

export function SplashScreen({ isLoading, onComplete }: SplashScreenProps) {
	const [fadeOut, setFadeOut] = useState(false);

	useEffect(() => {
		if (!isLoading) {
			// Start fade out animation
			setFadeOut(true);
			// Call onComplete after animation
			const timer = setTimeout(onComplete, 500);
			return () => clearTimeout(timer);
		}
	}, [isLoading, onComplete]);

	if (!isLoading && !fadeOut) return null;

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 transition-opacity duration-500 ${
				fadeOut ? "opacity-0" : "opacity-100"
			}`}
		>
			<div className="text-center">
				<div className="mb-8">
					<h1 className="text-6xl font-bold text-[oklch(92%_0.084_155.995)] mb-4 animate-pulse">
						MonkeyType
					</h1>
					<p className="text-gray-400 text-lg">Loading your typing experience...</p>
				</div>
				
				{/* Animated loading bars */}
				<div className="flex justify-center gap-2">
					{[0, 1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="w-2 h-12 bg-[oklch(92%_0.084_155.995)] rounded-full animate-pulse"
							style={{
								animationDelay: `${i * 0.15}s`,
								animationDuration: "1s",
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
