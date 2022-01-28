import { natsWrapper, NotFoundError, OrderStatus, requireAuth, setCurrentUser, validateRequest } from "@ticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { TicketAlreadyReservedError } from "../errors/ticket-already-reserved-error";
import { OrderCreatedPublsher } from "../events/publishers/order-created-publisher";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();
const newOrderRouter = router.post("/api/orders", 
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input:string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('ticketId is required')
    ], 
    validateRequest,
async (req: Request, res: Response) => {
    const {ticketId} = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket){
        throw new NotFoundError()
    }
    
    //Check if this ticket is already ordered
    const isReserved = await ticket.isReserved();
    if(isReserved){
        throw new TicketAlreadyReservedError();
    }

    //calculate the expiration date
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    //save the order
    const order = Order.build({
        ticket: ticket,
        userId: req.currentUser!.id,
        expiresAt: expiration,
        status: OrderStatus.Created,
    })

    await order.save();

    await new OrderCreatedPublsher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    });

    res.status(201).send(order);

});

export default newOrderRouter;