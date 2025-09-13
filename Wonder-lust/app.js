// Workflow: This file sets up the Express server, connects to MongoDB, defines middleware, and handles routes for data CRUD operations.
// basic strucher 
const express = require('express');
const app = express();
const listing = require('./module/listing');
const paths = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

// mongoose setup
const mongoose = require('mongoose');
const mongoose_URL = "mongodb://localhost:27017/mydatabase"; // database name mydatabase

// app setup
app.set('view engine', 'ejs');
app.set('views', paths.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(paths.join(__dirname, '/public')));

// mongoose connection
async function main() {
    await mongoose.connect(mongoose_URL);
    console.log("connected to database");

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

main().catch(err => console.log(err));
// Root Route
app.get('/', (req, res) => {
    res.send("Hi i am root");
});

// Index Route
app.get('/data', async (req, res) => {
    const allListing = await listing.find({});
    res.render("data/index.ejs", { allListing });
});

// New Route
app.get('/data/new', (req, res) => {
    res.render("data/new.ejs");
});

// Show Route
app.get('/data/:id', async (req, res) => {
    let { id } = req.params;
    const foundListing = await listing.findById(id);
    res.render("data/show.ejs", { listing: foundListing });
});

// Create Route
app.post('/data', async (req, res) => {
    const newListingData = req.body.data;
    const newListing = new listing(newListingData);

    // The form sends `image` as a string (the URL). We must structure it
    // into an object to match our schema.
    newListing.image = { url: newListingData.image, filename: 'default' };

    await newListing.save();
    console.log("New Listing Added");
    res.redirect('/data');
});

// Edit Route
app.get('/data/:id/edit', async (req, res) => {
    let { id } = req.params;
    const foundListing = await listing.findById(id);
    res.render("data/edit.ejs", { listing: foundListing });
});

// Update Route
app.put('/data/:id', async (req, res) => {
    let { id } = req.params;
    const dataToUpdate = { ...req.body.data };

    // If a new image URL string was provided from the edit form,
    // format it into the object structure our schema expects.
    if (dataToUpdate.image && typeof dataToUpdate.image === 'string') {
        dataToUpdate.image = { url: dataToUpdate.image, filename: "default" };
    }

    await listing.findByIdAndUpdate(id, dataToUpdate);
    console.log("Listing Updated");
    res.redirect(`/data/${id}`);
});

// Delete Route
app.delete('/data/:id', async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    console.log("Listing Deleted");
    res.redirect('/data');
});