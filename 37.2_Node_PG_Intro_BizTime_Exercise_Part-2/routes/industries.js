const express = require('express');
const ExpressError = require('../expressError')
const router = express.Router();
const db = require('../db');


//Return Details for all industries
router.get('/', async (request, response, next) => {
    try {
        const results = await db.query(
            `SELECT id, ind_code, ind_name FROM industries`);
        return response.json({ industries: results.rows });
    } catch (err) {
        return next(err);
    }
});


//Return details on one industruy

router.get('/:id', async (request, response, next) => {
    try {
        const { id } = request.params;
        const results = await db.query(
            `SELECT id, ind_code, ind_name FROM industries WHERE id=$1`, [id]);
        if (results.rows.length === 0) {
            let error = new Error(`Industries ID '${id}' does not exist`);
            error.status = 400;
            return next(error);
        };
        return response.json({ industry: results.rows[0] });
    } catch (error) {
        return next(error);
    };
});


/* Add an Industry to Tables industries */

router.post('/', async (request, response, next) => {
    try {
        const { ind_code, ind_name } = request.body;
        const result = await db.query(
            `INSERT INTO industries (ind_code, ind_name) 
            VALUES($1, $2) 
            RETURNING  ind_code, ind_name`,
            [ind_code, ind_name]);
        return response.status(201).json(result.rows[0]);
    } catch (error) {
        return next(error);
    };
});


// /* Update an Industry on Table industries */

router.put('/:id', async (request, response, next) => {
    try {
        const { id } = request.params;
        const { ind_code, ind_name } = request.body;
        const results = await db.query(`UPDATE industries SET ind_code=$1, ind_name=$2 WHERE id=$3 RETURNING id, ind_code, ind_name`, [ind_code, ind_name, id]);
        return response.json(results.rows[0]);
    } catch (error) {
        return next(error);
    };
});


// /* Delete an Industry on Table industries */

router.delete('/:id', async (request, response, next) => {
    try {
        const { id } = request.params;
        const result = await db.query(`DELETE FROM industries WHERE id=$1`, [id]);
        return response.json({ message: 'Industry Deleted' });
    } catch (error) {
        return next(error);
    };
});













/* Export Router */
module.exports = router;



