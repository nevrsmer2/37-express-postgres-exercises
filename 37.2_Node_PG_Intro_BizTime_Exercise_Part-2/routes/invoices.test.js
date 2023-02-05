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


/* Items to Populate Table Invoices in test DB */

let testInvoice;
beforeEach(async () => {
    const result = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ('dell', 500) RETURNING  add_date, amt, comp_code, id, paid, paid_date`);
    testInvoice = result.rows[0];
});


afterEach(async () => {
    await db.query(`DELETE FROM invoices`);
});

afterAll(async () => {
    await db.end();
});


/* Tests for Invoies Routes */

describe("GET /invoices Route", () => {
    test("Return all invoices", async () => {
        const res = await request(app).get('/invoices')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            invoices: [
                {
                    id: testInvoice.id,
                    comp_code: 'dell',
                    amt: 500,
                    paid: false,
                    add_date: '2023-02-05T05:00:00.000Z',
                    paid_date: null
                }
            ]
        }
        )
    });
});


describe("GET /invoices/:id", () => {
    test("Returns all details on a single invoide", async () => {
        const res = await request(app).get(`/invoices/${testInvoice.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            invoice: {
                id: Number(`${testInvoice.id}`),
                comp_code: 'dell',
                amt: 500,
                paid: false,
                add_date: '2023-02-05T05:00:00.000Z',
                paid_date: null
            }
        });
    });
    test("Responds with 404 if invalid invoide id provided", async () => {
        const res = await request(app).get(`/invoice/0`);
        expect(res.statusCode).toBe(404);
    });
});


describe("POST /invoices", () => {
    test("Creates a new invoice", async () => {
        const res = await request(app).post('/invoices').send({ comp_code: 'dell', amt: 500 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            add_date: "2023-02-04T05:00:00.000Z",
            amt: 500,
            comp_code: "dell",
            id: +`${testInvoice.id + 1}`,
            paid: false,
            paid_date: null
        }
        );
    });
});


describe("PATCH /invoices/:id", () => {
    test("Updates an invoice based on invoice id ", async () => {
        const res = await request(app).patch(`/invoices/${testInvoice.id}`).send({ comp_code: 'dello', amt: 100 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            invoice: { testInvoice }
        });
    });
    test("Responds with 404 if invalid invoice code ", async () => {
        const res = await request(app).patch(`/invoices/${testInvoice.id}`).send({ comp_code: 'dello', amt: 100 });
        expect(res.statusCode).toBe(404);
    });
});


describe("DELETE /invoices/:id", () => {
    test("Deletes a single invoice", async () => {
        const res = await request(app).delete(`/invoices/${testInvoice.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: 'Deleted' });
    });
});
