import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
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
feedBackSchema.plugin(mongoosePaginate)
const feedBack=mongoose.model('Feedback',feedBackSchema)
export default feedBack