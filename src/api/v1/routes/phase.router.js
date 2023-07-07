import * as express from 'express'
import phaseController from '../controllers/phase.controller'
import AuthMiddleware from '../../middlewares/auth'
import { validateForPhase } from '../validators/phase.validator'
export default express
.Router()
.get('/',phaseController.getAllPhase)
.post('/',AuthMiddleware.auth,phaseController.createPhase)
.get('/:id',phaseController.getPhase)
.patch('/',AuthMiddleware.auth,phaseController.updatePhase)
.delete('/:id',AuthMiddleware.auth,phaseController.deletePhase)