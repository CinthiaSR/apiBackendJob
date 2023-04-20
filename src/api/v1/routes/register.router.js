import * as express from 'express'
import registerController from '../controllers/register.controller'
import { validateCreateAccount,validByCompany } from '../validators/user.validator'

export default express
.Router()
.post('/',validateCreateAccount,registerController.createAccount)
.post('/byCompany/',validByCompany,registerController.createAccountByCompany)
.get('/:token',registerController.verificationEmail)