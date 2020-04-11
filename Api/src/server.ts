import 'module-alias/register';
import * as dotenv from "dotenv";

// DotEnv init
dotenv.config()

import express, { Request, Response } from "express"
import { verifyToken, auth } from "@lib/authentication"

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
app.use(verifyToken)

// Exception handling
app.use((err: any, req: Request, res: Response, next: any) => {
    zuzError(res, err);
})

// Routes
import { readdirSync, readFileSync } from "fs";
import { dirname } from "path";
import { Role } from './interfaces/UserRole';
import { encode } from 'punycode';
import ZuzError from './interfaces/ZuzError';
import { Err } from 'joi';
import zuzJson, { zuzError } from './lib/responseHelper';
for (const name of readdirSync(dirname(require("module")._resolveFilename("@r/auth")))) {
    const noEndingName = name.slice(0, name.lastIndexOf("."));
    app.use("/" + noEndingName, require("@r/" + noEndingName).default);
}


// Shit and test
app.get("/", (req: Request, res: Response) => {
    req.session!.counter = (req.session!.counter > -1 ? req.session!.counter + 1 : 0);
    res.json({
        Test: "yay2",
        c: req.session!.counter
    })
})

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
    })
});

app.get("/admin/session/clear", auth(Role.SuperAdmin), (req: Request, res: Response) => {
    sessionStore.clear((err) => {
        return res.json(err);
    });
});

app.listen(process.env.PORT, () => console.log(`Start listenning on Port ${process.env.PORT}`))