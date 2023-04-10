import mongoose from "mongoose";

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
 const jobSkill=mongoose.model('jobSkill',jobSkillSchema)
 export default jobSkill