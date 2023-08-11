import skillMatch from "../models/skillmatch.model";

export class skillMatchController{
getAllSkillsMatch=async(req,res,next)=>{
    try {
        const {page=1,limit=10}=req.body;
        await skillMatch.paginate({},req.body,(err,docs)=>{
            res.send({
                item:docs
            })
        })
    } catch (error) {
        next(error)
    }

}
createSkillMatch=async(req,res,next)=>{
    try {
        const {vacancy,user_skills,job_skills}=req.body;
        const newSkill= new skillMatch({
            vacancy,user_skills,job_skills
        })
        await newSkill.save()
        res.status(201).json({message:'Created ok',newSkill})
    } catch (error) {
        next(error)
    }

}
getSkillMatch=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const infoSkill= await skillMatch.findById(id).populate('vacancy').populate('user_skills').populate('job_skills');
        if(!infoSkill){
            return res.status(404).send({message:'Skills Group not found!'})
        }else{
            res.status(201).json({message:'Get ok',infoSkill})
        }
    } catch (error) {
        next(error)
    }

}
updateSkillMatch=async(req,res,next)=>{
    try {
       const {id}=req.params; 
       const bodyParams={...req.body};
       const infoSkill=await skillMatch.findByIdAndUpdate(id,bodyParams,{new:true})
       if(!infoSkill){
        return res.status(404).send({message:'Skills Group not found!'})
       }else{
           res.status(201).json({message:'Updated ok',infoSkill})
       }
    } catch (error) {
        next(error)
    }

}
deleteSkillMatch=async(req,res,next)=>{
    try {
       const {id}=req.params; 
       const infoSkill= skillMatch.findByIdAndDelete(id);
       if(!infoSkill){
        return res.status(404).send({message:'Skills Group not found!'});
       }else{
           res.status(201).json({message:'Deleted!'})
       }
    } catch (error) {
        next(error)
    }
}
}
export default new skillMatchController()