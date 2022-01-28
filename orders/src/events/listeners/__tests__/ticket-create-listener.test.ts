import { natsWrapper, TicketCreatedEvent } from "@ticketing/common"
import { MongoMemoryServerStates } from "mongodb-memory-server-core/lib/MongoMemoryServer";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from 'mongoose'

const setup = async () => {
    //create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    //create a fake event data
    const fakeData:TicketCreatedEvent['data'] = { 
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: "My ticket",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    //create a mock message
    //@ts-ignore
    const fakeMessage: Message = {
        ack: jest.fn()
    }

    return {ticket: fakeData, listener, message: fakeMessage}
}

it('creates and saves a ticket' , async () => {
    const {ticket, message, listener} = await setup();

    //call the onMessage listener funtion
    await listener.onMessage(ticket, message);

    //ensure the ticket is created
    const ticketFetched = await Ticket.findOne({_id: ticket.id});
    expect(ticketFetched).toBeDefined();

})

it('acks the message' , async () => {

    const {ticket, message, listener} = await setup();

    //call the onMessage listener funtion
    await listener.onMessage(ticket, message);

    //ensure the ack method is called
    expect(message.ack).toHaveBeenCalled();
})