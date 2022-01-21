import { SerializableError } from "./serializable-error";

export class SigninError extends SerializableError{

    constructor(){
        super("Invalid credentials", 401)
    }
}