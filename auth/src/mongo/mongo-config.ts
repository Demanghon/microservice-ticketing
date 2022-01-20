import mongoose from "mongoose";
import { DatabaseConnectionError } from "../errors/database-connection-error";

export const connect = (): Promise<typeof mongoose> => {
    const url = process.env.MONGO_AUTH_URL!;

    const connectionPromise = mongoose.connect(url);

    mongoose.connection.on("error", (err) => {
        console.error("Error connecting to database", err);
        throw new DatabaseConnectionError(err.toString());
    });

    return connectionPromise;
};

export const disconnect = () => {
    if (!mongoose.connection) {
        return;
    }

    mongoose.disconnect().then(async () => {
        console.log("Diconnected  to database");
    });
};
