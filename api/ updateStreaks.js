const mongoose = require('mongoose');
const { UserModel } = require('../../models/models');
require('dotenv').config();

module.exports = async (req, res) => {
    try {
        // Ensure you only connect once
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        const users = await UserModel.find();
        const currentDate = new Date();

        for (const user of users) {
            const registrationDate = new Date(user.registrationDate);
            const timeDiff = currentDate - registrationDate;
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            // Update streak counter
            await UserModel.updateOne({ _id: user._id }, { streakCounter: daysDiff });
        }

        res.status(200).json({ message: 'Streak counters updated.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        mongoose.connection.close(); // Close the connection after operations
    }
};
