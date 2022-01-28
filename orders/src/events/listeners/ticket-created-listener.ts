import { Listener, Subjects, TicketCreatedEvent } from "@ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    queueGroupName: string = queueGroupName;
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const ticket = Ticket.build({
            id: data.id,
            title: data.title,
            price: data.price
        });
        await ticket.save();
        msg.ack();
    }

    
}