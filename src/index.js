import './common/environment'
import { connectToDatabase } from './common/database'
import Server from './common/server'
import routes from './api/v1/routes'
//import { setCorsBucket } from './api/v1/lib/awsLib'
//import { dirname } from "path";
//import { fileURLToPath } from "url";

//version preliminar 24-Jul-23 11:08 a.m.

export const mainDir = process.cwd();

export default new Server()
  .router(routes)
  .database(connectToDatabase)
  .listen(process.env.PORT)

//setCorsBucket();
//agregando dirname

//console.log(process.cwd());