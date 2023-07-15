import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const jobVacancyShema = new mongoose.Schema(
  {
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companyName: {
      type: String,
    },
    avatar_url: {
      type: String,
    },
    title: {
      type: String,
    },
    type: {
      type: String,
    },
    mode: {
      type: String,
    },
    city: {
      type: String,
    },
    salary: {
      type: String,
    },
    activities:[
      {
        task: {
          type: String,
        }
      },
    ],
    // activities: {
    //   type: String,
    // },
    status: {
      type: String,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rejecteds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    job_skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobSkill",
      },
    ],
  },
  {
    timestamps: true,
  }
);
jobVacancyShema.plugin(paginate);
const jobVacancy = mongoose.model("jobVacancy", jobVacancyShema);
export default jobVacancy;
