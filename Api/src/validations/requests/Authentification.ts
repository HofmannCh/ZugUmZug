import * as Joi from "joi";

export const loginRequestSchema: Joi.Schema = Joi.object({
    UserName: Joi.string()
        .alphanum()
        .min(4)
        .max(30)
        .required(),
    Password: Joi.string()
        .min(6)
        .max(30) // old -> \u00F6\u00E4\u00FC\u00D6\u00C4\u00DC\u00DF = öäüÖÄÜß; [..."öäüÖÄÜß"].map(x => "\\u00" + x.charCodeAt().toString(16).toUpperCase()).join("")
        .required()
})