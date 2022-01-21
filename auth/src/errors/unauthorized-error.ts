import { SerializableError } from "./serializable-error";

export class UnauthorizedError extends SerializableError {
    constructor(){
        super("Unauthorized", 401)
    }
}