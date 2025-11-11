import {
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import { AppLayout } from "./components/AppLayout";
import { TypingTest } from "./pages/TypingTest";
import { History } from "./pages/History";

const rootRoute = createRootRoute({
	component: AppLayout,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: TypingTest,
});

const historyRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/history",
	component: History,
});

const routeTree = rootRoute.addChildren([indexRoute, historyRoute]);

export const router = createRouter({ routeTree });
