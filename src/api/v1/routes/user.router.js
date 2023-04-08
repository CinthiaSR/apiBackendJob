import * as express from 'express'
import userController from '../controllers/user.controller'

export default express
.Router()
.get('/',userController.getAllUser)
.post('/',userController.createUser)
.get('/:id',userController.getUser)
.patch('/:id',userController.updateUser)
.delete('/:id',userController.deleteUser)