import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';;
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import { AppRouter } from './app_routers';
import  config from './config/config';
import logger from './config/logger';



const app= express();

const NAMESPACE = 'Server';
const MONGO_URL= config.mongo;
const MONGO_OPTIONS= config.mongo_options;
mongoose.Promise= Promise;
logger.info(NAMESPACE, 'Connecting to Mongo Database');
mongoose.connect(
        MONGO_URL,
        MONGO_OPTIONS
    ).then((result) => {
        logger.info(NAMESPACE, 'Mongo Database Connected');
    }).catch((error) => {
        logger.error(NAMESPACE, error.message, error);
    });
mongoose.connection.on('error', (error:Error) => console.log(error.message));



app.use(cors({
    credentials: true,
}))

logger.info('Setting Middlewares');

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});


logger.info('Middlewares set successfully');

app.use('/', AppRouter());

const server= http.createServer(app);
server.listen(config.server.port, () => {
    console.log(`Server listening on ${config.server.hostname}:${config.server.port}`);
});
