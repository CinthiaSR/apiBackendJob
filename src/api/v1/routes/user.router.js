import * as express from 'express'
import userController from '../controllers/user.controller'
import AuthMiddleware from '../../middlewares/auth'
import { validateCreateAccount } from '../validators/user.validator'
export default express
.Router()
.get('/',userController.getAllUser)
.get('/getAllUsersInVacancy/:id',userController.getAllUsersInVacancy)
.get('/getAllUserOutPaginate',userController.getAllUserOutPaginate)
// .post('/',AuthMiddleware.auth,userController.createUser)
.post('/',userController.createUser)
.get('/getUser/:id',userController.getUserById)
.get('/getSkillsInUser/:token',userController.getSkillsInUser)
.get('/:token',AuthMiddleware.auth,userController.getUser)
.patch('/:token',AuthMiddleware.auth,userController.updateUser)
.delete('/:id',AuthMiddleware.auth,userController.deleteUser)