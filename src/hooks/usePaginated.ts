import { useState, useEffect, useCallback, useRef } from 'react';
import type { PaginatedResponse, PaginationParams } from '../types';

interface UsePaginatedOptions<T> {
  fetchFn: (params: PaginationParams) => Promise<PaginatedResponse<T>>;
  initialPage?: number;
  initialLimit?: number;
}

export function usePaginated<T>({
  fetchFn,
  initialPage = 1,
  initialLimit = 10,
}: UsePaginatedOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const prevFetchFn = useRef(fetchFn);

  // Reset page when fetchFn changes (e.g. filters)
  useEffect(() => {
    if (prevFetchFn.current !== fetchFn) {
      prevFetchFn.current = fetchFn;
      setPage(1);
    }
  }, [fetchFn]);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFn({ page, limit });
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, total, totalPages, page, limit, loading, setPage, refetch: fetch };
}
