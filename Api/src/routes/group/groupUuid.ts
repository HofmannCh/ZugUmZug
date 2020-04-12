import { Router } from "express";
import db from "@/lib/database";
import ZuzError from "@/interfaces/ZuzError";
import zuzJson, { zuzError } from "@/lib/responseHelper";

const router: Router = Router()
const TABLE_NAME: string = "Groups";

router.get("/:uuid", (req, res) => {
    db.execute(db.format("SELECT * FROM ?? WHERE ?? = ? LIMIT 1", [TABLE_NAME, "Uuid", req.params.uuid]), (err, rows: any[]) => {
        if (err) zuzError(res, err);
        else if (rows.length <= 0)  zuzError(res, new ZuzError("Not found", undefined, 404)) 
        else zuzJson(res, rows[0]);
        return;
    });
});

export default router;