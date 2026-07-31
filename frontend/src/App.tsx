import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router";
import { TooltipProvider } from "./components/ui/tooltip";
import { MessageScrollerProvider } from "./components/ui/message-scroller";
import { Toaster } from "./components/ui/sonner";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";


const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: '/', element: <MessageScrollerProvider autoScroll><Index /></MessageScrollerProvider> },
        ]
    },
    { path: 'login/', element: <Login /> },
    { path: 'register/', element: <Register /> },
]);

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <RouterProvider router={router} />
                <Toaster position="bottom-center" toastOptions={{ className: 'font-sans' }} />
            </TooltipProvider>
            {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
    );
}