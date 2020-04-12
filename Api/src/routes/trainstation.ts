import { Router } from "express";
import resolveGroupUuid from "@/lib/group";
import { trainStationSubmitSchema } from "@/validations/requests/TrainStation";
import { saveBase64ToPng } from "@/lib/image";
import { createOrUpdate, error } from "@/lib/crud";
import zuzJson, { zuzError } from "@/lib/responseHelper";

const router: Router = Router()

router.post("/submit", (req, res) => {
    resolveGroupUuid(req).then((group: any) => {
        trainStationSubmitSchema.validate(req.body);

        const imgUrl = saveBase64ToPng(req.body.ImageBase64);

        const newData = {
            Image: imgUrl,
            Notes: req.body.Notes,
            DateTime: new Date(),
            Valid: false,
            GroupId: group.Id
        };

        createOrUpdate("TrainStations", newData).then(x => {
            return zuzJson(res, imgUrl);
        }).catch(error("TrainStations", req, res));
    }).catch(e => zuzError(res, e));
});

export default router