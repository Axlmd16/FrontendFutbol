import { useQuery, UseQueryResult, QueryKey, UseQueryOptions } from '@tanstack/react-query';

export type Fetcher<T> = () => Promise<T>;

export function useFetch<T, TError = Error>(
  key: QueryKey,
  fetcher: Fetcher<T>,
  options?: Omit<UseQueryOptions<T, TError, T, QueryKey>, 'queryKey' | 'queryFn'>
): UseQueryResult<T, TError> {
  return useQuery<T, TError>({
    queryKey: key,
    queryFn: fetcher,
    ...options,
  });
}
