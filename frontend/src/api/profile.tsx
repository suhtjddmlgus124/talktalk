import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api, { type AxiosError } from "./api";
import axios from "axios";
import type { Profile } from "./types/account";


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

export function useLogoutMutation() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationKey: ['account', 'logout'],
        mutationFn: async () => {
            const response = await api.post('/api/account/logout/');
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['account', 'profile'] });
            navigate('/login');
        },
    });
}