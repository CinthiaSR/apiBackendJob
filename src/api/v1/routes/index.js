import userRouter from "./user.router";
import companyRouter from "./company.router";
import jobvacancyRouter from "./jobvacancy.router";
export default function routes(app){
    app.use('/api/v1/users',userRouter)
    app.use('/api/v1/company',companyRouter)
    app.use('/api/v1/jobVacancy',jobvacancyRouter)
}