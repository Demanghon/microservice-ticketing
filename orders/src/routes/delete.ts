import { natsWrapper, NotFoundError, OrderStatus, requireAuth, UnauthorizedError, validateRequest } from "@ticketing/common";
import express, { Request, Response } from "express";
import { OrderCancelledPublsher } from "../events/publishers/order-cancelled-publisher";
import { Order } from "../models/order";

const router = express.Router();
const deletOrderRouter = router.delete("/api/orders/:orderId", 
requireAuth, 
async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const order =  await Order.findById(orderId).populate('ticket');
    if(!order){
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id){
        throw new UnauthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublsher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    });
    
    res.status(204).send(order);
});

export default deletOrderRouter;