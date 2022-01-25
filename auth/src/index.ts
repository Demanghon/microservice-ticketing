import { connect } from "./mongo/mongo-config";
import {app} from "./app"
import {checkConfig} from "@ticketing/common"

const start = async () => {
    checkConfig(["MONGO_AUTH_URL", "JWT_KEY"]);
    connect().then(() => {
        app.listen(3000, () => {
            console.log("Listening on port 3000");
        });
    });
};

start();