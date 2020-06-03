import { Router } from "express";
import * as jwt from "jsonwebtoken";
import { createHmac } from "crypto";
import { loginRequestSchema } from "@val/requests/Authentification";
import User from "@/interfaces/User";
import db from "@lib/database";
import zuzJson, { zuzError } from "@/lib/responseHelper";
import ZuzError from "@/interfaces/ZuzError";
import { auth } from "@/lib/authentication";
import { Role } from "@/interfaces/UserRole";

const router: Router = Router()
router.use(auth(Role.SuperAdmin));

// router.get("/listBasisUsers", (req, res) => {
//     db.execute(db.query("SELECT ??, ?? FROM ?? WHERE EventId IS NOT NULL AND EventId = ?", ["Id", "UserName", "Users", req.session!.EventId]), (err: any, rows: any[]) => {
//         if (err) return zuzError(res, err);
//         return zuzJson(res, rows);
     
//     });
// });

// router.get("/listBasisUsers", (req, res) => {
//     db.execute(db.query("SELECT ??, ?? FROM ?? WHERE EventId IS NOT NULL AND EventId = ?", ["Id", "UserName", "Users", req.session!.EventId]), (countErr: any, countRows: any[]) => {
//         if (countErr) return zuzError(res, countErr);

//     });
// });

export default router