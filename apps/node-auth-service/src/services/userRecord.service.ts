import { UrlQuery, SortOptions, MongoSortOrder, RecordService } from 'stackoverflow-server-common'

export class UserRecordService<T extends MongoSortOrder> extends RecordService<T> {
  sortOptions: SortOptions<T> = {
    newest: { createdAt: 'desc' },
    oldest: { createdAt: 'asc' },
    popular: {
      profileViews: 'desc',
    },
    name: {
      username: 'asc',
    },
  }
  constructor(urlQuery: UrlQuery) {
    super(urlQuery)
  }
}
