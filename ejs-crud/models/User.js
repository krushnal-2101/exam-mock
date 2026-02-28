const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    image: String,
    status: {
        type: Boolean,
        default: true
    },
    created_date: String,
    updated_date: String
});

module.exports = mongoose.model('User', userSchema);