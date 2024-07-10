const {UserModel} = require('../models/models');

async function dayShow(req, res) {
    const {day} = req.body;
    return res.status(200).json({day:"day"})
}

module.exports = {dayShow}
