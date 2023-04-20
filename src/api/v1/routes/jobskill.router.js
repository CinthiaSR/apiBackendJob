import * as express from 'express'
import jobskillController from '../controllers/jobskill.controller'
import AuthMiddleware from '../../middlewares/auth'
import {validateValuesForJobSkill}  from '../validators/jobSkill.validator'
export default express
.Router()
.get('/',jobskillController.getAllJobSkills)
.post('/',AuthMiddleware.auth,validateValuesForJobSkill,jobskillController.createJobSkill)
.get('/:id',jobskillController.getJobSkill)
.patch('/:id',AuthMiddleware.auth,validateValuesForJobSkill,jobskillController.updateJobSkill)
.delete('/:id',AuthMiddleware.auth,jobskillController.deleteJobSkill)