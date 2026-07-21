import { useQuery } from "@tanstack/react-query";
import api from "./api";


type Profile = { user: number, nickname: string };

export function useProfileQuery() {
    return useQuery<Profile | null>({
        queryKey: ['account', 'profile'],
        queryFn: async () => {
            try {
                const response = await api.get<Profile>('/api/account/profile/');
                return response.data;
            }
            catch {
                return null;
            }
        },
    });
}