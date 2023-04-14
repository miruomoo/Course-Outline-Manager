const mongoose = require('mongoose');

const courseOutlineSchema = new mongoose.Schema({
    courseOutlineID: String,
    courseOutlineContent: String,
    currentDateTime: String,
    userID: String,
    isApproved: Boolean,
    isSubmit: Boolean,
    class: String,
    comments: Array,
});

module.exports = mongoose.model("CourseOutlineSchema", courseOutlineSchema);