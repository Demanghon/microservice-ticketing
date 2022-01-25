export type ErrorModel = {errors:{message:any, field? :string}[]}

export abstract class SerializableError extends Error {

    constructor(public readonly message: string, public readonly statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, SerializableError.prototype);
    }

    public serializaleError(): ErrorModel {
        return { errors: [{ message: this.message }] };
    }
}