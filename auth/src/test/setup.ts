import {app} from '../app';
import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from "mongoose"

let mongo:MongoMemoryServer;

jest.setTimeout(20000);

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    
}

//prepare the connection to mongodb memory server
beforeAll(async () => {
    process.env.JWT_KEY = "jwtkey";

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
})

//clear data before each test
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        collection.deleteMany({});
    }
})

afterAll(async () => {
    if(mongo) await mongo.stop();
    if(mongoose.connection) await mongoose.connection.close(); 
})