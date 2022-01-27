import { natsWrapper, Subjects } from '@ticketing/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId });

    expect(response.status).toEqual(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id });

    expect(response.status).toEqual(409);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('publishes an event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalledWith(Subjects.OrderCreated, expect.anything(), expect.anything());
})

