import mongoose, { Schema } from "mongoose";
const skillMatchSchema=new Schema({
    vacancy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobVacancy',
    },
    user_skills: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'userSkill'
        }
      ],
      job_skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobSkill',
        require:true
    }]
},{
    timestamps:true
})
const skillMatch=mongoose.model('skillMatch',skillMatchSchema)
export default skillMatch