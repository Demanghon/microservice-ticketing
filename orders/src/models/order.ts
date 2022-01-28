import { OrderStatus } from '@ticketing/common';
import mongoose from 'mongoose';
import { TicketDoc } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export {OrderStatus};

interface OrderAttrs {
  ticket: TicketDoc;
  userId: string;
  expiresAt: Date;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  ticket: TicketDoc;
  version: number;
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

OrderSchema.plugin(updateIfCurrentPlugin);
OrderSchema.set('versionKey', 'version');

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order };
