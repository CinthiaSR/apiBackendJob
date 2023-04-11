import bcrypt from 'bcrypt'
import logger from '../../middlewares/logger'
import User from '../models/user.model'
import RefreshToken from '../models/refreshToken'

export class RegisterController{
async createAccount(req,res,next){
    try {
        const {email,rfc,role,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,100)
        const register_user=new User({
            email,rfc,role,password:hashedPassword
        })
        await register_user.save()
        res.status(201).send(register_user)
    } catch (error) {
        logger.error(error)
        next(error)
    }
}
}
export default new RegisterController()