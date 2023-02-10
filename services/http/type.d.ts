interface PaginationResponse<T> {
  next?: string;
  count: number;
  previous: string | null;
  results: T[];
}

type PaginationFetch<T, F = undefined> = (
  next?: string,
  filter?: F,
) => Promise<PaginationResponse<T>>;

export type { PaginationResponse, PaginationFetch };
