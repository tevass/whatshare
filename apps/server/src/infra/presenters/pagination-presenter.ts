import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import { HttpPagination } from '@whatshare/http-schemas/entities'

export class PaginationPresenter {
  static toHttp(pagination: Pagination): HttpPagination {
    return {
      current: pagination.page,
      pages: pagination.page,
      next: pagination.nextPage,
      prev: pagination.prevPage,
    }
  }
}
