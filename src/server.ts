import { config as readEnv } from 'dotenv';
const path = `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`;
readEnv({path});

import './services/auth/passport';
import './services/db/db';
import express, { Router } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import link from './routes/links';
import auth from './routes/auth';
import link_stats from './routes/link_stats';
import { errorHandler } from './middlewares/errorHandler';
import { getLongLink } from './services/link/linkServices';
import cors from 'cors';

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test')
  server.use(morgan('combined'));
server.use(helmet());
server.use(compression({ level: 5 }));

if (process.env.NODE_ENV === 'development') {
  server.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With', 'g-recaptcha-response'],
    preflightContinue: false
  }));
}

const router = Router();
router.use('/links', link);
router.use('/auth', auth);
router.use('/link_stats', link_stats);

server.use('/rest', router);
server.use('/r/:hash', getLongLink);
server.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`server started on port: ${process.env.PORT}`);
});

export default server;
