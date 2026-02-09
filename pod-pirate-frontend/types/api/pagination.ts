// Pagination Types

export interface Page<T> {
  content: T[];
  pageable: PageableObject;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export interface PageableObject {
  pageNumber: number;
  pageSize: number;
  sort: SortObject;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageableRequest {
  page?: number;
  size?: number;
  sort?: string;
}

export interface SortObject {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
