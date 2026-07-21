import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";

import Layout from "./components/Layout";
import Login from "./pages/Login";


const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            
        ]
    },
    {
        path: 'login/',
        element: <Login />,
    }
]);

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <RouterProvider router={router} />
            </TooltipProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}