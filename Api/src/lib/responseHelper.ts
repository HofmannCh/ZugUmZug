import { Response } from "express";
import ZuzError from "@/interfaces/ZuzError";

export default function zuzJson(res: Response, data?: any, success?: boolean, status?: number) {
    return res.status(status != undefined ? status : (success ? 200 : 500)).json({ success: success == undefined ? true : success,
        // UserId: res.req?.session!.User?.Id,
        // UserName: res.req?.session!.User?.UserName,
        // EventId: res.req?.session!.EventId,
        data })
}

export function zuzError(res: Response, err: any) {
    const ze = err as ZuzError;
    const ee = err as Error;
    if (ze || ee) {
        const e = ze || ee;
        console.error(`${e.name}: ${e.message}`);
        return zuzJson(res, ze || ee, false);

    } else {
        return zuzJson(res, new ZuzError("UnknownError", err), false);
    }
}