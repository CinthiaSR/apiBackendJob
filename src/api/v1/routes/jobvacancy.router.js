import * as express from 'express'
import jobvacancyController from '../controllers/jobvacancy.controller'
import AuthMiddleware from '../../middlewares/auth'
import { validateForJobVacancy } from '../validators/jobVacancy.validator'
export default express
.Router()
.get('/',jobvacancyController.getAllJobVacancy)
.post('/',AuthMiddleware.auth,validateForJobVacancy,jobvacancyController.createVacancy)
.get('/:id',jobvacancyController.getVacancy)
.patch('/:id',AuthMiddleware.auth,validateForJobVacancy,jobvacancyController.updateVacancy)
.delete('/:id',AuthMiddleware.auth,jobvacancyController.deleteVacancy)