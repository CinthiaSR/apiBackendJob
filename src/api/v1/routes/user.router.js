import * as express from 'express'
import userController from '../controllers/user.controller'
import AuthMiddleware from '../../middlewares/auth'
import { validateCreateAccount } from '../validators/user.validator'
export default express
.Router()
.get('/',userController.getAllUser)
// .post('/',AuthMiddleware.auth,userController.createUser)
.post('/',userController.createUser)
.get('/:id',userController.getUser)
.patch('/:token',AuthMiddleware.auth,userController.updateUser)
.delete('/:id',AuthMiddleware.auth,userController.deleteUser)