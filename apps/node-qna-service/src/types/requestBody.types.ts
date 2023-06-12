export interface CreateQuestionBody {
  title: string
  body: string
  tagsIds: string[]
  questionViewsCount: number
}

export interface CreateReactionBody {
  body: string
}
