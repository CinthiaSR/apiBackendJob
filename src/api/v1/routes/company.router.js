import * as express from 'express'
import companyController from '../controllers/company.controller'

export default express
.Router()
.get('/',companyController.getAllCompany)
.post('/',companyController.createCompany)
.get('/:id',companyController.getCompany)
.patch('/:id',companyController.updateCompany)
.delete('/:id',companyController.deleteCompany)