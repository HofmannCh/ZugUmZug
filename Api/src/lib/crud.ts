import { Router, Request, Response } from "express";
import db from "@lib/database";
import ZuzError from "@/interfaces/ZuzError";
import zuzJson, { zuzError } from "./responseHelper";

export enum CrudRequests {
    GetAll = 1,
    GetById = 2,
    Destroy = 4,
    CreateOrUpdate = 8
}

export function error(table: string, req: Request, res: Response) {
    return (err: any) => {
        const data: any = {
            table,
            eventId: req.session!.EventId,
            router: req.originalUrl,
            method: req.method,
            error: {}
        };

        if (err as Error) {
            const e = err as Error;
            data.error["name"] = e.name;
            data.error["message"] = e.message;
            data.error["stack"] = e.stack;
        }

        for (const prop in err)
            data.error[prop] = err[prop];

        return zuzError(res, new ZuzError("Crud" + (err!.message ? ": " + err.message : ""), data, undefined, err));
    };
};

export function crud(router: Router, table: string, toExclude?: number, useEventId: boolean = false, alterModels?: (any: any[]) => any[], unalterModels?: (any: any[]) => any[]) {
    if (toExclude == undefined || ((toExclude & CrudRequests.GetById) != CrudRequests.GetById))
        router.get("/r/:id", (req, res) => {
            get(table, Number(req.params.id), useEventId ? req.session!.EventId : undefined).then((o) => {
                const ao = alterModels ? alterModels([o]) : [o];
                if (ao?.length)
                    o = ao[0];
                return zuzJson(res, o, !!o, o ? 200 : 404);
            }).catch(error(table, req, res));
        })

    if (toExclude == undefined || ((toExclude & CrudRequests.CreateOrUpdate) != CrudRequests.CreateOrUpdate))
        router.post("/cou/:id?", (req, res) => {
            try {
                const [body] = unalterModels ? unalterModels([req.body]) : [req.body];
                createOrUpdate(table, body, Number(req.params.id ?? body.Id), useEventId ? req.session!.EventId : undefined).then(() => {
                    return zuzJson(res);
                }).catch(error(table, req, res));                
            } catch (err) {
                error(table, req, res)(err);
            }
        })

    if (toExclude == undefined || ((toExclude & CrudRequests.Destroy) != CrudRequests.Destroy))
        router.delete("/d/:id", (req, res) => {
            destory(table, Number(req.params.id), useEventId ? req.session!.EventId : undefined).then(() => {
                return zuzJson(res);
            }).catch(error(table, req, res));
        })
}

export function get(table: string, id: number, eventId?: number) {
    return new Promise<object>((res, rej) => {
        db.execute(eventId == undefined
            ? db.format("SELECT * FROM ?? WHERE ?? = ? LIMIT 1", [table, "Id", id])
            : db.format("SELECT * FROM ?? WHERE ?? = ? AND ?? = ? LIMIT 1", [table, "Id", id, "EventId", eventId])
            , (err, rows: any[]) => {
                if (err) rej(err);
                else if (rows.length <= 0) rej(new ZuzError("Not found", undefined, 404))
                else res(rows[0]);
                return;
            });
    });
}

export function getAll(table: string, eventId?: number) {
    return new Promise<object[]>((res, rej) => {
        db.execute(eventId == undefined
            ? db.format("SELECT * FROM ??", [table])
            : db.format("SELECT * FROM ?? WHERE ?? = ?", [table, "EventId", eventId])
            , (err, rows: any[]) => {
                if (err) rej(err);
                else res(rows);
                return;
            });
    });
}

export function destory(table: string, id: number, eventId?: number) {
    return new Promise<void>((res, rej) => {
        db.execute(eventId == undefined
            ? db.format("DELETE FROM ?? WHERE ?? = ?", [table, "Id", id])
            : db.format("DELETE FROM ?? WHERE ?? = ? AND ?? = ?", [table, "Id", id, "EventId", eventId])
            , (err, rows: any[]) => {
                if (err) rej(err);
                else res();
                return;
            });
    });
}

export function createOrUpdate(table: string, newData: any, id?: number, eventId?: number) {
    return new Promise<void>((res, rej) => {
        let isNew = !id || id <= 0;

        db.execute(eventId == undefined
            ? db.format("SELECT * FROM ?? WHERE ?? = ? LIMIT ?", [table, "Id", isNew ? 0 : id, isNew ? 0 : 1])
            : db.format("SELECT * FROM ?? WHERE ?? = ? AND ?? = ? LIMIT ?", [table, "Id", isNew ? 0 : id, "EventId", eventId, isNew ? 0 : 1])
            , (err, rows: any[], fields) => {
                if (err) {
                    rej(err);
                    return;
                }
                isNew = isNew || rows.length <= 0;
                let updateBody = isNew ? {} : rows[0];
                delete updateBody.Id;

                let countNew = 0;
                for (const f of fields.filter(x => x.name !== "Id")) {
                    const val = newData[f.name];
                    if (val == undefined) continue;
                    updateBody[f.name] = val;
                    countNew++;
                }

                if (countNew <= 0) {
                    res();
                    return;
                }

                if (isNew) {
                    delete updateBody["Id"];
                    if (eventId)
                        updateBody.EventId = eventId;

                    let query = "INSERT INTO ?? (";
                    for (const p in updateBody) {
                        query += db.escapeId(p) + ", ";
                    }
                    query = query.substring(0, query.length - 2) + ") VALUES (";
                    for (const p in updateBody) {
                        query += db.escape(updateBody[p]) + ", ";
                    }
                    query = query.substring(0, query.length - 2) + ")";

                    db.execute(db.format(query, [table]), (err, rows: any[]) => {
                        if (err) rej(err);
                        else res();
                        return;
                    });
                } else {
                    let query = "UPDATE ?? SET ";
                    for (const p in updateBody) {
                        query += db.escapeId(p) + " = " + db.escape(updateBody[p]) + ", ";
                    }
                    query = query.substring(0, query.length - 2);
                    db.execute(db.format(query + " WHERE ?? = ?", [table, "Id", id]), (err, rows: any[]) => {
                        if (err) rej(err);
                        else res();
                        return;
                    });
                }
            });
    });
}