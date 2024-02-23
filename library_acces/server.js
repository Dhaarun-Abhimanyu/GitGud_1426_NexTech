const express = require('express');
const app = express();
const xlsxPopulate = require('xlsx-populate');
const bodyParser = require('body-parser');
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Assuming search.html is in the public directory

// GET request handler for the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/search.html');
});

// POST request handler for reserving a book
app.post('/reserve-book', (req, res) => {
    let bookId = req.body.bookId; // Assuming the book ID is sent in the request body

    xlsxPopulate.fromFileAsync('data.xlsx')
        .then(workbook => {
            const sheet = workbook.sheet(0);
            const bookRow = sheet.findFirstRow(book => book.cell('A').value() === bookId);

            if (bookRow) {
                const countCell = bookRow.cell('D');
                let count = countCell.value();
                if (count > 0) {
                    countCell.value(count - 1);
                    if (count - 1 === 0) {
                        bookRow.cell('E').value(false); // Set availability to false
                    }
                    return workbook.toFileAsync('data.xlsx');
                }
            }
            throw new Error('Book not found or not available');
        })
        .then(() => {
            console.log('Book reserved successfully');
            res.status(200).send('Book reserved successfully'); // Send response to client confirming reservation
        })
        .catch(error => {
            console.error('Error reserving book:', error);
            res.status(400).send('Error reserving book'); // Send error response to client
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
