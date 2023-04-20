import userRouter from "./user.router";
import companyRouter from "./company.router";
import jobvacancyRouter from "./jobvacancy.router";
import jobskillRouter from "./jobskill.router";
import userskillRouter from "./userskill.router";
import phaseRouter from "./phase.router";
import feedbackRouter from "./feedback.router";
import skillmatchRouter from "./skillmatch.router";
import registerRouter from "./register.router";
import sessionRouter from "./session.router";
export default function routes(app){
    app.use('/api/v1/users',userRouter)
    app.use('/api/v1/userSkill',userskillRouter)
    app.use('/api/v1/company',companyRouter)
    app.use('/api/v1/jobVacancy',jobvacancyRouter)
    app.use('/api/v1/jobSkill',jobskillRouter)
    app.use('/api/v1/phase',phaseRouter)
    app.use('/api/v1/feedback',feedbackRouter)
    app.use('/api/v1/skillMatch',skillmatchRouter)
    app.use('/api/v1/signup',registerRouter)
    app.use('/api/v1/',sessionRouter)
    // app.use('/api/v1/logout',sessionRouter)

}