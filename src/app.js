import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { corsOptions, limiter } from './constants/config.js';
import indexRoute from './routes/index.js';

const app = express();

app.use(morgan('dev'));
app.use(cors(corsOptions));

app.use(limiter);

app.use(helmet());

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'SUCCESS',
    message: 'ShopEase Backend is Running.',
    data: {},
  });
});

app.use('/api', indexRoute);

app.use((req, res) => {
  return res.status(404).json({
    status: 'ERROR',
    message: 'Router End Point is not Found.',
  });
});

export default app;
