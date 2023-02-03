const express = require('express');
const ExpressError = require('../expressError')
const router = express.Router();
const db = require('../db');



//Return Details for all Invoices
router.get('/', async (request, response, next) => {
    try {
        const results = await db.query(
            `SELECT *FROM invoices`);
        return response.json({ invoices: results.rows });
    } catch (err) {
        return next(err);
    };
});


//Return details on one invoice

router.get('/:id', async (request, response, next) => {
    try {
        const { id } = request.params;
        const results = await db.query(
            `SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices WHERE id=$1`, [id]);
        if (results.rows.length === 0) {
            let error = new Error(`Company id  '${id}' does not exist`);
            error.status = 400;
            return next(error);
        };
        return response.json({ invoice: results.rows[0] });
    } catch (error) {
        return next(error);
    };
});


/* Add an invoice to the invoices table */

router.post('/', async (request, response, next) => {
    try {
        const { comp_code, amt } = request.body;
        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt) 
            VALUES($1, $2) 
            RETURNING  id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]);
        return response.status(201).json(result.rows[0]);
    } catch (error) {
        return next(error);
    };
});


/* Update an invoicde on invoices table */

router.put('/:id', async (request, response, next) => {
    try {
        const { id } = request.params;
        const { amt } = request.body;
        const results = await db.query(`UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt,]);
        return response.json(results.rows[0]);
    } catch (error) {
        return next(error);
    };
});


/* Delete a Company */

router.delete('/:id', async (request, response, next) => {
    try {
        const { id } = request.params;
        const result = await db.query(`DELETE FROM invoices WHERE id=$1`, [id]);
        return response.json({ status: 'Deleted' });
    } catch (error) {
        return next(error);
    };
});













/* Export Router */
module.exports = router;



