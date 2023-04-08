import User from "../models/user.model";

export class UserController{
getAllUser=async(req,res,next)=>{
    try {
        const users=await User.find({})
        res.status(201).send(users)
    } catch (error) {
        next(error)
    }
}
createUser=async(req,res,next)=>{
    try {
        const{name,last_name,avatar_url,age,gender,rfc,role,email,password}=req.body
        console.log(req.body)
        const newUser=new User({
            name,last_name,avatar_url,age,gender,rfc,role,email,password
        })
        await newUser.save()
        res.status(201).send(newUser)
        res.json({message:'Create User Ok'})
    } catch (error) {
        next(error)
    }
}
getUser=async(req,res,next)=>{
    try {
        const {id}=req.params
        const user=await User.findById(id)  
        if(!user){
            res.status(404).send({
                error:'No se encontro ningun registro en la base de datos'
            })
        }     
        res.status(200).send(user)
        res.json({message:'Get User ok'})
    } catch (error) {
        next(error)
    }
}
updateUser=async(req,res,next)=>{
    try {
        const {id}=req.params
        const bodyParams={...req.body}
        const updateUser=await User.findByIdAndUpdate(id,bodyParams, {new:true})
        if(!updateUser){
            return res.status(404).send({message:'User not found!'})
        }
        res.status(201).send(updateUser)
        res.json({message:'Update User Ok'})
    } catch (error) {
        next(error)
    }
}
deleteUser=async(req,res,next)=>{
    try {
        const {id}=req.params
        const deletedUser=await User.findByIdAndDelete(id)
        if(!deletedUser){
            res.status(404).send({
                error:'User not found!'
            })
        }
        res.status(204).send({message:'Registro eliminado correctamente'})
        res.json({message:'Delete User Ok'})
    } catch (error) {
        next(error)
    }
}
}
export default new UserController()