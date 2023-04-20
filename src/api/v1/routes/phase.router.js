import * as express from 'express'
import phaseController from '../controllers/phase.controller'
import AuthMiddleware from '../../middlewares/auth'
import { validateForPhase } from '../validators/phase.validator'
export default express
.Router()
.get('/',phaseController.getAllPhase)
.post('/',AuthMiddleware.auth,validateForPhase,phaseController.createPhase)
.get('/:id',phaseController.getPhase)
.patch('/:id',AuthMiddleware.auth,validateForPhase,phaseController.updatePhase)
.delete('/:id',AuthMiddleware.auth,phaseController.deletePhase)