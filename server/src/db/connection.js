const mongoose = require('mongoose');

const connectDb = () => {
    try {
        mongoose.set('strictQuery', false);
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`DATABASE CONNECTED`);
    } catch (error) {
        console.log(error, "could not connect to database");
    }
}

module.exports = connectDb;