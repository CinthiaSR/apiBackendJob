import * as express from 'express'
import companyController from '../controllers/company.controller'
import AuthMiddleware from '../../middlewares/auth'
// import { validateValues } from '../validators/company.validator'
export default express
.Router()
.get('/',companyController.getAllCompany)
.post('/',AuthMiddleware.auth,companyController.createCompany)
.get('/:id',companyController.getCompany)
.patch('/:id',AuthMiddleware.auth,companyController.updateCompany)
.delete('/:id',AuthMiddleware.auth,companyController.deleteCompany)