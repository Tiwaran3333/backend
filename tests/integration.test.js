const request = require("supertest");
const app = require("../index");


describe("Integration Test", () => {

    test("POST /users - create user", async () => {
        const res = await request(app)
            .post("/users")
            .send({
                firstname: "Mr",
                fullname: "john",
                lastname: "two",
                username: "john",
                password: "3150",
                status: "users"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
    });

    test("POST /login - login user", async () => {
        const res = await request(app)
            .post("/login")
            .send({
                username: "john",
                password: "3150",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

});
