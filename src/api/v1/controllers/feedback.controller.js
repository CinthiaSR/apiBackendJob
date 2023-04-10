import feedBack from "../models/feedback.model";
import User from "../models/user.model";
// import Company from "../models/company.model";

export class feedBackController{
getAllFeedback=async(req,res,next)=>{
    try {
        const infoFeedbacks=await feedBack.find({}).populate('username').populate('phase').populate('vacancy').populate('companyName')
        res.status(201).send(infoFeedbacks)
    } catch (error) {
        next(error)
    }

}
createFeedback=async(req,res,next)=>{
    try {
        const {username,phase,vacancy,companyName,message}=req.body;
        const newFeedback=new feedBack({
            username,phase,vacancy,companyName,message
        })
        await newFeedback.save()
        const newFeedBackByUser=await User.findById({_id:newFeedback.username})
        newFeedBackByUser.feedback.push(newFeedback)
        await newFeedBackByUser.save({validateBeforeSave:false})
        res.status(201).send(newFeedback)
    } catch (error) {
        next(error)
    }
    
}
getFeedback=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const infoFeedback=await feedBack.findById(id).populate('username').populate('phase').populate('vacancy').populate('companyName')
        if(!infoFeedback){
            return res.status(404).send({message:'Feedback not found!'})
        }
        res.status(201).send(infoFeedback)
    } catch (error) {
        next(error)
    }
    
}
updateFeedback=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const bodyParams={...req.body};
        const infoFeedback=await feedBack.findByIdAndUpdate(id,bodyParams,{new:true})
        if(!infoFeedback){
            return res.status(404).send({message:'Feedback not found!'})
        }
        res.status(201).send(infoFeedback)
    } catch (error) {
        next(error)
    }
    
}
deleteFeedback=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const infoFeedback= await feedBack.findByIdAndDelete(id);
        if(!infoFeedback){
            return res.status(404).send({message:'Feedback not found!'})
        }
        res.status(201).send({message:'Deleted!'})
    } catch (error) {
        next(error)
    }
    
}

}
export default new feedBackController()