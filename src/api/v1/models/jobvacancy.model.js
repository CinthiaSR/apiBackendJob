import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const jobVacancyShema=new mongoose.Schema({
    companyName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        require:true
    },
    title:{
        type:String
    },
    type:{
        type:String
    },
    mode:{
        type:String
    },
    city:{
        type:String
    },
    salary:{
        type:String
    },
    activities:{
        type: String
    },
    status:{
        type:String
    },
    job_skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobSkills',
        require:true
    }],
},{
    timestamps:true
})
jobVacancyShema.plugin(paginate)
const jobVacancy=mongoose.model('jobVacancy',jobVacancyShema)
export default jobVacancy