import mongoose, { Schema } from "mongoose";
import paginate  from "mongoose-paginate-v2";

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
userSkillShema.plugin(paginate)
const userSkill=mongoose.model('userSkill',userSkillShema)
export default userSkill