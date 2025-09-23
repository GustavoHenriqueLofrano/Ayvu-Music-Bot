;
export class RunBlockError extends Error {
    constructor() {
        super("The execution flow has been blocked");
        this.name = "RunBlockError";
    }
}
