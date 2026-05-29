import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getFreeShipping,
  updateFreeShipping,
  FreeShippingState,
  FreeShippingInput,
} from "../lib/sdk"

export const useFreeShipping = () => {
  return useQuery<FreeShippingState>({
    queryKey: ["free-shipping"],
    queryFn: getFreeShipping,
  })
}

export const useUpdateFreeShipping = () => {
  const queryClient = useQueryClient()
  return useMutation<FreeShippingState, Error, FreeShippingInput>({
    mutationFn: updateFreeShipping,
    onSuccess: (data) => {
      queryClient.setQueryData(["free-shipping"], data)
    },
  })
}
