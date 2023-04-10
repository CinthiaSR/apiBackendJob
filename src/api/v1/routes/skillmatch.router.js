import * as express from 'express'
import skillmatchController from '../controllers/skillmatch.controller'

export default express
.Router()
.get('/',skillmatchController.getAllSkillsMatch)
.post('/',skillmatchController.createSkillMatch)
.get('/:id',skillmatchController.getSkillMatch)
.patch('/:id',skillmatchController.updateSkillMatch)
.delete('/:id',skillmatchController.deleteSkillMatch)