import * as express from 'express'
import registerController from '../controllers/register.controller'
import { validateCreateAccount,validByCompany } from '../validators/user.validator'

export default express
.Router()
.post('/byCompany/',registerController.createAccountByCompany)
.get('/:token',registerController.verificationEmail)
.post('/sendAccessCode',registerController.sendAccesCode)
.post('/',registerController.createAccount)