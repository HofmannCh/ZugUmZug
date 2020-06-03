import { Router, Request } from "express";
import db from "./database";
import { zuzError } from "./responseHelper";
import ZuzError from "@/interfaces/ZuzError";
import { request } from "http";

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

export function staticQueryCount(tablename: [string, string]): string {
    return db.format("SELECT count(??) AS ?? FROM ?? AS ??", [tablename[1] + ".Id", "Count", tablename[0], tablename[1]]);
}

export function whereOrQuery(ors: [string, string, string, boolean?][]) {
    let query = ""
    for (const [condAttr, oper, value] of ors.filter(x => x[3] !== false))
        query += db.escapeId(condAttr) + " " + oper.trim() + " " + db.escape(value) + " OR ";

    if (query)
        query = query.slice(0, query.length - 4);

    return query;
}

export function whereAndQuery(baseQuery: string, wheres: [string, string, string, boolean?][], whereOrQuery?: string) {
    let query = baseQuery + " ";

    if (wheres.filter(x => x[3] !== false).length >= 1 || whereOrQuery) {
        query += "WHERE "

        for (const [condAttr, oper, value] of wheres.filter(x => x[3] !== false))
            query += db.escapeId(condAttr) + " " + oper.trim() + " " + db.escape(value) + " AND ";

        if (whereOrQuery)
            query += `(${whereOrQuery})`
        else
            query = query.slice(0, query.length - 4);
    }

    return query.trim();
}

export function dynamicQuery(baseQuery: string, wheres: [string, string, string, boolean?][], ors: [string, string, string, boolean?][], orders: [string, string][], limitOffset?: [number, number]) {
    let query = whereAndQuery(baseQuery, wheres, whereOrQuery(ors)) + " ";

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

export default function list(router: Router, tableName: [string, string], baseQuery?: string, searchWhereAndCondition?: (req: Request) => [string, string, string, boolean?][], searchWhereOrCondition?: (req: Request) => [string, string, string, boolean?][], eventAttrName?: string, parseOutData?: (rows: any[]) => any[]) {
    router.get("/list", (req, res) => {
        if (!baseQuery)
            return zuzError(res, new ZuzError("Invalid base query", undefined, 500))

        const tb = JSON.parse(req.query.tb);
        const searchWhereAndConditions = searchWhereAndCondition ? searchWhereAndCondition(req) : [];
        const searchWhereOrConditions = searchWhereOrCondition ? searchWhereOrCondition(req) : [];
        searchWhereOrConditions.push([tableName[1] + ".Id", "like", req.query.filterText + "%"])
        for (const swc of [...searchWhereAndConditions, ...searchWhereOrConditions]){
            swc[2] = swc[2].toUpperCase();
            swc[3] = swc[3] == undefined ? !!req.query.filterText : swc[3];
        }

        if (eventAttrName)
            searchWhereAndConditions.push([eventAttrName, "=", req.session!.EventId]);

        const orderAttrs = tb.sorters.map((x: any) => [x.field, x.dir]);
        const pagingAttrs: [number, number] | undefined = tb.size <= -1 ? undefined : [(tb.page - 1) * tb.size, tb.size]

        db.execute(whereAndQuery(staticQueryCount(tableName), searchWhereAndConditions, whereOrQuery(searchWhereOrConditions)), (countErr: any, countRows: any[]) => {
            if (countErr) return zuzError(res, countErr);

            const count = countRows[0].Count as number;
            db.execute(dynamicQuery(baseQuery, searchWhereAndConditions, searchWhereOrConditions, orderAttrs, pagingAttrs), (err: any, rows: any[]) => {
                if (err) return zuzError(res, err);

                if (parseOutData) {
                    try {
                        rows = parseOutData(rows);
                    } catch (error) {
                        console.error(error);
                    }
                }

                res.json({ last_page: Math.ceil(count / tb.size), data: rows, current_page: tb.page, total: count });
            });
        });
    });
}