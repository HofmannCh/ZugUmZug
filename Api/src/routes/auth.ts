import { Router } from "express";
import * as jwt from "jsonwebtoken";
import { createHmac } from "crypto";
import { loginRequestSchema } from "@val/requests/Authentification";
import User from "@/interfaces/User";
import db from "@lib/database";
import zuzJson from "@/lib/responseHelper";
import ZuzError from "@/interfaces/ZuzError";

const router: Router = Router()

router.post("/login", (req, res) => {
    const loginUser = loginRequestSchema.validate(req.body)

    const PASSWORD_HASH_SECRET: jwt.Secret = process.env.PASSWORD_HASH_SECRET || 'secret-pw';
    const pwHash = createHmac("sha256", PASSWORD_HASH_SECRET)
        .update(loginUser.value.Password)
        .digest("hex");

    delete req.session!.User;
    delete req.session!.EventId;

    db.execute("SELECT ??, ??, ?? FROM ?? WHERE ?? = ? AND ?? = ? LIMIT 1", ["UserName", "Roles", "EventId", "Users", "UserName", loginUser.value.UserName, "PasswordHash", pwHash], (err: any, rows: any[]) => {
        const user: any = rows[0];
        if (user == null)
            throw new ZuzError(`User "${loginUser.value.UserName}" not found witn the given password`, undefined, 404)

        const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'secret-jwt';
        const userObj: User = { UserName: user.UserName as string, Roles: user.Roles as number, EventId: user.EventId as number };
        req.session!.User = userObj;
        req.session!.EventId = userObj.EventId;
        try {
            const token: string = jwt.sign({ userObj }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
            return zuzJson(res, {
                User: userObj,
                Token: "Bearer " + token
            });
        } catch (err) {
            throw new ZuzError(err.message, err)
        }
    });
})

export default router