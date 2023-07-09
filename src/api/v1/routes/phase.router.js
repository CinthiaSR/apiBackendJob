import * as express from 'express'
import phaseController from '../controllers/phase.controller'
import AuthMiddleware from '../../middlewares/auth'
import { validateForPhase } from '../validators/phase.validator'
export default express
.Router()
.get('/getPhase',phaseController.getPhase)
.get('/',phaseController.getAllPhase)
.post('/updatePanel',phaseController.updatePanel)
.post('/',AuthMiddleware.auth,phaseController.createPhase)
.patch('/',AuthMiddleware.auth,phaseController.updatePhase)
.delete('/:id',AuthMiddleware.auth,phaseController.deletePhase)