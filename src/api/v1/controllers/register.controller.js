import bcrypt from 'bcrypt'
import logger from '../../middlewares/logger'
import User from '../models/user.model';
import jwt from 'jsonwebtoken'

import MailService  from '@sendgrid/mail';

export class RegisterController{
createAccount= async(req,res,next)=>{
    try {
        const {email,role,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,10)
        const register_user=new User({
            email,
            role,
            password:hashedPassword,
            emailToken:jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh'),
            isVerified:false
        })
       await register_user.save()
       res.status(201).send(register_user)
        // if(!createNew){
        //     return res.status(500).send({message:'User NOT CREATED!'})
        // }
        // const msg={
        //     from:'noreplay@email.com',
        //     to: register_user.email,
        //     subject:'Jobinder- verfiry your email',
        //     text:`
        //       Gracias por registarte en nuestro sitio,
        //       http://jobinder.org/verify-email?token=${register_user.emailToken}
        //     `,
        //     html:'Bienvenido'
        // }
        // try {
        //     res.status(201).send(createNew)
        //     await MailService.send(msg);
        //     res.status(201).send({message:'exito'})
        // } catch (error) {
        //     console.log(error)
        // }
     
    } catch (error) {
        logger.error(error)
        next(error)
    }
}

verificationEmail=async(req,res,next)=>{
    try {
        const {token}=req.params
        const bodyParams={
            emailToken:token,
            isVerified:true
        }
        const user= await User.findOneAndUpdate(token,bodyParams,{new:true})
        if(!user){
            return res.status(404).send({message:'token invalid'})
        }
        user.emailToken=null;
        user.isVerified=true;
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        next(error)
    }
}

}
export default new RegisterController()