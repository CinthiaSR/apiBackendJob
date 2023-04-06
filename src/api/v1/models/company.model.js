import mongoose, { trusted } from "mongoose";

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
    }
},{
    timestamps:true
})

const Company=mongoose.model('Company',companyShema)
export default Company