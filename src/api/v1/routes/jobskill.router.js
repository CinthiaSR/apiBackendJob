import * as express from 'express'
import jobskillController from '../controllers/jobskill.controller'

export default express
.Router()
.get('/',jobskillController.getAllJobSkills)
.post('/',jobskillController.createJobSkill)
.get('/:id',jobskillController.getJobSkill)
.patch('/:id',jobskillController.updateJobSkill)
.delete('/:id',jobskillController.deleteJobSkill)