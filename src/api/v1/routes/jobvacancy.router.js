import * as express from 'express'
import jobvacancyController from '../controllers/jobvacancy.controller'
export default express
.Router()
.get('/',jobvacancyController.getAllJobVacancy)
.post('/',jobvacancyController.createVacancy)
.get('/:id',jobvacancyController.getVacancy)
.patch('/:id',jobvacancyController.updateVacancy)
.delete('/:id',jobvacancyController.deleteVacancy)