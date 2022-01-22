import request from 'supertest'
import {app} from '../../app'

it('returns a 200 on successful signout', async () => {
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
    .post("/api/users/signout")
    .set('Cookie', response.get('Set-Cookie'))
    .send()
    .expect(200);
    expect(response.get("Set-Cookie")[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
});
