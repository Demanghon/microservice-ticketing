import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, natsWrapper, NotFoundError, setCurrentUser } from '@ticketing/common';
import newChargeRouter from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  name: "session",
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}));
app.use(setCurrentUser);

app.use(newChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
