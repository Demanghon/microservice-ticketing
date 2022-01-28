import { natsWrapper, OrderCancelledEvent, OrderCreatedEvent, OrderStatus, Subjects } from "@ticketing/common"
import { Ticket } from "../../../models/ticket";
import mongoose from 'mongoose'
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {

    //create a listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    //create a ticket
    const ticket = Ticket.build({
        title: 'My ticket',
        price: 99,
        userId: 'aUserId'
    })
    await ticket.save();

    //create an order event
    const event: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id
        }
    };

    //fake a message
    //@ts-ignore
    const message:Message = {
        ack: jest.fn()
    }

    return {listener, event, ticket, message}

}

it('sets the userId of the ticket', async () => {
    const {listener, event, ticket, message} = await setup();

    await listener.onMessage(event, message);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toBeUndefined();
});

it('acks the message', async () => {

    const {listener, event, message} = await setup();

    await listener.onMessage(event, message);

    expect(message.ack).toBeCalled();

});

it('publishes a ticket updated event', async () => {

    const {listener, event, message} = await setup();

    await listener.onMessage(event, message);

    expect(natsWrapper.client.publish).toHaveBeenCalledWith(Subjects.TicketUpdated, expect.anything(), expect.anything());

    const ticketPublished = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(ticketPublished.orderId).toBeUndefined();

});