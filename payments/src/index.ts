import { checkConfig , natsWrapper} from '@ticketing/common';
import { app } from './app';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { connect as connectToMongo } from './mongo/mongo-config';

const start = async () => {
  checkConfig(["NATS_CLUSTER_ID", "NATS_CLIENT_ID", "NATS_URI", "MONGO_URI", "JWT_KEY", "STRIPE_API_KEY"]);

  try {
    await connectToMongo();
    console.log('Connected to MongoDB');
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URI!
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    app.listen(3000, () => {
      console.log('Listening on port 3000!');
    });

  } catch (err) {
    console.error(err);
  }
};

start();
