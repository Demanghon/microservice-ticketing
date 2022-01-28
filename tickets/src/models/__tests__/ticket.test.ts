import { Ticket } from "../ticket"

it('implement optimistic concurrency control', async () => {
    const ticket = Ticket.build({
        title: "My ticket",
        price: 5,
        userId: "aUserId"
    })
    await ticket.save();

    const firstIntance = await Ticket.findById(ticket.id);
    const secondIntance = await Ticket.findById(ticket.id);

    firstIntance!.set({price: 10});
    secondIntance!.set({price: 15});

    await firstIntance!.save();

    //have to throw an error
    let occImplemented = false;
    try{
        await secondIntance!.save();
    }catch(err){
        occImplemented = true;
    }

    expect(occImplemented).toBeTruthy();
})

it("increment ht version number on mutiple saves", async () => {
    const ticket = Ticket.build({
        title: "My ticket",
        price: 5,
        userId: "aUserId"
    })
    await ticket.save();

    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
});