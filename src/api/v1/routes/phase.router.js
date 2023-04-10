import * as express from 'express'
import phaseController from '../controllers/phase.controller'
export default express
.Router()
.get('/',phaseController.getAllPhase)
.post('/',phaseController.createPhase)
.get('/:id',phaseController.getPhase)
.patch('/:id',phaseController.updatePhase)
.delete('/:id',phaseController.deletePhase)