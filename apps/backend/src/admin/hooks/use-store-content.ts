import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getStoreContent, updateStoreContent, StoreContent } from "../lib/sdk"

export const useStoreContent = () => {
  return useQuery<StoreContent>({
    queryKey: ["store-content"],
    queryFn: getStoreContent,
  })
}

export const useUpdateStoreContent = () => {
  const queryClient = useQueryClient()
  return useMutation<StoreContent, Error, StoreContent>({
    mutationFn: updateStoreContent,
    onSuccess: (data) => {
      queryClient.setQueryData(["store-content"], data)
    },
  })
}
