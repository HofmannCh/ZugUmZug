export default class ZuzError implements Error {
    name: string = "ZuzError";
    message: string;
    stack?: string | undefined;

    data?: any;
    status?: number;
    innerError?: any;

    constructor(message?: string, data?: any, status?: number, innerError?: any) {
        this.message = message || "UndefinedError";
        this.data = data;
        this.status = status;
        this.innerError = innerError;
    }

    public toString() : string {
        return `${this.name}> ${this.message}`;
    }
}