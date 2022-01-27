import { Publisher, Subjects, OrderCreatedEvent} from "@ticketing/common";

export class OrderCreatedPublsher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}