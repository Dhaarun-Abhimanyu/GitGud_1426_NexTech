const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 4000;

// In-memory data store for found items
const foundItems = [];

// Middleware to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to get all found items
app.get('/api/foundItems', (req, res) => {
    res.json(foundItems);
});

// Route to report a lost item
app.post('/api/reportLostItem', (req, res) => {
    const { itemName, description } = req.body;
    foundItems.push({ itemName, description, status: 'Pending' });
    console.log(`Item '${itemName}' reported as lost. Description: ${description}`);
    res.send('Item reported as lost.');
});

// Route handler for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lost and found.html')); // Send the HTML file
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
