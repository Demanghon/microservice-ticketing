import { SerializableError } from "./serializable-error";

export class DatabaseConnectionError extends SerializableError{
    constructor(message:string){
        super(message, 500);
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
}