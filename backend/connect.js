const {MongoClient} = require('mongodb');
const url= "mongodb+srv://3350Project:ECOM@cluster0.qenppbs.mongodb.net";
const databaseName = "3350Database";
const client = new MongoClient(url);

async function connectCourseOutlines() {
    let result = await client.connect();
    db = result.db(databaseName);
    return db.collection("CourseOutlineSchema");
}

async function connectUsers(){
    let result = await client.connect();
    db= result.db(databaseName);
    return db.collection("users");
}

async function connectGradAtt(){
    let result = await client.connect();
    db = result.db(databaseName);
    return db.collection("GradAtt")
}

exports.connectCourseOutlines = connectCourseOutlines;
exports.connectUsers = connectUsers;
exports.connectGradAtt = connectGradAtt;