import { Response } from "express";
import ZuzError from "@/interfaces/ZuzError";
import { QueryError } from "mysql2";

export default function zuzJson(res: Response, data?: any, success?: boolean, status?: number) {
    return res.status(status != undefined ? status : (success == false ? 500 : 200)).json({
        success: success == undefined ? true : success,
        // UserId: res.req?.session!.User?.Id,
        // UserName: res.req?.session!.User?.UserName,
        // EventId: res.req?.session!.EventId,
        data
    })
}

export function zuzError(res: Response, err: any) {
    if (err instanceof ZuzError) {
        console.error(err.message);
        return zuzJson(res, err, false, err.status);
    } else if (err instanceof Error) {
        console.error(err.message);
        return zuzJson(res, new ZuzError(`${err.name}: ${err.message}`, undefined, undefined, err), false);
    } else {
        return zuzJson(res, new ZuzError("UnknownError", {...err, message: err?.message ?? "Error"}), false);
    }
}