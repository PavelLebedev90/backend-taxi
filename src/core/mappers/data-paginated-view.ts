import { PaginatedView } from "../types/queries";

export function mapDataPaginatedView<TData>(
  data: TData[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): { meta: PaginatedView; data: TData[] } {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data,
  };
}
