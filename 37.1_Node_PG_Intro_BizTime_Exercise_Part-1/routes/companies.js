const express = require('express');
const ExpressError = require('../expressError')
const router = express.Router();
const db = require('../db');


//Return Details for all Companies
router.get('/', async (request, response, next) => {
    try {
        const results = await db.query(
            `SELECT code, name, description FROM companies`);
        return response.json({ companies: results.rows });
    } catch (err) {
        return next(err);
    }
});


//Return details on one company

// router.get('/:code', async (request, response, next) => {
//     try {
//         const { code } = request.params;
//         const results = await db.query(
//             `SELECT code, name, description FROM companies WHERE code=$1`, [code]);
//         if (results.rows.length === 0) {
//             let error = new Error(`Company code '${code}' does not exist`);
//             error.status = 400;
//             return next(error);
//         };
//         return response.json({ company: results.rows[0] });
//     } catch (error) {
//         return next(error);
//     };
// });


router.get('/:code', async (request, response, next) => {
    try {
        const { code } = request.params;
        const results = await db.query(

            // SELECT * FROM companies JOIN invoices ON invoices.comp_code = companies.code WHERE companies.code='apple'

            `SELECT * FROM companies JOIN invoices ON invoices.comp_code = companies.code WHERE code=1$`, [code]);

        if (results.rows.length === 0) {
            let error = new Error(`Company code '${code}' does not exist`);
            error.status = 400;
            return next(error);
        };
        return response.json({ company: results.rows[0] });
    } catch (error) {
        return next(error);
    };
});


/* Add Company to DB */

router.post('/', async (request, response, next) => {
    try {
        const { code, name, description } = request.body;
        const result = await db.query(
            `INSERT INTO companies(code, name, description) 
            VALUES($1, $2, $3) 
            RETURNING  code, name, description`,
            [code, name, description]);
        return response.status(201).json(result.rows[0]);
    } catch (error) {
        return next(error);
    };
});


/* Update a Company on DB */

router.put('/:code', async (request, response, next) => {
    try {
        const { code } = request.params;
        const { name, description } = request.body;
        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [name, description,]);
        return response.json(results.rows[0]);
    } catch (error) {
        return next(error);
    };
});


/* Delete a Company */

router.delete('/:code', async (request, response, next) => {
    try {
        const { code } = request.params;
        const result = await db.query(`DELETE FROM companies WHERE code=$1`, [code]);
        return response.json({ status: 'Deleted' });
    } catch (error) {
        return next(error);
    };
});













/* Export Router */
module.exports = router;



