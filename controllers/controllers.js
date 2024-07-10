const bcrypt = require('bcryptjs');
const {UserModel} = require('../models/models');

async function createUser(req, res) {
    const { name, email, password, motive, domain, days, wantToDo } = req.body;

    try {
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            motive,
            domain,
            days,
            wantToDo
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

module.exports = {createUser}