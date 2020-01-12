import 'module-alias/register';
import express from "express"
import * as dotenv from "dotenv";

import db from "@lib/database";
import { verifyToken } from "@lib/authentication"

const app: express.Application = express()

// DotEnv init
dotenv.config()

// Test database
db.authenticate()
    .then(() => console.log("Database connected"))
    .error((err:string) => console.error("DB Error: " + err))

// Middleware
// Json body
app.use(express.json({
    strict: true
}))

// Authentication
app.use(verifyToken);

// Routes
import authRouter from "./routes/authentication"
app.use("/auth", authRouter)

app.get("/", (req:any, res:any) => {
    console.log("sp");
    res.json({
        Test: "yay2"
    })
})

app.listen(process.env.PORT, () => console.log(`Start listenning on Port ${process.env.PORT}`))