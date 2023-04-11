import * as express from 'express'
import registerController from '../controllers/register.controller'

export default express
.Router()
.post('/',registerController.createAccount)