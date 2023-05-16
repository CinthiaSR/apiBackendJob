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
        const infoPhase=await Phase.find({}).populate('username').populate('vacancy').populate('companyName')
        res.status(201).send(infoPhase)
    } catch (error) {
        next(error)
    }
}
createPhase=async(req,res,next)=>{
    try {
        const {username,vacancy,companyName,name,stage}=req.body;
        const newPhase=new Phase({
            username,vacancy,companyName,name,stage
        })
        await newPhase.save()
        const newPhaseByUser=await User.findById({_id:newPhase.username})
        newPhaseByUser.phase.push(newPhase)
        await newPhaseByUser.save({validateBeforeSave:false})
        res.status(201).send(newPhase)
    } catch (error) {
        next(error)
    }
    
}
getPhase=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const infoPhase=await Phase.findById(id).populate('username').populate('vacancy').populate('companyName')
        if(!infoPhase){
            return res.status(404).send({message:'Phase not found!'})
        }
        res.status(201).send(infoPhase)
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
        }
        res.status(201).send(infoPhase)
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
        }
        res.status(204).send({message:'Deleted!'})
    } catch (error) {
        next(error)
    }

}
}
export default new phaseController()