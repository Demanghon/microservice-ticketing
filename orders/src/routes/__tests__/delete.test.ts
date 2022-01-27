import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus} from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it('cancel an order', async () => {
  // Create three tickets
  const ticketOne = await buildTicket();
  const user = global.signin();
  // Create one order as User #1
  const {body:orderCreated}= await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticketOne.id })
    .expect(201);
    expect(orderCreated.status).toEqual(OrderStatus.Created);
  //cancel the order
  await request(app)
    .delete(`/api/orders/${orderCreated.id}`)
    .set('Cookie', user)
    .send({ ticketId: ticketOne.id })
    .expect(204);

  // get order details
  const {body:order} = await request(app)
    .get(`/api/orders/${orderCreated.id}`)
    .set('Cookie', user)
    .expect(200);


  // Make sure we only got the orders for User #2
  expect(order.status).toEqual(OrderStatus.Cancelled);
});

it('try to cancel an non existing order', async () => {
    // get order details
    const {body:order} = await request(app)
      .delete(`/api/orders/aFakeOrderId`)
      .set('Cookie', global.signin())
      .expect(404);
  
    // Make sure we only got the orders for User #2
    expect(order.orderId).toEqual(order.id);
  });

it('try to cancel an order of another user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket();
  const userOne = global.signin();
  // Create one order as User #1
  const {body:orderCreated}= await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // get order details
  const {body:order} = await request(app)
    .delete(`/api/orders/${orderCreated.id}`)
    .set('Cookie', global.signin())
    .expect(401);
});