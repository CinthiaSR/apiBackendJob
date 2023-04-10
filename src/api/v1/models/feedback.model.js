import mongoose from "mongoose";
const feedBackSchema=new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require:true
    },
    phase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Phase',
        require:true
    },
    vacancy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobVacancy',
    },
    companyName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        require:true
    },
    message:{
        type:String
    }

},{
    timestamps:true
})
const feedBack=mongoose.model('Feedback',feedBackSchema)
export default feedBack