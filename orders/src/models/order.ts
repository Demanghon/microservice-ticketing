import { OrderStatus } from '@ticketing/common';
import mongoose from 'mongoose';
import { TicketDoc } from './ticket';

export {OrderStatus};

interface OrderAttrs {
  ticket: TicketDoc;
  userId: string;
  expiresAt: Date;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  ticket: TicketDoc;
  userId: string;
  expiresAt: Date;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order };
