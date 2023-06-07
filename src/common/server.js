import Express from 'express'
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import logger from '../api/middlewares/logger';
import errorHandler from '../api/middlewares/error.handler';
import cors from 'cors';
import fileUpload from "express-fileupload";


const app = new Express();

export default class ExpressServer {
  constructor() {
    app.use(cors());
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }))
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '20Mb',
      })
    )
    app.use(Express.json())
    app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: './upload',
      limits: {
        fileSize: 2000000 //1mb
    },
    abortOnLimit: false
    }))
  }

  router(routes) {
    routes(app)
    app.use(errorHandler)
    return this
  }

  database(initDatabase) {
    initDatabase()
    return this
  }

  listen(port = process.env.PORT) {
    const welcome = (p) => () => 
      logger.info(
        `Up and Running in ${
          process.env.NODE_ENV || 'development'
        }@${os.hostname()} on port: ${p}`
      )
    
    http.createServer(app).listen(port, welcome(port));

    return app;
  }
}
