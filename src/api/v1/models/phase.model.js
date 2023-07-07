import mongoose, { Schema } from "mongoose";
import paginate  from "mongoose-paginate-v2";
const phaseSchema=new Schema({
    name:{
        type:String
    },
    stage:{
        type:String
    },
    vacancies:[{
        idVacancie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'jobVacancy'
          },
        applicants:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    }]

},{
    timestamps:true
})
phaseSchema.plugin(paginate)
const Phase=mongoose.model('Phase',phaseSchema)
export default Phase