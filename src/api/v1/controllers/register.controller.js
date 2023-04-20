import bcrypt from 'bcrypt'
import logger from '../../middlewares/logger'
import User from '../models/user.model';
import jwt from 'jsonwebtoken'
import RefreshToken from '../models/refreshToken';
import jwtServices from '../../services/jwt.services';

import MailService  from '@sendgrid/mail';

export class RegisterController{
createAccount= async(req,res,next)=>{
    try {
        const {email,password,rfc}=req.body||'';
        const {role}=req.body;
        const hashedPassword=await bcrypt.hash(password,10)
        const register_user=new User({
            email,
            role,
            password:hashedPassword,
            emailToken:jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh'),
            isVerified:false
        })
       
        await register_user.save()
        res.status(201).send({message:'Candidato creado!'})
        res.status(201).send(emailToken)

        const accessToken = jwtServices.sign({ _id: register_user._id, role: register_user.role, email: register_user.email });
        const refreshToken = jwtServices.sign({ _id: register_user._id, role: register_user.role }, '1y', process.env.REFRESH_TOKEN);
        await RefreshToken.create({ token: refreshToken })
        response.status(201).send({ access_token: accessToken,
                                   refresh_token: refreshToken })
    

    //    await register_user.save()
    //    res.status(201).send(register_user)
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

createAccountByCompany= async(req,res,next)=>{
    try {
        const {email,password,role,rfc}=req.body||'';
        const hashedPassword=await bcrypt.hash(password,10)
        const register_user=new User({
            email,
            role,
            rfc,
            password:hashedPassword,
            emailToken:jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh'),
            isVerified:false
        })
       
        await register_user.save()
        res.status(201).send({message:'Reclutador creado'})
        // res.status(201).send(register_user)
        
    

    //    await register_user.save()
    //    res.status(201).send(register_user)
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