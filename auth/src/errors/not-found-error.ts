import { SerializableError } from "./serializable-error";

export class NotFoundError extends SerializableError{

    constructor(){
        super("Not found", 404);
    }
}