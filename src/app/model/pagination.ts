export interface Pagination<T> {
  items: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface PaginationMeta {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationLinks {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
}
