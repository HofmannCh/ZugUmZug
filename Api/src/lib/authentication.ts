import * as jwt from "jsonwebtoken"
import { Role } from "@if/UserRole"
import { Request, Response } from "express";
import db from "./database";
import { zuzError } from "./responseHelper";
import ZuzError from "@/interfaces/ZuzError";

function getEventId() {
    return new Promise(res => {
        db.execute(db.query("SELECT ?? FROM ?? LIMIT 1", ["Id", "Events"]), (err: any, rows: any[]) => {
            if (err || !(rows[0].Id as number)) return res(1);
            return res(rows[0].Id as number);
        });
    });
}

// Verify Token
export function verifyToken(req: Request, res: Response, next: any): any {

    // No authentification
    if (req.path === "/auth/login" || req.path === "/auth/register") {
        return next()
    }

    // bearer
    let bearerToken: string | undefined = req.session!.Token || undefined;
    if (!bearerToken) {
        const bearerHeader = req.header("Authorization");
        bearerToken = bearerHeader?.substring(7); // "Bearer " = 7 characters
    }

    if (bearerToken) {
        const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'secret-jwt';

        try {
            const data: any = jwt.verify(bearerToken, JWT_SECRET)

            // restore defaults
            if (!req.session!.UserName
                || !req.session!.Roles
                || !req.session!.OriginalEventId
                || !req.session!.EventId
                || !req.session!.Token) {
                if (data.UserId) {
                    db.execute(db.format("SELECT ??, ??, ?? FROM ?? WHERE ?? = ? LIMIT 1", ["UserName", "Roles", "EventId", "Users", "Id", data.UserId]), async (err: any, rows: any[]) => {
                        if (err) return zuzError(res, err);
                        else if (rows.length <= 0) return zuzError(res, new ZuzError(`User with Id ${data.UserId} not found`, undefined, 404));
                        const user: any = rows[0];

                        req.session!.UserAgent = req.headers["user-agent"];
                        req.session!.UserName = user.UserName;
                        req.session!.Roles = user.Roles;
                        req.session!.OriginalEventId = user.EventId;
                        req.session!.EventId = user.EventId ?? await getEventId();
                        req.session!.Token = bearerToken;

                        return next();
                    });
                } else {
                    return res.status(403).json({
                        message: "Forbidden, problems with authentification",
                        exception: "Problems with UserId",
                        error: undefined
                    });
                }
            } else {
                return next();
            }
        } catch (err) {
            return res.status(403).json({
                message: "Forbidden, problems with authentification",
                exception: err.name,
                error: err
            })
        }
    } else {
        // Unauthorized
        return res.status(401).json({
            message: "Unauthorized, please log in and/or provide Bearer authentification header"
        });
    }
}

/**
 * For accessing this function all of the given roles are required
 * @param roles 
 */
export function auth(flagSet: number) {
    return (req: Request, res: Response, next: any) => {
        const roles: number = req.session!.Roles as number;
        if (roles) {
            // SuperAdmin
            if ((roles & Role.SuperAdmin) === Role.SuperAdmin)
                return next()

            if (flagSet === (flagSet & roles as number))
                return next();
        }
        return res.status(403).json({
            message: "Forbidden, you don't have enougth permission"
        })
    }
}

/**
 * For accessing this function one of the given roles are required
 * @param roles 
 */
export function authOr(flagSet: number) {
    return (req: Request, res: Response, next: any) => {
        const roles: number = req.session!.Roles as number;
        if (roles) {
            // SuperAdmin
            if ((roles & Role.SuperAdmin) === Role.SuperAdmin)
                return next()

            if (0 < (flagSet & roles))
                return next();
        }

        return res.status(403).json({
            message: "Forbidden, you don't have enougth permission"
        })
    }
}