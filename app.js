const express = require('express');
const app = express();

app.use(express.json());

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        user : 'root',
        password : 'nimda',
        database : 'db'
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/veiculos', (req, res) => {
    knex("veiculos").then((data) => {
        res.send(data);
    }, (err) => {
        throw err;
    });
});

app.get('/api/veiculos/:id', (req, res) => {

    const { id } = req.params;

    knex("veiculos")
        .where('id', id)
        .then((data) => {
            if(!data || data.length == 0) {
                return res.status(404).send('Veículo não encontrado');
            }
            res.send(data);
        }, (err) => {
            throw err;
        });
});

app.post('/api/veiculos', (req, res) => {
    knex("veiculos")
        .insert(req.body)
        .then((data) => {
            res.send(req.body);
        }, (err) => {
            throw err;
        });
});

app.put('/api/veiculos/:id', (req, res) => {

    const { id } = req.params;

    knex("veiculos")
        .where('id', id)
        .update(req.body)
        .then((data) => {
            if(!data) {
                return res.status(404).send('Vaículo não encontrado');
            }
            res.send(req.body);
        }, (err) => {
            throw err;
        });
});

app.delete('/api/veiculos/:id', (req, res) => {

    const { id } = req.params;

    knex("veiculos")
        .where('id', id)
        .delete(req.body)
        .then((data) => {
            if(!data) {
                return res.status(404).send('Vaículo não encontrado');
            }
            res.send(req.body);
        }, (err) => {
            throw err;
        });
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})
