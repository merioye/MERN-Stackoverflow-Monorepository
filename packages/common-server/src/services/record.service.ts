import { UrlQuery, SortOptions, SortOrder } from '../types'

interface PaginateQuery {
  skip: number
  take: number
}

// Sorting filter e.g { createdAt: 'asc' } for mongo & { createdAt: 'ASC' } for postgres
// Here key is any property of object(e.g name,createdAt) and its value is the sorting order(e.g asc,desc)
interface SortBy<T extends SortOrder> {
  [key: string]: T['asc'] | T['desc']
}

export abstract class RecordService<T extends SortOrder> {
  private urlQuery
  abstract sortOptions: SortOptions<T>

  constructor(urlQuery: UrlQuery) {
    this.urlQuery = urlQuery
  }

  buildPagination = (): PaginateQuery => {
    const pageSize = Number(this.urlQuery.pageSize) || 10
    const pageNo = Number(this.urlQuery.pageNo) || 1
    const skip = pageSize * (pageNo - 1)
    return { skip, take: pageSize }
  }

  getSortOption = (): SortBy<T> => {
    const sortOption = this.urlQuery.sort
    if (sortOption) {
      const sortBy = this.sortOptions[sortOption as keyof SortOptions<T>]
      return sortBy ? sortBy : {}
    } else {
      return {}
    }
  }
}
