process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const db = require("../db");


/* Before/After Code for testing /companies routes*/
let testCompany;
beforeEach(async () => {
    const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ('dell', 'Dell', 'A big computer company') RETURNING code, name, description`);
    testCompany = result.rows[0];
});

afterEach(async () => {
    await db.query(`DELETE FROM companies`);
});

afterAll(async () => {
    await db.end();
});


/* Tests for Companies Routes */

describe("GET /companies Route", () => {
    test("Return all companies", async () => {
        const res = await request(app).get('/companies')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "companies": [testCompany] })
    });
});


describe("GET /companies/:code", () => {
    test("Returns all details on a single company", async () => {
        const res = await request(app).get(`/companies/${testCompany[0].code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ company: testCompany });
    });
    test("Responds with 404 if invalid company code provided", async () => {
        const res = await request(app).get(`/companies/0`);
        expect(res.statusCode).toBe(400);
    });
});

//   RESPONSE BODY; testCompany = [{"code": "dell", "description": "A big computer company", "name": "Dell"}]

describe("POST /companies", () => {
    test("Creates a new company", async () => {
        const res = await request(app).post('/companies').send({ code: 'hp', name: 'HP', description: 'Printer Company' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ code: 'hp', name: 'HP', description: 'Printer Company' }
        );
    });
});

describe("PATCH /companies/:code", () => {
    test("Updates a company based on company code", async () => {
        const res = await request(app).patch(`/companies/${testCompany.code}`).send({ code: 'hp', name: 'HnP', description: 'We love printers!' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            user: { id: testUser.id, name: 'BillyBob', type: 'admin' }
        });
    });
    test("Responds with 404 if invalid company code proivded", async () => {
        const res = await request(app).patch(`/companies/0`).send({ code: 'hp', name: 'HnP', description: 'We love printers!' });
        expect(res.statusCode).toBe(404);
    });
});

describe("DELETE /companies/:code", () => {
    test("Deletes a single company", async () => {
        const res = await request(app).delete(`/companies/${testCompany.code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: 'Deleted' });
    });
});
