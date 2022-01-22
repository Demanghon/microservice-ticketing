import request from 'supertest'
import {app} from '../../app'
import assert from 'assert'
import { ErrorModel } from '../../errors/serializable-error';

it('return the current user', async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
    let response = await request(app)
    .post("/api/users/signin")
    .send({
        email: "test@test.com",
        password: "password"
    })
    .expect(200);
    expect(response.get("Set-Cookie")).toBeDefined();

    response = await request(app)
    .get("/api/users/currentuser")
    .set('Cookie', response.get('Set-Cookie'))
    .send()
    .expect(200);
    expect(response.body.currentUser.email).toEqual("test@test.com")
});
