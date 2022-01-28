import { checkConfig , natsWrapper} from '@ticketing/common';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
  checkConfig(["NATS_CLUSTER_ID", "NATS_CLIENT_ID", "NATS_URI", "REDIS_HOST"]);

  try {
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
  } catch (err) {
    console.error(err);
  }
};

start();
