import {
  PostgresSortOrder,
  RecordService,
  SortOptions,
  UrlQuery,
} from 'stackoverflow-server-common'

export class QuestionRecordService<T extends PostgresSortOrder> extends RecordService<T> {
  sortOptions: SortOptions<T> = {
    newest: { createdAt: 'DESC' },
    oldest: { createdAt: 'ASC' },
    popular: {
      questionViewsCount: 'DESC',
    },
    name: {
      title: 'ASC',
    },
  }

  constructor(urlQuery: UrlQuery) {
    super(urlQuery)
  }
}
