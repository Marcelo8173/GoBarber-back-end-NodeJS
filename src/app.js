import express from 'express';
import 'express-async-errors';
import route from './routes';
import path from 'path';
import * as Sentry from '@sentry/node';
import SentryConfig from './config/sentry';
import Youch from 'youch';
import './database';

class App{
    constructor(){
        this.server = express();
        
        Sentry.init(SentryConfig);

        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    middlewares(){
        this.server.use(Sentry.Handlers.requestHandler());

        this.server.use(express.json());
        this.server.use('/files',express.static(path.resolve(__dirname,'..','tmp','uploads')));
    }

    routes(){
        this.server.use(route);
        this.server.use(Sentry.Handlers.errorHandler());
    }

    exceptionHandler(){
        this.server.use(async (err, req, res, next) => {
            const erros = await new Youch(err, req).toJSON();

            return res.status(500).json(erros)
        })
    }
}


export default new App().server;
