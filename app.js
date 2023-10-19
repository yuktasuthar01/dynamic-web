const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
require('dotenv').config();

// Connect to MongoDB (make sure your MongoDB server is running)
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Define a Mongoose schema for employees
const employeeSchema = new mongoose.Schema({
    name: String,
    position: String,
    salary: Number,
    state: String
});

// Create a Mongoose model for employees using the schema
const Employee = mongoose.model('Employee', employeeSchema);

// Middleware to parse JSON data
app.use(express.json());

// Serve HTML form at the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Display employee data
app.get('/employees', (req, res) => {
    Employee.find()
        .then((employees) => {
            res.write('<h1>Employee Information</h1>');
            res.write('<table border="1">');
            res.write('<tr><th>Name</th><th>Position</th><th>Salary</th><th>State</th></tr>');
            employees.forEach((employee) => {
                res.write(`<tr><td>${employee.name}</td><td>${employee.position}</td><td>${employee.salary}</td><td>${employee.state}</td></tr>`);
            });
            res.write('</table>');
            res.write('<a href="/">Go back</a>');
            res.end();
        })
        .catch((err) => {
            console.error(err);
            res.send('Error fetching employee data.');
        });
});

// Handle form submission and store data in MongoDB
app.post('/add', (req, res) => {
    const { name, position, salary, state } = req.body;
    const employee = new Employee({ name, position, salary, state });
    employee.save()
        .then(() => {
            // Redirect to the /employees route to display employee data
            res.redirect('/employees');
        })
        .catch(err => {
            console.error(err);
            res.send('Error saving employee data.');
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
