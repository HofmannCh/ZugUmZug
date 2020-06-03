import { Router, json, Request } from "express";
import { crud } from "@lib/crud";
import { authOr } from "@/lib/authentication";
import { Role } from "@/interfaces/UserRole";
import db from "@/lib/database";
import list, { staticQuery } from "@/lib/listhandler";
import zuzJson, { zuzError } from "@/lib/responseHelper";
import { uuid } from "uuidv4";

const router: Router = Router()
const TABLE_NAME: string = "Groups";
router.use(authOr(Role.Basis | Role.Admin));

function alterModels(rows: any[]): any[] {
    for (const r of rows) {
        try {
            r.Users = JSON.parse(r.Users).map((x: any) => x.Name).join(", ");
        } catch (error) {
            r.Users = "";
        }
    }
    return rows;
}

function unalterModels(rows: any[]): any[] {
    for (const r of rows) {
        try {
            const arr = (r.Users as string)?.split(/\s*[,;.]\s*/).filter(x => x).map(x => ({ Name: x }));
            r.Users = arr ? JSON.stringify(arr) : "[]";
        } catch (error) {
            r.Users = "[]";
        }

        // New element
        if(!r.Id || r.Id <= 0){
            r.Uuid = uuid();
        }
    }
    return rows;
}

crud(router, TABLE_NAME, undefined, true, alterModels, unalterModels);

const selects: [string, string][] = [
    ["t.Id", "Id"],
    ["t.Name", "Name"],
    ["t.Description", "Description"],
    ["t.Users", "Users"],
    ["t1.UserName", "BasisUser"],
    ["t.EventId", "EventId"],
    ["t.Uuid", "Uuid"],
];
const tableName: [string, string] = [TABLE_NAME, "t"];
const leftjoins: [string, string, string, string][] = [
    ["Users", "t1", "t1.Id", "t.BasisUserId"]
];
const eventIdAttrName: string = "t.EventId";

list(router, tableName, staticQuery(selects, tableName, leftjoins), undefined, (req:Request) => [["t.Name", "like", "%" + req.query.filterText + "%", !!req.query.filterText]], eventIdAttrName, alterModels);

router.get("/listBasisUsers", (req, res) => {
    const q = db.query("SELECT ??, ?? FROM ?? WHERE EventId IS NOT NULL AND EventId = ?", ["Id", "UserName", "Users", req.session!.EventId]);
    db.execute(db.query("SELECT ??, ?? FROM ?? WHERE EventId IS NOT NULL AND EventId = ?", ["Id", "UserName", "Users", req.session!.EventId]), (err: any, rows: any[]) => {
        if (err) return zuzError(res, err);
        return zuzJson(res, rows);
    });
});

export default router