import { Router } from "express";
import db from "./database";
import { zuzError } from "./responseHelper";
import ZuzError from "@/interfaces/ZuzError";

export function staticQuery(selects: [string, string][], tablename: [string, string], leftJoins: [string, string, string, string][]): string | undefined {
    if (selects.length <= 0)
        return undefined;

    let query = "SELECT ";
    for (const [key, alias] of selects)
        query += db.escapeId(key) + " AS " + db.escapeId(alias) + ", ";
    query = query.slice(0, query.length - 2) + " ";

    query += "FROM " + db.escapeId(tablename[0]) + " AS " + db.escapeId(tablename[1]) + " ";

    for (const [table, alias, cond1, cond2] of leftJoins)
        query += "LEFT JOIN " + db.escapeId(table) + " AS " + db.escapeId(alias) + " ON " + db.escapeId(cond1) + " = " + db.escapeId(cond2) + " ";
    return query.trimEnd();
}

export function staticQueryCount(tablename: string): string {
    return db.format("SELECT count(??) AS ?? FROM ??", ["Id", "Count", tablename]);
}

export function whereQuery(baseQuery: string, wheres: [string, string, string, boolean?][]) {
    let query = baseQuery + " ";

    if (wheres.filter(x => x[3] !== false).length >= 1) {
        query += "WHERE "
        for (const [condAttr, oper, value] of wheres.filter(x => x[3] !== false))
            query += db.escapeId(condAttr) + " " + oper.trim() + " " + db.escape(value) + " AND ";
        query = query.slice(0, query.length - 4);
    }

    return query.trim();
}

export function dynamicQuery(baseQuery: string, wheres: [string, string, string, boolean?][], orders: [string, string][], limitOffset?: [number, number]) {
    let query = whereQuery(baseQuery, wheres) + " ";

    if (orders.length >= 1) {
        query += "ORDER BY "
        for (const [col, way] of orders)
            query += db.escapeId(col) + " " + (way.toLowerCase() === "desc" ? "DESC" : "ASC") + ", ";
        query = query.slice(0, query.length - 2) + " ";
    }

    if (limitOffset) {
        query += "LIMIT " + db.escape(limitOffset[0]) + ", " + db.escape(limitOffset[1]) + " ";
    }

    return query.trimEnd();
}

export default function list(router: Router, tableName: string, baseQuery?: string) {
    router.get("/list", (req, res) => {
        if (!baseQuery)
            return zuzError(res, new ZuzError("Invalid base query", undefined, 500))

        const tb = JSON.parse(req.query.tb);
        const whereConditions: [string, string, string, boolean?][] = [["Name", "like", req.query.filterText + "%", !!req.query.filterText]];
        const orderAttrs = tb.sorters.map((x: any) => [x.field, x.dir]);
        const pagingAttrs: [number, number] | undefined = tb.size <= -1 ? undefined : [(tb.page - 1) * tb.size, tb.size]

        db.execute(whereQuery(staticQueryCount(tableName), whereConditions), (countErr: any, countRows: any[]) => {
            if (countErr) return zuzError(res, countErr);

            const count = countRows[0].Count as number;
            console.log(dynamicQuery(baseQuery, whereConditions, orderAttrs, pagingAttrs));
            db.execute(dynamicQuery(baseQuery, whereConditions, orderAttrs, pagingAttrs), (err: any, rows: any[]) => {
                if (err) return zuzError(res, err);
                // for (const i of rows) {
                //     i.Users = i.Users ? JSON.parse(i.Users).map((x:any) => x.name).join(", ") : "";
                // }
                res.json({ last_page: Math.ceil(count / tb.size), data: rows, current_page: tb.page, total: count });
            });
        });
    });
}