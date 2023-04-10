import mongoose, { Schema } from "mongoose";

const userSkillShema=new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require:true
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

const userSkill=mongoose.model('userSkill',userSkillShema)
export default userSkill