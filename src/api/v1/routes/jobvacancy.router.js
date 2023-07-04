import * as express from 'express'
import jobvacancyController from '../controllers/jobvacancy.controller'
import AuthMiddleware from '../../middlewares/auth'
import { validateForJobVacancy } from '../validators/jobVacancy.validator'
export default express
.Router()
.get('/',jobvacancyController.getAllJobVacancy)
.post('/:token',AuthMiddleware.auth,jobvacancyController.createVacancy)
.get('/:id',jobvacancyController.getVacancy)
.patch('/:id',AuthMiddleware.auth,jobvacancyController.updateVacancy)
.delete('/:id',AuthMiddleware.auth,jobvacancyController.deleteVacancy)