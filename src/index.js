import './common/environment'
import { connectToDatabase } from './common/database'
import Server from './common/server'
import routes from './api/v1/routes'

export default new Server()
  .router(routes)
  .database(connectToDatabase)
  .listen(process.env.PORT)