import 'module-alias/register';
import * as dotenv from "dotenv";

// DotEnv init
dotenv.config()

import express from "express"
import db from "@lib/database";
import { verifyToken } from "@lib/authentication"

const app: express.Application = express()

// Test database
db.authenticate()
    .then(() => console.log("Database connected"))
    .error((err:string) => console.error("DB Error: " + err))

// Middleware

// Allow origin access
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// Json body
app.use(express.json({
    strict: true
}))

// Authentication
app.use(verifyToken);

// Routes
import authRouter from "@r/authentication"
app.use("/auth", authRouter)

app.get("/", (req:any, res:any) => {
    console.log("sp");
    res.json({
        Test: "yay2"
    })
})

app.listen(process.env.PORT, () => console.log(`Start listenning on Port ${process.env.PORT}`))