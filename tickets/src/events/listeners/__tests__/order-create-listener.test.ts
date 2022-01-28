import { natsWrapper, OrderCreatedEvent, OrderStatus, Subjects } from "@ticketing/common"
import { Ticket } from "../../../models/ticket";
import { OrderCreateListener } from "../order-created-listener"
import mongoose from 'mongoose'
import { Message } from "node-nats-streaming";

const setup = async () => {

    //create a listener
    const listener = new OrderCreateListener(natsWrapper.client);

    //create a ticket
    const ticket = Ticket.build({
        title: 'My ticket',
        price: 99,
        userId: 'aUserId'
    })
    await ticket.save();

    //create an order event
    const event: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: "aUserId",
        expiresAt: '',
        status: OrderStatus.Created,
        ticket: {
            id: ticket.id,
            price: ticket.price,
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
    expect(updatedTicket!.orderId).toEqual(event.id);
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
    expect(event.id).toEqual(ticketPublished.orderId)

});