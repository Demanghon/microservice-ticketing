import { ValidationError } from "express-validator";
import { getEffectiveTypeParameterDeclarations } from "typescript";
import { ErrorModel, SerializableError } from "./serializable-error";

export class RequestValidationError extends SerializableError {

    constructor(private _errors: ValidationError[]) {
        super("", 400);
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

   public serializaleError(): ErrorModel {
        return {
            errors: this._errors.map((value): { message: string; field: string } => {
                return { message: value.msg, field: value.param };
            }),
        };
    }
}