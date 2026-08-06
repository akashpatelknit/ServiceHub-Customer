import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/userApi';
import type { UpdateProfilePayload } from '@/api/types';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/authStore';

/** PATCH /users/me — updates firstName/lastName/email only (see UpdateProfilePayload). */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userApi.updateProfile(payload),
    onSuccess: (updatedProfile) => {
      useAuthStore.getState().setUser(updatedProfile);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}
