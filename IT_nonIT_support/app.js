// Assuming you have an Express app
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Set EJS as the view engine
app.set('view engine', 'ejs');


const PORT = 3000;

mongoose.connect('mongodb+srv://weebybungeegon:e42t4r0HZmx53J9t@cluster0.tclywox.mongodb.net/nexTech?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const problemSchema = new mongoose.Schema({
  floor: String,
  classNumber: String,
  type: String,
  location: String,
  description: String,
  status: String
});

const Problem = mongoose.model('Problem', problemSchema,'problems');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


// Fetch available floor numbers
app.get('/floors', async (req, res) => {
  try {
    const floors = await Problem.distinct('floor');
    res.json({ floors });
  } catch (error) {
    console.error('Error fetching floors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Owner page route
app.get('/owner', async (req, res) => {
  // Fetch all problems from the database
  const problems = await Problem.find();

  res.render('owner', { problems });
});
// Handle POST requests to /report
app.post('/report', async (req, res) => {
  const { floor, classNumber, problem, type, location, description } = req.body;

  // Check if a document with the same classNumber already exists
  const existingProblem = await Problem.findOne({ classNumber });

  if (existingProblem) {
      // Update the existing document
      await Problem.updateOne({ classNumber }, {
          floor,
          classNumber,
          problem,
          type,
          location,
          description,
          status: 'Pending' // Default status when a new problem is reported
      });

      // Redirect or send a response as needed
      res.redirect('/'); // Redirect to the home page or another appropriate page
  } else {
      // Create a new problem instance if the document doesn't exist
      const newProblem = new Problem({
          floor,
          classNumber,
          problem,
          type,
          location,
          description,
          status: 'Pending' // Default status when a new problem is reported
      });

      // Save the new problem to the database
      await newProblem.save();

      // Redirect or send a response as needed
      res.redirect('/'); // Redirect to the home page or another appropriate page
  }
});

// Update status route
app.post('/update-status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status === 'Solved') {
      // If the status is updated to 'Solved', reset relevant fields to empty values
      await Problem.findByIdAndUpdate(id, {
          status : '',
          type: '',
          location: '',
          description: ''
      });
  } else {
      // If the status is not 'Solved', just update the status
      await Problem.findByIdAndUpdate(id, { status });
  }

  res.redirect('/owner');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
