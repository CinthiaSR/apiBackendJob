import * as express from 'express'
import feedbackController from '../controllers/feedback.controller'
import AuthMiddleware  from '../../middlewares/auth'
// import { validateValueForFeedback } from '../validators/feedback.validator'
export default express
.Router()
.get('/',feedbackController.getAllFeedback)
.post('/',AuthMiddleware.auth,feedbackController.createFeedback)
.get('/:id',feedbackController.getFeedback)
.patch('/:id',AuthMiddleware.auth,feedbackController.updateFeedback)
.delete('/:id',AuthMiddleware.auth,feedbackController.deleteFeedback)