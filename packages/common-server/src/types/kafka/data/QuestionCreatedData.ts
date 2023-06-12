export interface QuestionCreatedData {
  id: string
  title: string
  body: string
  authorId: string
  questionViewersIds: string[]
  createdAt: Date
  updatedAt: Date
  version: number
}
