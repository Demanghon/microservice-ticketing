import request from 'supertest'
import {app} from '../../app'
import assert from 'assert'
import { ErrorModel } from '../../errors/serializable-error';

it('returns a 201 on successful signup', async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "a good password"
        });
        assert.equal(response.status, 201);
        expect(response.get("Set-Cookie")).toBeDefined();
});

it('returns a 400 on bad email', async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "badEmail",
            password: "a good password"
        });
    assert.equal(response.status, 400, "A status 400 is expected");
    const payload = response.body;
    assert.deepStrictEqual(payload, {errors: [{message:"Email must be valid", field:"email"}]})
});

it('returns a 400 on bad password', async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "goodEmail@test.com",
            password: "a"
        });
    assert.equal(response.status, 400, "A status 400 is expected");
    const payload = response.body;
    assert.deepStrictEqual(payload, {errors: [{message:"Password must be between 4 and 20 characters", field:"password"}]})
    
});

it('returns a 400 on bad password and bad email', async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "badEmail",
            password: "a"
        });
    assert.equal(response.status, 400, "A status 400 is expected");
    const payload = response.body;
    assert.deepStrictEqual(payload, {errors: [
        {message:"Email must be valid", field:"email"},
        {message:"Password must be between 4 and 20 characters", field:"password"}
    ]})
    
});

it('returns 400 on email in use', async () => {
    let response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "a good password"
        });
        assert.equal(response.status, 201);
    response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "a good password"
        });
        assert.equal(response.status, 400);
        assert.deepStrictEqual(response.body, {errors: [{message:"Email in use", field: "email"}]})
});