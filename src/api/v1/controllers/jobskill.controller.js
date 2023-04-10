import jobSkill from "../models/jobskill.model"
import jobVacancy from "../models/jobvacancy.model"
export class jobSkillController{

getAllJobSkills=async(req,res,next)=>{
    try {
        const infoJobSkills= await jobSkill.find({}).populate('vacancy')
        res.status(201).send(infoJobSkills)
    } catch (error) {
        next(error)
    }
}
createJobSkill=async(req,res,next)=>{
    try {
        const {vacancy,name,level}=req.body;
        const newJobSkill=new jobSkill({
            vacancy,name,level
        });
        await newJobSkill.save()
        const newSkillVacancy=await jobVacancy.findById({_id:newJobSkill.vacancy})
        newSkillVacancy.job_skills.push(newJobSkill)
        await newSkillVacancy.save({validateBeforeSave:false});
        res.status(201).send(newJobSkill)
    } catch (error) {
        next(error)
    }

}
getJobSkill=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const infoJobSkill=await jobSkill.findById(id).populate('vacancy')
        if(!infoJobSkill){
            return res.status(404).send({message:'Skill not found'})
        }
        res.status(201).send(infoJobSkill)
    } catch (error) {
        next(error)
    }

}
updateJobSkill=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const bodyParams={...req.body}
        const updateJobSkill=await jobSkill.findByIdAndUpdate(id,bodyParams,{new:true})
        if(!updateJobSkill){
            return res.status(404).send({message:'Skill not found!'})
        }
        res.status(201).send(updateJobSkill)
    } catch (error) {
        next(error)
    }

}
deleteJobSkill=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const deleteJob=await jobSkill.findByIdAndDelete(id);
        if(!deleteJob){
            return res.status(404).send({message:'Skill not found!'})
        }
        res.status(204).send({message:'Deleted!'})
    } catch (error) {
        next(error)
    }

}

}
export default new jobSkillController()