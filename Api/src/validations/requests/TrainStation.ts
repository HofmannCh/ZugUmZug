import * as Joi from "joi";

export const trainStationSubmitSchema: Joi.Schema = Joi.object({
    ImageBase64: Joi.string().required().base64(),
    Notes: Joi.string().max(255)
})