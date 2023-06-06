import userSkill from "../models/userskill.model";
import User from "../models/user.model";
export class userSkillsController{

getAllUserSkills=async(req,res,next)=>{
    try {
        const infoUserSkills=await userSkill.find({}).populate('username')
        res.status(201).json({message:'Skill',infoUserSkills})
    } catch (error) {
        next(error)
    }
}
createUserSkill=async(req,res,next)=>{
    try {
        const {username,name,level}=req.body;
        const newUserSkill=new userSkill({
            username,name,level
        });
        await newUserSkill.save()
        const regUser=await User.findById({_id:newUserSkill.username})
        regUser.user_skills.push(newUserSkill)
        await regUser.save({validateBeforeSave:false});
        res.status(201).json({message:'Created ok',newUserSkill});
    } catch (error) {
        next(error)
    }

}
getUserSkill=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const infoUserSkill= await userSkill.findById(id).populate('username')
        if(!infoUserSkill){
            return res.status(404).send({message:'Skill not found!'})
        }else{
            res.status(201).json({message:'Get ok',infoUserSkill})
        }
    } catch (error) {
        next(error)
    }

}
updateUserSkill=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const bodyParams={...req.body}
        const infoUserSkill=await userSkill.findByIdAndUpdate(id,bodyParams,{new:true})
        if(!infoUserSkill){
            return res.status(404).send({message:'Skill not found!'})
        }else{
            res.status(201).json({message:'Updated ok',infoUserSkill})
        }
    } catch (error) {
        next(error)
    }

}
deleteUserSkill=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const deleteSkill=await userSkill.findByIdAndDelete(id)
        if(!deleteSkill){
            return res.status(404).send({message:'Skill not found!'})
        }else{
            res.status(204).json({message:'Deleted!'})
        }
    } catch (error) {
        next(error)
    }

}

}
export default new userSkillsController()