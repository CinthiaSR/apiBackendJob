import { check } from "express-validator";
import { body } from "express-validator";
import Company from "../models/company.model";
import validateResult from "../../services/validateHelper";

export const validateValues=[
    check('company_name')
         .exists()
         .not()
         .isEmpty(),
    body('company_name').isEmpty().withMessage('Este campo no puede ir vacio'),

    check('description')
         .exists()
         .not()
         .isEmpty(),
         (req,res,next)=>{
            validateResult(req,res,next)
         }
]
