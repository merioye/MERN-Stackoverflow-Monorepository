import { Router } from 'express'
import { catchAsyncError } from 'stackoverflow-server-common'
import { answerController, commentController, questionController } from './controllers'

const router = Router()

router.get('/healthcheck', (req, res) => {
  res.status(200).json({
    message: 'Server is up and running',
  })
})
router.post('/questions', catchAsyncError(questionController.createQuestion))
router.get('/questions', catchAsyncError(questionController.getQuestions))
router.get('/questions/:id', catchAsyncError(questionController.getSingleQuestion))
router.patch(
  '/questions/:id/questionViews',
  catchAsyncError(questionController.updateQuestionViews),
)
router.post('/questions/:id/comments', catchAsyncError(commentController.createComment))
router.post('/questions/:id/answers', catchAsyncError(answerController.createAnswer))
router.delete('/questions/:id', catchAsyncError(questionController.deleteQuestion))

export { router }
