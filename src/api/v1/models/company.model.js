import mongoose from "mongoose";

const companyShema=new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require:true
    },
    company_name:{
        type:String
    },
    rfc: {
        type: String,
        required:true,
        unique: true
    },
    description:{
        type:String
    },
    vacantes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobVacancy',
    }]
},{
    timestamps:true
})

const Company=mongoose.model('Company',companyShema)
export default Company