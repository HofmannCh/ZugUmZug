import { Router } from "express";
import { crud } from "@lib/crud";
import { authOr } from "@/lib/authentication";
import { Role } from "@/interfaces/UserRole";

const router: Router = Router()
const TABLE_NAME: string = "Challenges";

router.use(authOr(Role.Basis | Role.Admin));

crud(router, TABLE_NAME);

export default router