import { useQuery } from "@tanstack/react-query";
import api, { type AxiosError } from "./api";
import axios from "axios";


type Profile = { user: number, nickname: string };

export function useProfileQuery() {
    return useQuery<Profile | null, AxiosError>({
        queryKey: ['account', 'profile'],
        queryFn: async () => {
            try {
                const response = await api.get<Profile>('/api/account/profile/');
                return response.data;
            }
            catch(error) {
                if(axios.isAxiosError(error) && error.response?.status === 403) return null;
                else throw error;
            }
        },
    });
}