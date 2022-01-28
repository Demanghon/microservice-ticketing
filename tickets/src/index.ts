import { checkConfig, natsWrapper } from '@ticketing/common';

import { app } from './app';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreateListener } from './events/listeners/order-created-listener';
import { connect as connectToMongo } from './mongo/mongo-config';

const start = async () => {
  console.log("check conf");
  checkConfig(["MONGO_URI", "JWT_KEY", "NATS_CLUSTER_ID", "NATS_CLIENT_ID", "NATS_URI"]);

  try {
    await connectToMongo();
    console.log('Connected to MongoDB');
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URI!)
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreateListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
   
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};
start();
