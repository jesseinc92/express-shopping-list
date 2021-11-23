process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./app');
const items = require('./fakeDb');

let testItems = [
    { name: 'test1', price: 1.50 },
    { name: 'test2', price: 2 },
    { name: 'test3', price: 15.25 }
]


beforeEach(() => {
    for (let item of testItems) {
        items.push(item);
    }
});

afterEach(() => {
    items.length = 0;
});


describe('GET /items', () => {
    test('Gets list of all items', async () => {
        const resp = await request(app).get('/items');
        
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual(testItems);
    });
});

describe('POST /items', () => {
    test('Creates new item', async () => {
        const resp = await request(app)
            .post('/items')
            .send({ name: 'test4', price: 10 });

        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({ added: { name: 'test4', price: 10 } });
    });
});

describe('GET /items/:name', () => {
    test('Gets a single item based on its name', async () => {
        const resp = await request(app).get('/items/test1');

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({ name: 'test1', price: 1.50 });
    });

    test('Attempts to get a non-existent item', async () => {
        const resp = await request(app).get('/items/test');

        expect(resp.statusCode).toEqual(404);
        expect(resp.body).toEqual({ error: 404, message: 'Item was not found' });
    });
});

describe('PATCH /items/:name', () => {
    test('Updates an item\'s name', async () => {
        const resp = await request(app)
            .patch('/items/test2')
            .send({ name: 'testMe' });

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({ updated: { name: 'testMe', price: 2 }})
    });

    test('Attempts to update a non-existent item', async () => {
        const resp = await request(app)
            .patch('/items/test')
            .send({ name: 'testMe' });

        expect(resp.statusCode).toEqual(404);
        expect(resp.body).toEqual({ error: 404, message: 'Item was not found' });
    });
});

describe('DELETE /items/:name', () => {
    test('Deletes an item', async () => {
        const resp = await request(app).delete('/items/test3');

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({ message: 'Deleted' });
    });

    test('Attempt to delete a non-existent item', async () => {
        const resp = await request(app).delete('/items/test');

        expect(resp.statusCode).toEqual(404);
        expect(resp.body).toEqual({ error: 404, message: 'Item was not found' });
    });
});