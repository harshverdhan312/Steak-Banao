const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
