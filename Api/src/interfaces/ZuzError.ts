export default class ZuzError implements Error {
    name: string = "ZuzError";
    message: string;
    stack?: string | undefined;

    data?: any;
    status?: number;

    constructor(message?: string, data?: any, status?: number) {
        this.message = message || "UndefinedError";
        this.data = data;
        this.status = status;
    }
}