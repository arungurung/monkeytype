import { useEffect, useState } from "react";

/**
 * Component that displays a warning message on mobile/small screens
 * Detects screen width below 768px (mobile/tablet breakpoint)
 */
export function MobileWarning() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Check on mount
		checkMobile();

		// Check on resize
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	if (!isMobile) return null;

	return (
		<div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center p-6">
			<div className="max-w-md text-center space-y-6">
				{/* Icon */}
				<div className="flex justify-center">
					<svg
						className="w-20 h-20 text-[oklch(92%_0.084_155.995)]"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
				</div>

				{/* Title */}
				<h1 className="text-3xl font-bold text-white">
					Desktop Only
				</h1>

				{/* Message */}
				<p className="text-gray-400 text-lg leading-relaxed">
					MonkeyType is optimized for desktop keyboards and larger screens.
					Please visit on a desktop or laptop computer for the best typing experience.
				</p>

				{/* Additional info */}
				<p className="text-sm text-gray-500">
					Minimum width: 768px
				</p>
			</div>
		</div>
	);
}
