import mongoose, { Schema } from "mongoose";
import paginate  from "mongoose-paginate-v2";
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
phaseSchema.plugin(paginate)
const Phase=mongoose.model('Phase',phaseSchema)
export default Phase