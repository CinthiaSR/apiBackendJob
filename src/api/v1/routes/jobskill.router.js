import * as express from 'express'
import jobskillController from '../controllers/jobskill.controller'
import AuthMiddleware from '../../middlewares/auth'
import {validateValuesForJobSkill}  from '../validators/jobSkill.validator'
export default express
.Router()
.get('/',jobskillController.getAllJobSkills)
.post('/',AuthMiddleware.auth,jobskillController.createJobSkill)
.get('/:id',jobskillController.getJobSkill)
.patch('/:id',AuthMiddleware.auth,jobskillController.updateJobSkill)
.delete('/:id',AuthMiddleware.auth,jobskillController.deleteJobSkill)