import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "@ticketing/common";
import { NotFoundError } from "@ticketing/common";
import cookieSession from "cookie-session";
import { setCurrentUser } from "@ticketing/common";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    name: "session",
    signed: false,
    secure: process.env.NODE_ENV !== "test",
}))
app.use(setCurrentUser)

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.get('*', async (req, res, next) => {
    throw new NotFoundError();
})


app.use(errorHandler);

export {app};