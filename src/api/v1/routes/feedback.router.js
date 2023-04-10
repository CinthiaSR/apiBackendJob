import * as express from 'express'
import feedbackController from '../controllers/feedback.controller'
export default express
.Router()
.get('/',feedbackController.getAllFeedback)
.post('/',feedbackController.createFeedback)
.get('/:id',feedbackController.getFeedback)
.patch('/:id',feedbackController.updateFeedback)
.delete('/:id',feedbackController.deleteFeedback)