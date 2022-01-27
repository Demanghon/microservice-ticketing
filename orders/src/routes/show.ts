import { NotFoundError, requireAuth, UnauthorizedError, validateRequest } from "@ticketing/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();
const showOrderRouter = router.get("/api/orders/:orderId", 
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
    res.send(order);
});

export default showOrderRouter;