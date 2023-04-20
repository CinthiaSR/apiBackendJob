import * as express from 'express'
import userskillController from '../controllers/userskill.controller'
import AuthMiddleware from '../../middlewares/auth'
import { validateForUserSkill } from '../validators/userSkill.validator'

export default express
.Router()
.get('/',userskillController.getAllUserSkills)
.post('/',validateForUserSkill,userskillController.createUserSkill)
.get('/:id',userskillController.getUserSkill)
.patch('/:id',validateForUserSkill,userskillController.updateUserSkill)
.delete('/:id',userskillController.deleteUserSkill)