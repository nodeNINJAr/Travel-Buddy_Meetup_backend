import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from "./config/index.js"
import globalErrorHandler from './app/middlewares/globalErrorHandler.js';
import notFound from './app/middlewares/notFound.js';
import router from './app/routes/index.js';
import passport from 'passport';
import "./config/passport.js"
import expressSession from "express-session"
import cookieParser from "cookie-parser"

const app: Application = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://travel-management-frontend-j6hfop2se.vercel.app'],
    credentials: true,
   })
);
app.use(expressSession({
    secret:config.express_session_secret,
    resave:false,
    saveUninitialized:false,
}));
app.use(passport.initialize());
app.use(passport.session());
//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// 
app.use("/api/v1/", router)

// 
app.get('/', async (req: Request, res: Response) => {
    // 
    res.send({
        message: "Travel buddy meetup Server is running..",
        environment: config.node_env,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString(),
    })
});


app.use(globalErrorHandler);

app.use(notFound);

export default app;