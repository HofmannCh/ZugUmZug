import { Request } from "express";
import * as Joi from "joi";
import db from "./database";
import { zuzError } from "./responseHelper";
import ZuzError from "@/interfaces/ZuzError";

export default function resolveGroupUuid(req: Request) {
    if (req.session!.Group?.Uuid) return req.session!.Group;

    if (req.body.Uuid) {
        try {
            Joi.string().required().uuid({ version: ["uuidv4"] }).validate(req.body.Uuid);

            db.execute(db.format("SELECT * FROM ?? WHERE ?? = ? LIMIT 1", ["Groups", "Uuid", req.body.Uuid]), (err, rows: any[]) => {
                if (err) throw new ZuzError("SQL", err);
                req.session!.Group = rows[0];
                return req.session!.Group;
            });

        } catch (error) {
            throw new ZuzError("No valid uuid provided", { uuid: req.body.Uuid, error });
        }
    } else {
        throw new ZuzError("No valid uuid provided");
    }
}