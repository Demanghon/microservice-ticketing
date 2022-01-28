import { SerializableError } from "@ticketing/common/build/errors/serializable-error";

export class TicketOrderedError extends SerializableError {
    constructor(){
        super("The ticker is ordered, you can't update it", 423);
    }
}