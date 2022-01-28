import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@ticketing/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queue/expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(`waiting ${delay} ms`);

        await expirationQueue.add({orderId: data.id}, {delay});
        msg.ack();
    }
}