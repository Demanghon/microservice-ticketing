import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatePublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if(!ticket){
            throw new Error("Ticket not found");
        }

        ticket.set({orderId: undefined});
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