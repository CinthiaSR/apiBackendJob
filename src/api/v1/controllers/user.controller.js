import User from "../models/user.model";

export class UserController{
getAllUser=async(req,res,next)=>{
    try {
        const {page=1,limit=10}=req.query
        await User.paginate({},req.body,(err,docs)=>{
            res.send({
                item:docs
            })
        })
    } catch (error) {
        next(error)
    }
}
createUser=async(req,res,next)=>{
    try {
        const{name,last_name,avatar_url,age,gender,rfc,role,bachelor, working_experience,email,password}=req.body
        const newUser=new User({
            name,last_name,avatar_url,age,gender,rfc,role,bachelor,working_experience,email,password
        })
        await newUser.save()
        res.status(201).json({message:'Create User Ok',newUser})
        // res.json({message:'Create User Ok'})
    } catch (error) {
        next(error)
    }
}
getUser=async(req,res,next)=>{
    try {
        const {id}=req.params
        const user=await User.findById(id).populate('phase').populate('company_names').populate('user_skills').populate('feedback') 
        if(!user){
            res.status(404).send({
                error:'No se encontro ningun registro en la base de datos'
            })
        }else{
            res.status(200).json({message:'Get User ok',user})
        }     
    } catch (error) {
        next(error)
    }
}
// aqui
updateUser=async(req,res,next)=>{
    try {
        const {id}=req.params
        const bodyParams={...req.body}
        const updateUser=await User.findByIdAndUpdate(id,bodyParams, {new:true})
        if(!updateUser){
            return res.status(404).send({message:'User not found!'})
        }else{
            res.status(201).json({message:'Update User Ok',updateUser})
        }
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
        }else{
            res.status(204).send({message:'Deleted!'})
        }
    } catch (error) {
        next(error)
    }
}
}
export default new UserController()