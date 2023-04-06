import User from "../models/user.model";

export class UserController{
createUser=async(req,res,next)=>{
    try {
        const{name,last_name,avatar_url,age,gender,rfc,role,email,passwoord}=req.body
        console.log(req.body)
        const newUser=new User({
            name,last_name,avatar_url,age,gender,rfc,role,email,passwoord
        })
        await newUser.save()
        res.status(201).send(newUser)
        res.json({message:'Create User Ok'})
    } catch (error) {
        next(error)
    }
}
}
export default new UserController()