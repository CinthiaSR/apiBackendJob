import Phase from "../models/phase.model";
import User from "../models/user.model";
import jobVacancy from "../models/jobvacancy.model";
import Company from "../models/company.model";
export class phaseController{
getAllPhase=async(req,res,next)=>{
    try {
        const {page=1,limit=10}=req.query;
        await Phase.paginate({},req.body,(err,docs)=>{
            res.send({
                item:docs
            })
        })
        // const infoPhase=await Phase.find({}).populate('username').populate('vacancy').populate('companyName')
        // res.status(201).send(infoPhase)
    } catch (error) {
        next(error)
    }
}
createPhase=async(req,res,next)=>{
    try {
        const {name,stage}=req.body;
        const newPhase=new Phase({
            name
        })
        await newPhase.save()
        res.status(201).json({message:'Created Ok',newPhase})
    } catch (error) {
        next(error)
    }
    
}
getPhase=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const infoPhase=await Phase.findById(id)
        if(!infoPhase){
            return res.status(404).send({message:'Phase not found!'})
        }else{
            res.status(201).json({message:'Get Ok',infoPhase})
        }
    } catch (error) {
        next(error)
    }
    
}
updatePhase=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const bodyParams={...req.body};
        const infoPhase= await Phase.findByIdAndUpdate(id,bodyParams,{new:true})
        if(!infoPhase){
            return res.status(404).send({message:'Phase not found!'})
        }else{
            res.status(201).json({message:'Updated Ok',infoPhase})
        }
    } catch (error) {
        next(error)
    }
    
}
deletePhase=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const infoPhase= await Phase.findByIdAndDelete(id)
        if(!infoPhase){
            return res.status(404).send({message:'Phase not found!'})
        }else{
            res.status(204).json({message:'Deleted!'})
        }
    } catch (error) {
        next(error)
    }

}
}
export default new phaseController()