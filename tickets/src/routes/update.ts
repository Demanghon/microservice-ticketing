import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
  natsWrapper,
} from '@ticketing/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatePublisher } from '../events/publishers/ticket-updated-publisher';
import { TicketOrderedError } from '../errors/ticket-ordered-error';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    if(ticket.orderId){
      throw new TicketOrderedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    new TicketUpdatePublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
