const express = require('express');
const router = new express.Router();
const items = require('./fakeDb');
const ExpressError = require('./expressError');


// Routes
router.get('/', (req, res) => {
    return res.json(items);
});

router.post('/', (req, res) => {
    const added = { name: req.body.name, price: req.body.price };
    items.push(added);
    return res.status(201).json({ added });
});

router.get('/:name', (req, res) => {
    const item = items.find(i => i.name === req.params.name);
    if (item === undefined) {
        throw new ExpressError(404, 'Item was not found');
    }

    return res.json(item);
});

router.patch('/:name', (req, res) => {
    const item = items.find(i => i.name === req.params.name);
    if (item === undefined) {
        throw new ExpressError(404, 'Item was not found');
    }

    if (req.body.name) item.name = req.body.name;
    if (req.body.price) item.price = req.body.price;

    return res.json({ updated: item });
});

router.delete('/:name', (req, res) => {
    const item = items.findIndex(i => i.name === req.params.name);
    if (item === -1) {
        throw new ExpressError(404, 'Item was not found');
    }

    items.splice(item, 1);

    return res.json({ message: 'Deleted' });
});


module.exports = router;