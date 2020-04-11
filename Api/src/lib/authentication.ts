import * as jwt from "jsonwebtoken"
import User from "@/interfaces/User"
import { Role } from "@if/UserRole"
import { Request, Response } from "express";

// Verify Token
export function verifyToken(req: Request, res: Response, next: any): any {
    // No authentification
    if (req.path === "/auth/login"
        || req.path === "/auth/register"
        || req.path === "/t") {
        return next()
    }

    const bearerHeader: string = req.header("authorization")!;

    if (bearerHeader && bearerHeader.startsWith("Bearer ")) {
        const bearerToken = bearerHeader.substring(7); // "Bearer " = 7 characters

        const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'secret-jwt';

        try {
            jwt.verify(bearerToken, JWT_SECRET)
            return next()
        } catch (err) {
            return res.status(403).json({
                message: "Forbidden, problems with authentification",
                exception: err.name,
                error: err
            })
        }
    }

    // Unauthorized
    return res.status(401).json({
        message: "Unauthorized, please log in and/or provide Bearer authentification header"
    });
}

/**
 * For accessing this function all of the given roles are required
 * @param roles 
 */
export function auth(flagSet: number) {
    return (req: Request, res: Response, next: any) => {
        const tokenUser: User = req.session!.User;

        if (tokenUser) {
            // SuperAdmin
            if (tokenUser.Roles as number & Role.SuperAdmin === Role.SuperAdmin)
                return next()

            if (flagSet === (flagSet & tokenUser.Roles as number))
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
        const tokenUser: User = req.session!.User;

        if (tokenUser) {
            // SuperAdmin
            if (tokenUser.Roles as number & Role.SuperAdmin === Role.SuperAdmin)
                return next()

            if (0 < (flagSet & tokenUser.Roles as number))
                return next();
        }

        return res.status(403).json({
            message: "Forbidden, you don't have enougth permission"
        })
    }
}