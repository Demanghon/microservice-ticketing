import { OrderCancelledEvent, Publisher, Subjects } from "@ticketing/common";

export class OrderCancelledPublsher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}