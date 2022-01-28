import { checkConfig, natsWrapper } from '@ticketing/common';

import { app } from './app';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { connect as connectToMongo } from './mongo/mongo-config';

const start = async () => {
  checkConfig(["MONGO_URI", "JWT_KEY", "NATS_CLUSTER_ID", "NATS_CLIENT_ID", "NATS_URI", "EXPIRATION_WINDOW_SECONDS"]);

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

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
   
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};
start();
