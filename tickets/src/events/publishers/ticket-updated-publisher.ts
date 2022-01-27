import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketing/common";

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent>{
    subject:Subjects.TicketUpdated = Subjects.TicketUpdated;
}