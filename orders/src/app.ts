import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import indexOrderRouter from './routes';
import newOrderRouter from './routes/new';
import deletOrderRouter from './routes/delete';
import showOrderRouter from './routes/show';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, setCurrentUser } from '@ticketing/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
const myCookieSession = cookieSession({
  name: "session",
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
});
app.use(myCookieSession);
app.use(setCurrentUser);

app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(deletOrderRouter);
app.use(showOrderRouter);


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
