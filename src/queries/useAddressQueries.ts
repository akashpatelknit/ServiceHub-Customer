import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '@/api/addressApi';
import type { AddressPayload } from '@/api/types';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/authStore';

const ADDRESSES_KEY = queryKeys.addresses.all();

export function useAddresses() {
  const isAuthenticated = Boolean(useAuthStore((state) => state.user));
  return useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: addressApi.getAddresses,
    enabled: isAuthenticated,
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressPayload) => addressApi.addAddress(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, payload }: { addressId: string; payload: Partial<AddressPayload> }) =>
      addressApi.updateAddress(addressId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: string) => addressApi.deleteAddress(addressId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: string) => addressApi.setDefaultAddress(addressId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}
