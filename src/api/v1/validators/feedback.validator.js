import { check } from "express-validator";
import { body } from "express-validator";
import feedBack from "../models/feedback.model";
import validateResult from "../../services/validateHelper";

export const validateValueForFeedback=[
    check('message')
         .not()
         .isEmpty(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }
]