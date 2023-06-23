import mongoose, { Schema } from "mongoose";
import paginate  from "mongoose-paginate-v2";
const phaseSchema=new Schema({
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