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
    .error((err: string) => console.error("DB Error: " + err))

// Middleware
// Allow origin access
app.use((req: any, res: any, next: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// Json body
app.use(express.json({
    strict: true
}))

// Authentifcation
app.use(verifyToken)

// Routes
import authRouter from "@r/authentication"
app.use("/auth", authRouter)

app.get("/", (req: any, res: any) => {
    res.json({
        Test: "yay2",
        d: req.authData
    })
})

app.listen(process.env.PORT, () => console.log(`Start listenning on Port ${process.env.PORT}`))