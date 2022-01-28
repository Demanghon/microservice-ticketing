import { natsWrapper, TicketUpdatedEvent } from "@ticketing/common"
import { MongoMemoryServerStates } from "mongodb-memory-server-core/lib/MongoMemoryServer";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import mongoose from 'mongoose'

const setup = async () => {
    //create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "My ticket",
        price: 10
    })
    await ticket.save();

    //create a fake event data
    const fakeData:TicketUpdatedEvent['data'] = { 
        id: ticket.id,
        version: ticket.version + 1,
        title: "My ticket",
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    //create a mock message
    //@ts-ignore
    const fakeMessage: Message = {
        ack: jest.fn()
    }

    return {ticket: fakeData, listener, message: fakeMessage}
}

it('update ticket with the good version' , async () => {
    const {ticket, message, listener} = await setup();

    //call the onMessage listener funtion
    await listener.onMessage(ticket, message);

    //ensure the ticket is Updated
    const ticketFetched = await Ticket.findOne({_id: ticket.id});
    expect(ticketFetched).toBeDefined();
    expect(ticketFetched!.version).toEqual(ticket.version);

})

it('update ticket with a wrong version' , async () => {
    const {ticket, message, listener} = await setup();

    ticket.version++;

    //call the onMessage listener funtion
    await expect(listener.onMessage(ticket, message)).rejects.toThrowError();

    //ensure the ticket is uppdated
    const ticketFetched = await Ticket.findOne({_id: ticket.id});
    expect(ticketFetched).toBeDefined();
    expect(ticketFetched!.version).toEqual(0);

     //ensure the ack method is not called
     expect(message.ack).not.toHaveBeenCalled();

})

it('acks the message' , async () => {

    const {ticket, message, listener} = await setup();

    //call the onMessage listener funtion
    await listener.onMessage(ticket, message);

    //ensure the ack method is called
    expect(message.ack).toHaveBeenCalled();
})