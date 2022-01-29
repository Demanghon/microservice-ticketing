import { natsWrapper, NotFoundError, OrderStatus, requireAuth, setCurrentUser, UnauthorizedError, validateRequest } from "@ticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { Order } from "../models/order";
import { Payment } from "../models/payments";
import { stripe } from "../stripe";

const router = express.Router();
const newChargeRouter = router.post("/api/payments", 
    requireAuth,
    [
        body('token')
        .not()
        .isEmpty()
        .withMessage('token is required'),
        body('orderId')
            .not()
            .isEmpty()
            .custom((input:string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('orderId is required')
    ], 
    validateRequest,
async (req: Request, res: Response) => {
    const {orderId, token} = req.body;
    const order = await Order.findById(orderId);

    if (!order){
        throw new NotFoundError()
    }
    
    //Check if this the same user that ordered
    if(order.userId !== req.currentUser!.id){
        throw new UnauthorizedError();
    }
    if(order.status === OrderStatus.Cancelled){
        throw new UnauthorizedError();
    }

    //create charges to stripe
    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
      });


    // create payment
    const payment = Payment.build({
        stripeId: charge.id,
        orderId: orderId
    })
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({orderId: payment.orderId});

    res.status(201).send({success: true});

});

export default newChargeRouter;