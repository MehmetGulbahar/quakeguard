"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: 1,
          },
        },
      }),
  )

  useEffect(() => {
    const onRefetch = () => {
      queryClient.invalidateQueries({ queryKey: ["earthquakes"] })
    }

    window.addEventListener("quakeguard-refetch", onRefetch)

    return () => {
      window.removeEventListener("quakeguard-refetch", onRefetch)
    }
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
} 