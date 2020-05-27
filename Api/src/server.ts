console.log(`Start Application with PID ${process.pid} and PPID ${process.ppid}`);

import 'module-alias/register';
import * as dotenv from "dotenv";
import { resolve } from 'url';
import { uuid } from 'uuidv4';

// DotEnv init
dotenv.config()

import express, { NextFunction, Request, Response } from "express"

const app: express.Application = express()

// Test database
import db from "@lib/database";
db.connect((err) => {
    if (err) throw err;
    console.log("Database connected");
});

// Middleware
// Allow origin access
app.use(require("cors")({
    origin: function (origin: any, callback: any) {
        if (process.env.CORS_ALLOWED === "all"
            || process.env.CORS_ALLOWED
            && process.env.CORS_ALLOWED.split(";").includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'), false)
        }
    },
    credentials: true
}));

// Json body
app.use(express.json({
    strict: false
}));

// Session
import Session from "express-session";
import SessionFileStore from "session-file-store";
const sessionStore = new (SessionFileStore(Session))({ path: process.env.SESSIONS_PATH!, ttl: 604800 }); // 604800 -> One week in seconds
const sessionOptions: Session.SessionOptions = {
    genid: (req) => {
        return uuid();
    },
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {}
};
if (process.env.ENVIRONMEN! == "Prod") {
    app.set("trust proxy", 1);
    sessionOptions.cookie!.secure = true;
}
app.use(Session(sessionOptions));

// Authentifcation
import { verifyToken, auth } from "@lib/authentication"
app.use(verifyToken);

// Routes
import { readdirSync, existsSync, mkdirSync } from 'fs';
if (!existsSync(process.env.FILE_UPLOAD_BASE_URL!))
    mkdirSync(process.env.FILE_UPLOAD_BASE_URL!);
app.use("/files", express.static(process.env.FILE_UPLOAD_BASE_URL!));

app.use("/auth", require("@r/auth").default);
app.use("/trainstation", require("@r/trainstation").default);

// Masterdata
app.use("/manage/challenge", require("@r/manage/challenge").default);
app.use("/manage/event", require("@r/manage/event").default);
app.use("/manage/group", require("@r/manage/group").default);
app.use("/manage/joker", require("@r/manage/joker").default);
app.use("/manage/user", require("@r/manage/user").default);

//Group
app.use("/group/groupUuid", require("@r/group/groupUuid").default);


// Shit and test
import zuzJson, { zuzError } from '@lib/responseHelper';
import { Role } from '@if/UserRole';
app.get("/", (req: Request, res: Response) => {
    req.session!.counter = (req.session!.counter > -1 ? req.session!.counter + 1 : 0);
    return zuzJson(res, {
        Test: "yay2",
        c: req.session!.counter,
        p: process.env
    })
});

app.get("/admin/session", auth(Role.SuperAdmin), (req: Request, res: Response) => {
    const result: any = {};
    for (const sessionFile of readdirSync(process.env.SESSIONS_PATH!)) {
        result[sessionFile] = require(resolve(process.env.SESSIONS_PATH!, sessionFile));
    }
    return res.json({
        MySession: req.session,
        AllSessions: result
    });
});

app.get("/admin/session/clear", auth(Role.SuperAdmin), (req: Request, res: Response) => {
    sessionStore.clear((err) => {
        return zuzJson(res, err, !!err)
    });
});

// Exception handling
import ZuzError from '@if/ZuzError';
app.use((err: Error | ZuzError, req: Request, res: Response, next: NextFunction) => {
    zuzError(res, err);
});

app.listen(process.env.PORT, () => console.log(`Start listenning on Port ${process.env.PORT}`))