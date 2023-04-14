const mongoose = require('mongoose');
const user = new mongoose.Schema({
    email: String,
    password: String,
    admin: Boolean,
});

module.exports = mongoose.model("User", user);