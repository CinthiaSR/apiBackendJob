import * as express from 'express'
import jobvacancyController from '../controllers/jobvacancy.controller'
import AuthMiddleware from '../../middlewares/auth'
import { validateForJobVacancy } from '../validators/jobVacancy.validator'
export default express
.Router()
.post('/updateListApplicantsInVacancie',AuthMiddleware.auth,jobvacancyController.updateListApplicantsInVacancie)
.post('/closeVacancy',jobvacancyController.closeVacancy)
.post('/:token',AuthMiddleware.auth,jobvacancyController.createVacancy)
.get('/getTitlesVacancies',jobvacancyController.getTitlesVacancies)
.get('/getDataConsult',jobvacancyController.getDataConsult)
.get('/:id',jobvacancyController.getVacancy)
.patch('/:id',AuthMiddleware.auth,jobvacancyController.updateVacancy)
.delete('/:id',AuthMiddleware.auth,jobvacancyController.deleteVacancy)
.get('/',jobvacancyController.getAllJobVacancy)
.get('/getAllJobVacancyByUser/:token',jobvacancyController.getAllJobVacancyByUser)