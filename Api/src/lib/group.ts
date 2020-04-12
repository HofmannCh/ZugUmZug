import { Request } from "express";
import Joi from "@hapi/joi";
import db from "./database";
import { zuzError } from "./responseHelper";
import ZuzError from "@/interfaces/ZuzError";

export default function resolveGroupUuid(req: Request) {
    return new Promise((res, rej) => {
        if (req.session!.Group?.Uuid) return res(req.session!.Group);

        if (req.body.Uuid) {
            try {
                Joi.string().required().uuid({ version: ["uuidv4"] }).validate(req.body.Uuid);

                db.execute(db.format("SELECT * FROM ?? WHERE ?? = ? LIMIT 1", ["Groups", "Uuid", req.body.Uuid]), (err, rows: any[]) => {
                    if (err) return rej(new ZuzError("SQL", err));
                    req.session!.Group = rows[0];
                    return res(req.session!.Group);
                });

            } catch (error) {
                return rej(new ZuzError("No valid uuid provided", { uuid: req.body.Uuid, error }));
            }
        } else {
            return rej(new ZuzError("No valid uuid provided"));
        }
    })
}