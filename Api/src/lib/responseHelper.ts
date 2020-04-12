import { Response } from "express";
import ZuzError from "@/interfaces/ZuzError";

export default function zuzJson(res: Response, data?: any, success?: boolean, status?: number) {
    return res.status(status != undefined ? status : (success == false ? 500 : 200)).json({ success: success == undefined ? true : success,
        // UserId: res.req?.session!.User?.Id,
        // UserName: res.req?.session!.User?.UserName,
        // EventId: res.req?.session!.EventId,
        data })
}

export function zuzError(res: Response, err: any) {
    const ze = err as ZuzError;
    const ee = err as Error;
    if(ze){
        console.error(`${ze.name}: ${ze.message}`);
        return zuzJson(res, ze, false, ze.status);
    }
    else if (ee) {
        console.error(`${ee.name}: ${ee.message}`);
        return zuzJson(res, new ZuzError(`${ee.name}: ${ee.message}`, undefined, undefined, ee), false);

    } else {
        return zuzJson(res, new ZuzError("UnknownError", err), false);
    }
}