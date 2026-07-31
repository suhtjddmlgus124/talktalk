import { Outlet, Navigate } from "react-router";
import { useProfileQuery } from "@/api/profile";
import { CenterContainer } from "./ui/container";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./ui/sidebar";
import { Spinner } from "./ui/spinner";
import { XOctagonIcon } from "lucide-react";
import Sidebar from "./Sidebar";


export default function Layout() {
    const profile = useProfileQuery();

    if(profile.isPending) return (
        <CenterContainer>
            <Spinner className="size-12" />
        </CenterContainer>
    );
    if(profile.isError) return (
        <CenterContainer>
            <XOctagonIcon />
        </CenterContainer>
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