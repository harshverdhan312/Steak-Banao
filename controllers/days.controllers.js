const {UserModel} = require('../models/models');

const dayShow = async (req, res) => {
    const {day} = req.body;
    return res.status(200).json({day})

};


module.exports = {dayShow}
