import { Outlet, Link } from "@tanstack/react-router";
import { Keyboard } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { SplashScreen } from "./SplashScreen";
import { MobileWarning } from "./MobileWarning";
import { usePrefetchQuotes } from "../hooks/usePrefetchQuotes";

export function AppLayout() {
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [showSplash, setShowSplash] = useState(true);

	// Prefetch all quote modes on mount
	usePrefetchQuotes();

	// Simulate initial app loading (fonts, resources, etc.)
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsInitialLoading(false);
		}, 1500); // Give enough time for prefetch to complete

		return () => clearTimeout(timer);
	}, []);

	const handleSplashComplete = useCallback(() => {
		setShowSplash(false);
	}, []);

	return (
		<>
			<MobileWarning />
			{showSplash && (
				<SplashScreen 
					isLoading={isInitialLoading} 
					onComplete={handleSplashComplete}
				/>
			)}
			<div className="min-h-screen bg-slate-950 text-gray-100 flex flex-col">
				<header className="border-b border-white/5 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
					<nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
					<Link
						to="/"
						className="flex items-center gap-2.5 text-[oklch(92%_0.084_155.995)] hover:text-[oklch(88%_0.084_155.995)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[oklch(92%_0.084_155.995)]/50 rounded-lg px-2 py-1 -ml-2 group"
					>
						<Keyboard className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-2 transition-transform" />
						<span className="text-lg sm:text-xl font-bold tracking-tight hidden xs:inline">
							MonkeyType Clone
						</span>
						<span className="text-lg sm:text-xl font-bold tracking-tight xs:hidden">
							MT Clone
						</span>
					</Link>

					<div className="flex items-center gap-2">
						<Link
							to="/"
							className="text-gray-400 hover:text-white transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[oklch(92%_0.084_155.995)]/50 rounded-lg px-4 py-2 hover:bg-white/5"
						>
							Test
						</Link>
						<Link
							to="/history"
							className="text-gray-400 hover:text-white transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[oklch(92%_0.084_155.995)]/50 rounded-lg px-4 py-2 hover:bg-white/5"
						>
							History
						</Link>
					</div>
				</nav>
				</header>

				<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex-1 flex items-center">
					<div className="w-full">
						<Outlet />
					</div>
				</main>

				<footer className="border-t border-white/5 mt-auto">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-xs sm:text-sm">
						<p className="font-light">
							Built with React + TypeScript + TailwindCSS
						</p>
					</div>
				</footer>
			</div>
		</>
	);
}
