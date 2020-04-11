import { Router } from "express";
import { crud } from "@lib/crud";
import { authOr } from "@/lib/authentication";
import { Role } from "@/interfaces/UserRole";

const router: Router = Router()
const TABLE_NAME: string = "Events";

router.use(authOr(Role.SuperUser));

crud(router, TABLE_NAME);

export default router