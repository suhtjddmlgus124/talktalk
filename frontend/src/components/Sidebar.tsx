import { useProfileQuery, useLogoutMutation } from "@/api/profile";
import {
    Sidebar as BaseSidebar, SidebarHeader, SidebarContent, SidebarFooter,
    SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from "./ui/sidebar";
import { UserCircleIcon, LogOutIcon } from "lucide-react";
import type { Profile } from "@/types/account";


export default function Sidebar() {
    const profile = useProfileQuery();
    const profileData = profile.data as Profile;
    const logout = useLogoutMutation();

    return (
        <BaseSidebar>
            <SidebarHeader>

            </SidebarHeader>
            <SidebarContent>

            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="h-14">
                            <UserCircleIcon /> <span>{profileData.nickname}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={()=>logout.mutate()}>
                            <LogOutIcon /> <span>로그아웃</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </BaseSidebar>
    );
}