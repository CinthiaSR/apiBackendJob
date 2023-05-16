import { check } from "express-validator";
import { body } from "express-validator";
import User from "../models/user.model";
import validateResult from "../../services/validateHelper";

export const validateCreateAccount=[
    check('email')
        .exists()
        .isEmail()
        .custom((async (value,req)=>{
            try {
                const existingUser = await User.findOne({email:value});
                if (existingUser) {
                    return Promise.reject('Este correo ya tiene una cuenta');
                  }
            } catch (error) {
                console.log(error)
            }
        })),
        body('email').isEmail().withMessage('Ingresa un correo electronico valido'),

    check('role')
        .exists()
        .not()
        .isEmpty(),
    body('password').isLength({min:4}).withMessage('Password debe tener min 8 caracteres'),
        (req,res,next)=>{
            validateResult(req,res,next)
        }
]

export const validByCompany=[
    check('email')
        .exists()
        .isEmail()
        .custom((async (value,req)=>{
            try {
                const existingUser = await User.findOne({email:value});
                if (existingUser) {
                    return Promise.reject('Este correo ya tiene una cuenta');
                  }
            } catch (error) {
                console.log(error)
            }
        })),
        body('email').isEmail().withMessage('Ingresa un correo electronico valido'),
    check('role')
        .exists()
        .not()
        .isEmpty(),
    check('rfc')
        .exists()
        .not()
        .isEmpty()
        .custom((value,{req})=>{
            if(value===''){
                throw new Error('Agregar RFC')
            }
            return true
        }),
    body('rfc').isLength({min:12}).withMessage('El RFC debe contener min 12 caracteres'),
    body('password').isLength({min:4}).withMessage('Password debe tener min 8 caracteres'),
        (req,res,next)=>{
            validateResult(req,res,next)
        }
]
