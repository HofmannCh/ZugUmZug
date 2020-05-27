import { Router } from "express";
import { crud } from "@lib/crud";
import { authOr } from "@/lib/authentication";
import { Role } from "@/interfaces/UserRole";
import db from "@/lib/database";
import list, { staticQuery } from "@/lib/listhandler";

const router: Router = Router()
const TABLE_NAME: string = "Groups";
router.use(authOr(Role.Basis | Role.Admin));

crud(router, TABLE_NAME);

const selects : [string, string][] = [
    ["t.Id", "Id"],
    ["t.Name", "Name"],
    ["t.Description", "Description"],
    ["t.Users", "Users"],
    ["t1.UserName", "BasisUser"],
    ["t.EventId", "EventId"],
    ["t.Uuid", "Uuid"],
];
const tableName : [string, string] = [TABLE_NAME, "t"];
const leftjoins : [string, string, string, string][] = [
    ["Users", "t1", "t1.Id", "t.BasisUserId"]
];

list(router, TABLE_NAME, staticQuery(selects, tableName, leftjoins));

export default router