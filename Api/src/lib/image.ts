import ZuzError from "@/interfaces/ZuzError";
import { uuid } from "uuidv4";
import { resolve } from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export function saveBase64ToPng(base64: string, name?: string): string {
    if (base64.length <= 0) throw new ZuzError("Not valid base64 for image provided", { base64 });

    let filePath = "trainstations/" + (name ?? uuid()) + ".png";
    const absPath = resolve(process.env.PWD!, process.env.FILE_UPLOAD_BASE_URL!, filePath);

    mkdirSync(dirname(absPath), { recursive: true, });
    writeFileSync(absPath, base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    return filePath;
}