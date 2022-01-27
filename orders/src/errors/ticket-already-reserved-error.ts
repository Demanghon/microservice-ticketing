import { SerializableError } from "@ticketing/common/build/errors/serializable-error";

export class TicketAlreadyReservedError extends SerializableError{

    constructor(){
        super(`The ticket is already ordered`, 409);
    }
}