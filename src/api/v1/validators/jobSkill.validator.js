import { check,body } from "express-validator";
import validateResult from "../../services/validateHelper";

export const validateValuesForJobSkill=[
    check('name')
         .not()
         .isEmpty(),
    body('name').isEmpty().withMessage('Este campo no puede ir vacio'),

    check('level')
         .not()
         .isEmpty(),
    body('level').isEmpty().withMessage('Este campo no puede ir vacio'),
    (req,res,next)=>{
        validateResult(req,res,next)
    } 
]