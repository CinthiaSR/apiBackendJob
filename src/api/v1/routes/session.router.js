import * as express from 'express'
import  SessionController  from '../controllers/session.controller'
export default express
.Router()
.post('/login',SessionController.login)
.post('/logout',SessionController.logout)