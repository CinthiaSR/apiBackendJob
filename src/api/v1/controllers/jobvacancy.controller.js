import jobVacancy from "../models/jobvacancy.model";
import Company from "../models/company.model";
import User from "../models/user.model";
import jwtServices from "../../services/jwt.services";
import fs from 'fs'
import { uploadOneFileToBucket } from "../lib/awsLib";
import { mainDir } from "../../..";

const {AWS_BUCKETNAME}=process.env;
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
    //console.log('dataFront:..',req.body);
    try {
        const {companyName, avatar_url,title, type,mode,city,salary, activities,status, job_skills}=req.body;
        const newVacancy=new jobVacancy({
            companyName, avatar_url, title, type,mode,city,salary, activities,status,job_skills
        })
        await newVacancy.save()
        res.status(201).json({message:'Created Ok',newVacancy})
    } catch (error) {
        next(error)
    }
}
getVacancy=async(req,res,next)=>{
    try {
        const {id}=req.params
        const infoVacancy=await jobVacancy.findById(id)
                        .populate('applicants')
                        .populate('job_skills')
        if(!infoVacancy){
            return res.status(404).send({message:'Vacancy not found!'})
        }
        res.status(201).send({infoVacancy})
    } catch (error) {
        next(error)
    }
}
//actualiza el dataVacancy
updateVacancy=async(req,res,next)=>{
    let objRes={}
    try {
        const {id}=req.params
        const bodyParams={...req.body}
        console.log('id:..',id);
        console.log('bodyparams:..',bodyParams);
        const {token,deleteApplicant}= bodyParams;
        if(token){
            const { _id } = await jwtServices.verify(bodyParams.token);
            const retriveDataVacancie = await jobVacancy.findById(id);
            //este caso es cuando se agrega un id al array de applicants
            if(!deleteApplicant){
                if(retriveDataVacancie?.applicants){
                    bodyParams.applicants= [...retriveDataVacancie.applicants,_id];
                }else{
                    bodyParams.applicants=[_id];
                }
                delete bodyParams.token;
            }
            //este es el caso cuando se elimina un id del array de applicants
            if(deleteApplicant){
                if(retriveDataVacancie?.applicants){
                    bodyParams.applicants= retriveDataVacancie.applicants.filter(item=>item._id!==_id);
                }
                delete bodyParams.token;
            }
            
        }

        // -------------------------------------- update Image
        const file=req?.files?.image
        objRes={
            bodyParams, file
        }
        if(file){
            const responseUploadFile =await uploadOneFileToBucket(file,id);
            if(responseUploadFile){
                bodyParams.avatar_url = `https://${AWS_BUCKETNAME}.s3.amazonaws.com/${id}/${file.name}`;
                const updateVacancy = await jobVacancy.findByIdAndUpdate(id,bodyParams,{new:true});
                if(!updateVacancy){
                    res.status(404).send({message:'Vacancy not found'})
                }else{
                    res.status(201).json({message:"Updated!", updateVacancy})
                }
                fs.unlink(`${mainDir}/${file.tempFilePath}`,function(err){
                    if(err){
                        console.log(err)
                    }else{
                        console.log('Successfully deleted the file!')
                    }
                })
            }
        }else{
            const updateVacancy = await jobVacancy.findByIdAndUpdate(id,bodyParams,{new:true});
            if(!updateVacancy){
                res.status(404).send({message:'Vacancy not found'})
            }else{
                res.status(201).json({message:"Updated!", updateVacancy})
            }
        }
        // -------------------------- end image
    //     const infoVacancy=await jobVacancy.findByIdAndUpdate(id,bodyParams,{new:true})
    //     if(!infoVacancy){
    //         return res.status(404).send({message:'Vacancy not found!'})
    //     }
    //     res.status(201).send(infoVacancy)
    } catch (error) {
        console.log(error);
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