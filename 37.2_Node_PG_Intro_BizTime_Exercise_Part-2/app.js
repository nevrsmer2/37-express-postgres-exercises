/** BizTime express application. */
require('dotenv').config()
const express = require('express');
const app = express();
const ExpressError = require('./expressError');
app.use(express.json());


/* Routes  naming conventions configuration */
const companyRoutes = require('./routes/companies');
app.use('/companies', companyRoutes);

const invoiceRoutes = require('./routes/invoices');
app.use('/invoices', invoiceRoutes);

const industryRoutes = require('./routes/industries');
app.use('/industries', industryRoutes);


/** 404 Error Handler */

app.use(function (req, res, next) {
    const err = new ExpressError('Not Found', 404);
    return next(err);
});


/** general error handler */

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        error: err,
        message: err.message
    });
});


module.exports = app;
