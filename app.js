const express = require('express');
const items = require('./fakeDb');
const ExpressError = require('./expressError');
const itemRoutes = require('./items');

const app = express();

app.use(express.json());
app.use('/items', itemRoutes);


// 404 Handler
app.use((req, res, next) => {
    throw new ExpressError(404, 'Not Found');
});

// General error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        error: err.status,
        message: err.message
    });
});

module.exports = app;