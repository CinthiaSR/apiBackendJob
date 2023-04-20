import { check, body } from "express-validator";
import validateResult from "../../services/validateHelper";

export const validateForPhase=[
    check('name')
        .not()
        .isEmpty(),
        body('name').isEmpty().withMessage('Este campo no pude ir vacio'),

    check('stage')
        .not()
        .isEmpty(),
        body('stage').isEmpty().withMessage('Este campo no pude ir vacio'),  
    (req,res,next)=>{
    validateResult(req,res,next)
    }
]