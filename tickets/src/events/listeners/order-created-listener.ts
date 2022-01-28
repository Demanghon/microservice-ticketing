import { Listener, NotFoundError, OrderCreatedEvent, OrderStatus, Subjects } from "@ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatePublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreateListener extends Listener<OrderCreatedEvent>{
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if(!ticket){
            throw new Error("Ticket not found");
        }

        ticket.set({orderId: data.id});
        await ticket.save();

        await new TicketUpdatePublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            version: ticket.version,
            userId: ticket.userId,
            orderId: ticket.orderId,
            title: ticket.title
        });

        msg.ack();
    }
    
}