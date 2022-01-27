import { Publisher, Subjects, TicketCreatedEvent } from "@ticketing/common";

export class TicketCreaterPublisher extends Publisher<TicketCreatedEvent>{
    subject:Subjects.TicketCreated = Subjects.TicketCreated;
}