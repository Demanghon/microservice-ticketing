import request from 'supertest'
import {app} from '../../app'
import assert from 'assert'

it('returns a 401 on wrong email', async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(401);
});

it('returns a 401 on wrong passsword', async () => {
    let response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
    response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "anotherPassword"
        })
        .expect(401);
});

it('returns a 201 on successful signin', async () => {
    let response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
    response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(200);
        expect(response.get("Set-Cookie")).toBeDefined();;
});

it('returns a 400 on bad email', async () => {
    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "badEmail",
            password: "a good password"
        });
    assert.equal(response.status, 400, "A status 400 is expected");
    const payload = response.body;
    assert.deepStrictEqual(payload, {errors: [{message:"Email must be valid", field:"email"}]})
    
});

it('returns a 400 on password doesn\'t supplied', async () => {
    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "goodEmail@test.com",
        });
    assert.equal(response.status, 400, "A status 400 is expected");
    const payload = response.body;
    assert.deepStrictEqual(payload, {errors: [{message:"Password must be supply", field:"password"}]})
    
});

it('returns a 400 on without password and bad email', async () => {
    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "badEmail",
        });
    assert.equal(response.status, 400, "A status 400 is expected");
    const payload = response.body;
    assert.deepStrictEqual(payload, {errors: [
        {message:"Email must be valid", field:"email"},
        {message:"Password must be supply", field:"password"}
    ]})
    
});