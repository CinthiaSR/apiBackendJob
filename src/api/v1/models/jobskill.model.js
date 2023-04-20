import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
const jobSkillSchema=new mongoose.Schema({
    vacancy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobVacancy',
    },
    name:{
        type:String
    },
    level:{
        type:String
    }

},{
    timestamps:true
})
jobSkillSchema.plugin(mongoosePaginate)
 const jobSkill=mongoose.model('jobSkill',jobSkillSchema)
 export default jobSkill