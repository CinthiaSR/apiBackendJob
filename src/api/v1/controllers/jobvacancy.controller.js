import jobVacancy from "../models/jobvacancy.model";
import Company from "../models/company.model";
import User from "../models/user.model";
export class jobVacancyController{
getAllJobVacancy=async(req,res,next)=>{
    try {
        const {page=1,limit=10}=req.body;
        await jobVacancy.paginate({},req.body,(err,docs)=>{
            res.send({
                item:docs
            })
        })
        // const vacancies=await jobVacancy.find({}).populate('companyName')
        // res.status(201).send(vacancies);
    } catch (error) {
        next(error)
    }
}
createVacancy=async(req,res,next)=>{
    try {
        const {companyName, title, type,mode,city,salary, activities,status}=req.body;
        const newVacancy=new jobVacancy({
            companyName, title, type,mode,city,salary, activities,status
        })
        await newVacancy.save()
        const company= await User.findById({_id:newVacancy.companyName})
        company.company_names.push(newVacancy)
        await company.save({validateBeforeSave:false})
        res.status(201).json({message:'Created Ok',newVacancy})
    } catch (error) {
        next(error)
    }
}
getVacancy=async(req,res,next)=>{
    try {
        const {id}=req.params
        const infoVacancy=await jobVacancy.findById(id).populate('companyName').populate(['job_skills'])
        if(!infoVacancy){
            return res.status(404).send({message:'Vacancy not found!'})
        }else{
            res.status(201).json({message:'Get Ok',infoVacancy})
        }
    } catch (error) {
        next(error)
    }
}
updateVacancy=async(req,res,next)=>{
    try {
        const {id}=req.params
        const bodyParams={...req.body}
        const infoVacancy=await jobVacancy.findByIdAndUpdate(id,bodyParams,{new:true})
        if(!infoVacancy){
            return res.status(404).send({message:'Vacancy not found!'})
        }else{
            res.status(201).json({message:'Updated Ok',infoVacancy})
        }
    } catch (error) {
        next(error)
    }
}
deleteVacancy=async(req,res,next)=>{
    try {
        const{id}=req.params
        const infoVacancy=await jobVacancy.findByIdAndDelete(id)
        if(!infoVacancy){
            return res.status(404).send({message:'Vacancy not found!'})
        }else{

            res.status(204).json({message:'Deleted!'})
        }
    } catch (error) {
        next(error)
    }
}
}
export default new jobVacancyController()