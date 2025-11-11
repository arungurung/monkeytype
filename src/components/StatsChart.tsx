import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import type { TestResult } from "../stores/testHistoryStore";

interface StatsChartProps {
	results: TestResult[];
}

export function StatsChart({ results }: StatsChartProps) {
	// Prepare data for charts (reverse to show oldest first)
	const chartData = [...results]
		.reverse()
		.map((result, index) => ({
			test: index + 1,
			wpm: result.wpm,
			accuracy: result.accuracy,
			date: new Date(result.date).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			}),
		}))
		.slice(-20); // Show last 20 tests

	if (results.length === 0) {
		return (
			<div className="text-center py-16 text-gray-400">
				<p className="text-lg">No data to display</p>
				<p className="text-sm mt-2">
					Complete some tests to see your progress charts!
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* WPM Over Time */}
			<div className="bg-linear-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
				<h3 className="text-xl font-bold text-white mb-4">
					Words Per Minute (WPM) Over Time
				</h3>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
						<XAxis dataKey="date" stroke="#94a3b8" />
						<YAxis stroke="#94a3b8" />
						<Tooltip
							contentStyle={{
								backgroundColor: "#1e293b",
								border: "1px solid #334155",
								borderRadius: "8px",
								color: "#f1f5f9",
							}}
						/>
						<Legend />
						<Line
							type="monotone"
							dataKey="wpm"
							stroke="#10b981"
							strokeWidth={2}
							dot={{ fill: "#10b981", r: 4 }}
							activeDot={{ r: 6 }}
							name="WPM"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>

			{/* Accuracy Over Time */}
			<div className="bg-linear-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
				<h3 className="text-xl font-bold text-white mb-4">
					Accuracy Over Time
				</h3>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
						<XAxis dataKey="date" stroke="#94a3b8" />
						<YAxis stroke="#94a3b8" domain={[0, 100]} />
						<Tooltip
							contentStyle={{
								backgroundColor: "#1e293b",
								border: "1px solid #334155",
								borderRadius: "8px",
								color: "#f1f5f9",
							}}
						/>
						<Legend />
						<Line
							type="monotone"
							dataKey="accuracy"
							stroke="#3b82f6"
							strokeWidth={2}
							dot={{ fill: "#3b82f6", r: 4 }}
							activeDot={{ r: 6 }}
							name="Accuracy (%)"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>

			{/* Combined Chart */}
			<div className="bg-linear-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
				<h3 className="text-xl font-bold text-white mb-4">
					Performance Overview
				</h3>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
						<XAxis dataKey="date" stroke="#94a3b8" />
						<YAxis stroke="#94a3b8" />
						<Tooltip
							contentStyle={{
								backgroundColor: "#1e293b",
								border: "1px solid #334155",
								borderRadius: "8px",
								color: "#f1f5f9",
							}}
						/>
						<Legend />
						<Line
							type="monotone"
							dataKey="wpm"
							stroke="#10b981"
							strokeWidth={2}
							dot={{ fill: "#10b981", r: 3 }}
							name="WPM"
						/>
						<Line
							type="monotone"
							dataKey="accuracy"
							stroke="#3b82f6"
							strokeWidth={2}
							dot={{ fill: "#3b82f6", r: 3 }}
							name="Accuracy (%)"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
