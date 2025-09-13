const mongoose = require('mongoose');
const initdata = require('./data.js');
const listing = require('../module/listing.js');

const mongoose_URL = "mongodb://localhost:27017/mydatabase"; // database name mydatabase

async function main() {
    await mongoose.connect(mongoose_URL);
    console.log("connected to database");
    await initDB();
    mongoose.connection.close(); // Optional: close connection after initializing
}

const initDB = async () => {
    await listing.deleteMany({}); // Clear existing data
    await listing.insertMany(initdata.data);
    console.log("Database initialized with sample data");
}

main().catch(err => { console.log(err) });