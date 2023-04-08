import jobVacancy from "../models/jobvacancy.model";
import Company from "../models/company.model";
export class jobVacancyController{
getAllJobVacancy=async(req,res,next)=>{
    try {
        const vacancies=await jobVacancy.find({}).populate('companyName')
        res.status(201).send(vacancies);
    } catch (error) {
        next(error)
    }
}
createVacancy=async(req,res,next)=>{
    try {
        const {companyName, title, type,mode,city,salary, activities,extraservices}=req.body;
        const newVacancy=new jobVacancy({
            companyName, title, type,mode,city,salary, activities,extraservices
        })
        await newVacancy.save()
        const company= await Company.findById({_id:newVacancy.companyName})
        company.vacantes.push(newVacancy)
        await company.save({validateBeforeSave:false})
        res.status(201).send(newVacancy)
    } catch (error) {
        next(error)
    }
}
getVacancy=async(req,res,next)=>{
    try {
        const {id}=req.params
        const infoVacancy=await jobVacancy.findById(id).populate('companyName')
        if(!infoVacancy){
            return res.status(404).send({message:'Vacancy not found!'})
        }
        res.status(201).send(infoVacancy)
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
        }
        res.status(201).send(infoVacancy)
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
        }
        res.status(204).send({message:'Deleted!'})
    } catch (error) {
        next(error)
    }
}
}
export default new jobVacancyController()