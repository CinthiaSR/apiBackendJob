import jobSkill from "../models/jobskill.model"
import jobVacancy from "../models/jobvacancy.model"
export class jobSkillController{

getAllJobSkills=async(req,res,next)=>{
    try {
        //const {page=1,limit=10}=req.query;
        const filter= {};
        const options = {
            page:req?.query?.page,
            limit:req?.query?.limit
        }
        await jobSkill.paginate(filter,options,(err,docs)=>{
            res.send({
                item:docs
            })
        })
        // const infoJobSkills= await jobSkill.find({}).populate('vacancy')
        // res.status(201).send(infoJobSkills)
    } catch (error) {
        next(error)
    }
}



//crear
createJobSkill=async(req,res,next)=>{
    try {
        
        const {name,level}=req.body;
        const newJobSkill=new jobSkill({
            name,level
        });
        await newJobSkill.save()
        /*const newSkillVacancy=await jobVacancy.findById({_id:newJobSkill.vacancy})
        newSkillVacancy.job_skills.push(newJobSkill)
        await newSkillVacancy.save({validateBeforeSave:false});*/
        res.status(201).json({message:'Created Ok',newJobSkill})
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
        }else{
            res.status(201).json({message:'Get Ok',infoJobSkill})
        }
    } catch (error) {
        next(error)
    }

}
updateJobSkill=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const bodyParams={...req.body}
        console.log('id:..',id);
        console.log('bodyParams:..',bodyParams);
        const updateJobSkill=await jobSkill.findByIdAndUpdate(id,bodyParams,{new:true})
        if(!updateJobSkill){
            return res.status(404).send({message:'Skill not found!'})
        }else{
            res.status(201).json({message:'Updated Ok',updateJobSkill})
        }
    } catch (error) {
        console.log('error:..',error);
        next(error)
    }

}
deleteJobSkill=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const deleteJob=await jobSkill.findByIdAndDelete(id);
        if(!deleteJob){
            return res.status(404).send({message:'Skill not found!'})
        }else{
            res.status(204).send({message:'Deleted!'})
        }
    } catch (error) {
        next(error)
    }

}

}
export default new jobSkillController()