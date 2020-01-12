import { Router } from "express";
import * as jwt from "jsonwebtoken";
import User from "@m/Users"
import { createHmac } from "crypto";
import { loginRequestSchema } from "@val/requests/Authentification";
import TokenUser from "@if/TokenUser";
import { auth } from "@lib/authentication"
import { Role } from "@if/UserRole";

const router: Router = Router()

router.post("/login", async (req, res) => {
    const loginUser = loginRequestSchema.validate(req.body)
    if (loginUser.error)
        return res.status(400).json({ message: loginUser.error.message, error: loginUser.error })

    const PASSWORD_HASH_SECRET: jwt.Secret = process.env.PASSWORD_HASH_SECRET || 'secret-pw';
    const pwHash = createHmac("sha256", PASSWORD_HASH_SECRET)
        .update(loginUser.value.Password)
        .digest("hex");

    const user = await User.findOne({
        where: { UserName: loginUser.value.UserName, PasswordHash: pwHash },
        attributes: ["UserName", "Roles"]
    })

    if (user == null)
        return res.status(404).json({ message: `User "${loginUser.value.Password}" not found witn the gived password` })

    const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'secret-jwt';
    const tokenUser: TokenUser = { UserName: user.get("UserName") as String, Roles: user.get("Roles") as Number };
    jwt.sign({ tokenUser }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION }, (err, token) => {
        return res.json({
            UserName: user.get("UserName"),
            Roles: user.get("Roles"),
            Token: "Bearer " + token
        })
    })
})

router.post("/register", auth(Role.SuperUser), async (req, res) => {

    // User.create()

    // const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'secret-jwt';
    // jwt.sign({ user }, JWT_SECRET, { expiresIn: '30s' }, (err, token) => {
    //     res.json({
    //         token
    //     });
    // })
})

export default router