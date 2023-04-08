import mongoose from "mongoose";

const userShema=new mongoose.Schema({
    name:{
        type:String
    },
    last_name:{
        type:String
    },
    avatar_url:{
        type: String
    },
    age:{
        type:String
    },
    gender: {
        type: String,
    },
    rfc: {
        type: String,
        required:true,
        unique: true
    },
    role: {
        type: String,
        enum: {
          values: ['candidato', 'empresa'],
          message: 'This {VALUE} option is not supported'
        },
        required: true
      },
    email:{
        type: String,
        required:true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength: 8
    },
    company_name: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Company'
        }
      ]
},{
    timestamps:true
})

const User=mongoose.model('User',userShema)
export default User