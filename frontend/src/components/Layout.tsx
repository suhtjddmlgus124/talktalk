import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./ui/sidebar";


export default function Layout() {
    return (
        <SidebarProvider>
            <SidebarInset>
                <SidebarTrigger size="icon-lg" />
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}