import * as express from 'express'
import  SessionController  from '../controllers/session.controller'
export default express
.Router()
.post('/',SessionController.login)
.post('/',SessionController.logout)