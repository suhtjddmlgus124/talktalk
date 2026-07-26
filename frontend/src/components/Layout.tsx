import { Outlet, Navigate } from "react-router-dom";
import { useProfileQuery } from "@/api/profile";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./ui/sidebar";
import { Spinner } from "./ui/spinner";
import { XOctagonIcon } from "lucide-react";
import Sidebar from "./Sidebar";


export default function Layout() {
    const profile = useProfileQuery();

    if(profile.isPending) return (
        <div className="absolute flex inset-0 justify-center items-center">
            <Spinner className="size-12" />
        </div>
    );
    if(profile.isError) return (
        <div className="absolute flex inset-0 justify-center items-center">
            <XOctagonIcon />
        </div>
    );
    if(profile.data === null) return (
        <Navigate to="/login" />
    );
    return (
        <SidebarProvider className="h-screen">
            <Sidebar />
            <SidebarInset>
                <SidebarTrigger size="icon-lg" />
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}