import * as express from 'express'
import registerController from '../controllers/register.controller'
import { validateCreateAccount,validByCompany } from '../validators/user.validator'

//agregando rutas
export default express
.Router()
.post('/sendAccessCode',registerController.sendAccesCode)
.post('/byCompany/',registerController.createAccountByCompany)
.get('/:token',registerController.verificationEmail)
.post('/',registerController.createAccount)