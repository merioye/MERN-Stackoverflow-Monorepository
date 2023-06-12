import { UrlQuery, SortOptions, MongoSortOrder, RecordService } from 'stackoverflow-server-common'

export class TagRecordService<T extends MongoSortOrder> extends RecordService<T> {
  sortOptions: SortOptions<T> = {
    newest: { createdAt: 'desc' },
    oldest: { createdAt: 'asc' },
    popular: {
      noOfQuestionsAsked: 'desc',
    },
    name: {
      name: 'asc',
    },
  }
  constructor(urlQuery: UrlQuery) {
    super(urlQuery)
  }
}
