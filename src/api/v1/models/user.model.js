import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const userShema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    avatar_url: {
      type: String,
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
    },
    rfc: {
      type: String,
    },
    role: {
      type: String,
      enum: {
        values: ["candidato", "empresa"],
        message: "This {VALUE} option is not supported",
      },
      required: true,
    },
    bachelor: {
      type: String,
    },
    working_experience: [
      // {
      //   position: {
      //     type: String,
      //   },
      //   description: {
      //     type: String,
      //   },
      // },
      {
        company: {
          type: String,
        },
        period: {
          type: String,
        },
        position: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
    phase_status: [
      {
        idVacancy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "jobVacancy",
        },
        phase: {
          type: String,
        },
      },
    ],
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      // minLength: 8
    },
    emailToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
    },
    company_names: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobVacancy",
      },
    ],
    my_vacancies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobVacancy",
      },
    ],
    user_skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobSkill",
      },
    ],
    // phase: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Phase",
    //   },
    // ],
    // feedback: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Feedback",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

userShema.plugin(paginate);
const User = mongoose.model("User", userShema);
export default User;
