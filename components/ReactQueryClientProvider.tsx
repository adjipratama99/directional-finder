'use client'

import {
    QueryClient,
    QueryClientProvider,
    HydrationBoundary
} from '@tanstack/react-query'

export default function ReactQueryClientProvider({ children }) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnMount: false,
                refetchOnReconnect: false,
                refetchOnWindowFocus: false,
                retry: 1,
                staleTime: 1000 * 60 * 5,
            }
        }
    }
)
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}