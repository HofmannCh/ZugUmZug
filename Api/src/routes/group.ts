import { Router } from "express";
import { crud } from "@lib/crud";
import { authOr } from "@/lib/authentication";
import { Role } from "@/interfaces/UserRole";

const router: Router = Router()
const TABLE_NAME: string = "Groups";

router.use(authOr(Role.Basis | Role.SuperUser));

crud(router, TABLE_NAME);

export default router