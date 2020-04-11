import { Router } from "express";
import { crud } from "@lib/crud";
import { auth } from "@/lib/authentication";
import db from "@/lib/database";

const router: Router = Router()
const TABLE_NAME: string = "Trainstations";

router.post("/submit", (req, res) => {
    
});

export default router