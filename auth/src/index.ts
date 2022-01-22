import { connect } from "./mongo/mongo-config";
import {app} from "./app"
import {check as checkConfig} from "./config/config-checker"

const start = async () => {
    checkConfig();
    connect().then(() => {
        app.listen(3000, () => {
            console.log("Listening on port 3000");
        });
    });
};

start();