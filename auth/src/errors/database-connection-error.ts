import { SerializableError } from "./serializable-error";

export class DatabaseConnectionError extends SerializableError{
    constructor(message: string){
        super("Error on connection to database", 500);
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
}