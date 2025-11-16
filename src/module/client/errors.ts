export class StatusError extends Error {
    public readonly status: number;

    constructor(status: number, message?: string) {
        super(message ?? `Request failed with status code ${status}`);
        this.status = status;
    }
}