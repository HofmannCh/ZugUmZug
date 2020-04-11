import { Router } from "express";
import { crud, createOrUpdate, error, CrudRequests } from "@lib/crud";
import { authOr } from "@/lib/authentication";
import { Role } from "@/interfaces/UserRole";
import * as jwt from "jsonwebtoken"
import { createHmac } from "crypto";
import zuzJson from "@/lib/responseHelper";

const router: Router = Router()
const TABLE_NAME: string = "Users";

router.use(authOr(Role.SuperUser))

crud(router, TABLE_NAME, CrudRequests.CreateOrUpdate);

router.post("/:id?", (req, res) => {
    const body = req.body;
    const PASSWORD_HASH_SECRET: jwt.Secret = process.env.PASSWORD_HASH_SECRET || 'secret-pw';
    const pwHash = createHmac("sha256", PASSWORD_HASH_SECRET)
        .update(body.Password)
        .digest("hex");
    body.PasswordHash = pwHash;
    delete body.Password;
    createOrUpdate(TABLE_NAME, body, Number(req.params.id), req.session!.EventId).then(() => {
        return zuzJson(res);
    }).catch(error(TABLE_NAME, req, res));
})

export default router