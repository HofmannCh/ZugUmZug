import 'module-alias/register';
import * as dotenv from "dotenv";

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
app.use((req: Request, res: Response, next: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// Json body
app.use(express.json({
    strict: true
}));

// Session
import Session from "express-session";
import SessionFileStore from "session-file-store";
const SESSIONS_PATH = "sessions";
const sessionStore = new (SessionFileStore(Session))({ path: SESSIONS_PATH });
const sessionOptions: Session.SessionOptions = {
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
    for (const sessionFile of readdirSync(SESSIONS_PATH)) {
        result[sessionFile] = require(SESSIONS_PATH + "/" + sessionFile);
    }
    sessionStore.length((err, data) => {
        return res.json({
            MySession: req.session,
            AllSessions: result
        });
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