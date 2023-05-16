import { check,body } from "express-validator";
import validateResult from "../../services/validateHelper";

export const validateForJobVacancy=[
    check('title')
        .not()
        .isEmpty(),
    body('title').isEmpty().withMessage('Este campo no puede ir vacio'),
    
    check('type')
        .not()
        .isEmpty(),
    body('type').isEmpty().withMessage('Este campo no puede ir vacio'),

    check('mode')
        .not()
        .isEmpty(),
    body('mode').isEmpty().withMessage('Este campo no puede ir vacio'),

    check('city')
        .not()
        .isEmpty(),
    body('city').isEmpty().withMessage('Este campo no puede ir vacio'),

    check('salary')
        .not()
        .isEmpty(),
    body('salary').isEmpty().withMessage('Este campo no puede ir vacio'),

    check('activities')
        .not()
        .isEmpty(),
    body('activities').isEmpty().withMessage('Este campo no puede ir vacio'),

    check('status')
        .not()
        .isEmpty(),
    body('status').isEmpty().withMessage('Este campo no puede ir vacio'),

    (req,res,next)=>{
        validateResult(req,res,next)
    }

]