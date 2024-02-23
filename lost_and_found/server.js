const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// In-memory data store (replace this with a proper database in a production environment)
const foundItems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/foundItems', (req, res) => {
    res.json(foundItems);
});

app.post('/api/reportLostItem', (req, res) => {
    const { itemName, description } = req.body;
    foundItems.push({ itemName, description, status: 'Pending' });
    console.log(`Item '${itemName}' reported as lost. Description: ${description}`);
    res.send('Item reported as lost.');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
