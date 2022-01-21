import { SerializableError } from "./serializable-error";

export class ConfigurationError extends Error{

    constructor(private _errors:{key:string, message:string}[]){
        super(JSON.stringify(_errors));

        Object.setPrototypeOf(this, ConfigurationError.prototype);
    }


}