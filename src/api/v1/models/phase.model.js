import mongoose, { Schema } from "mongoose";
const phaseSchema=new Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    name:{
        type:String
    },
    stage:{
        type:String
    }

},{
    timestamps:true
})
const Phase=mongoose.model('Phase',phaseSchema)
export default Phase