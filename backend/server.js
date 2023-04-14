const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;
const cookieParser = require('cookie-parser');
const {body, validationResults} = require('express-validator');
const CourseOutline = require("./models/courseOutline.js");
const User = require("./models/user");
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const passport = require('passport');
const bcryptjs = require('bcryptjs');

//MONGODB ----------------------------------------------------------------------------
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://3350Project:ECOM@cluster0.qenppbs.mongodb.net/3350Database");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
//------------------------------------------------------------------------------------

//MIDDLEWEAR -------------------------------------------------------------------------

// Setup serving front-end code
app.use('/', express.static('static'));

// Setup middlewear to do the login
app.use((req, res, next) => { // for all routes
  console.log(`${req.method} request for ${req.url}`);
  next();
});


app.use(cors({
  origin: `http://localhost:3000`,
  credentials: true,
}));

// Parse data in body as JSON
router.use(express.json());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const coll = require('./connect');
const { updateOne } = require('./models/courseOutline.js');


// Install the router at /api/parts
app.use('/api/data', router);

//Passport
app.use(session({
  secret: "secretcode",
  resave: true,
  saveUninitialized: true,
}));

app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport)



app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});

//END OF MIDDLEWEAR -------------------------------------------------------

//LOGIN FUCNTIONS -------------------------------------------------------
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err,user,info) => {
      if (err) throw err;
      console.log(user);
      console.log(user.email);
      if(!user) res.send("No User Exists");
      else {
              req.login(user, err => {
                  if (err) throw err;
                  res.send("Successfully Authenticated");
                  console.log(req.user);
              });
      };
  })(req,res,next);
});

app.post("/register", (req, res) => {
  User.findOne({email: req.body.email}, async(err,doc) => {
      const doesUserExist = await User.exists({email: req.body.email});
      if (err) throw err;
      if (doesUserExist) res.send("Email already exists");
      if (!doc) {
          const hashedPassword = await bcryptjs.hash(req.body.password, 10);
          const newUser = new User({
              email: req.body.email,
              password: hashedPassword,
              admin: false
          });
          await newUser.save();
          res.send("User Created");
      };
  });
});

app.post("/logout", function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.send("Logout Successful");
  });
});

app.get("/user", (req, res) => {
  console.log("GET request made for user");
  res.send(req.user);
});


// Grabs a list of all the genres
app.get("/users", async (req, res) => {

  // Data found is a cursor object and must be turned into an array
  let data = await coll.connectUsers();
  data = await data.find().toArray();
  res.send(data);
});


//Changes user's admin status
app.put("/users/:email/admin", async (req, res) => {

  let email = req.params.email;
  let change = req.body;
  const data = await coll.connectUsers();

  let result = data.updateOne(
      { email: email },
      { $set: {"admin" : change.admin}}
  )
  res.send(`Updated! ${result}`);
});

//------------------------------------------------------------------------------------

app.get("/courseOutline/:no", async (req, res) => {

  // Connecting 
  let id = req.params.no;
  let data = await coll.connectCourseOutlines();

  // Data found is a cursor object and must be turned into an array
  data = await data.find(
      { courseOutlineID: id} ).toArray();

  if (data) {
      res.send(data);
  }
  else {
      res.status(404).send("No matches were found!");
  }
});

app.get("/isApproved", async (req, res) => {

  // Connecting 
  let data = await coll.connectCourseOutlines();

  // Data found is a cursor object and must be turned into an array
  data = await data.find(
      { isApproved: true} ).toArray();

  if (data) {
      res.send(data);
  }
  else {
      res.status(404).send("No matches were found!");
  }
});

app.get("/isSubmitTrue", async (req, res) => {

  // Connecting 
  let data = await coll.connectCourseOutlines();

  // Data found is a cursor object and must be turned into an array
  data = await data.find({isSubmit: true, isApproved: false}).toArray();

  if (data) {
      res.send(data);
  }
  else {
      res.status(404).send("No matches were found!");
  }
});

app.get("/users/prof", async (req, res) => {
  let data = await coll.connectUsers();
  data = await data.find(
    {admin: false}
  ).toArray();
  res.send(data);
});

app.get("/isUser/:id_user", async (req, res) => {

  // Connecting 
  let id = req.params.id_user;
  let data = await coll.connectCourseOutlines();

  // Data found is a cursor object and must be turned into an array
  data = await data.find(
    {
      userID: id,
      isApproved: false
    }).toArray();

  if (data) {
    res.send(data);
  }
  else {
    res.status(404).send("No matches were found!");
  }
});


app.post("/newCourseOutline/new", async (req, res) => {

  // Connecting to the playlist
  let id = req.body.courseOutlineID;
  let id_body = req.body.courseOutlineContent;
  let id_user = req.body.userID;
  let id_approved = req.body.isApproved;
  let data = await coll.connectCourseOutlines();
  let time = req.body.currentDateTime;
  let course = req.body.class;

  console.log(id);
  console.log(id_body);

  // Data found is a cursor object and must be turned into an array
  data = await data.insertOne(

      {
      courseOutlineID: id,
      courseOutlineContent: id_body,
      currentDateTime: time,
      userID: id_user,
      isApproved: id_approved,
      class: course,
      });

  res.send("Created Course Outline!")
});

app.post("/newCourseOutline/ga", async (req, res) => {

  // Connecting to the playlist
  let ga_id = req.body.id;
  let ga_lo = req.body.lo;
  let ga_ass = req.body.ass;
  let courseID = req.body.courseID;
  let data = await coll.connectGradAtt();

  // Data found is a cursor object and must be turned into an array
  data = await data.insertOne(
      {
      id: ga_id,
      lo: ga_lo,
      ass: ga_ass,
      cid: courseID,
      });

  res.send("Spawned Graduate Attribute")
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err,user,info) => {
      if (err) throw err;
      console.log(user);
      console.log(user.email);
      if(!user) res.send("No User Exists");
      else {
              req.login(user, err => {
                  if (err) throw err;
                  res.send("Successfully Authenticated");
                  console.log(req.user);
              });
      };
  })(req,res,next);
});

app.post("/register", (req, res) => {
  User.findOne({email: req.body.email}, async(err,doc) => {
      const doesUserExist = await User.exists({email: req.body.email});
      if (err) throw err;
      if (doesUserExist) res.send("Email already exists");
      if (!doc) {
          const hashedPassword = await bcryptjs.hash(req.body.password, 10);
          const newUser = new User({
              email: req.body.email,
              password: hashedPassword,
              admin: false
          });
          await newUser.save();
          res.send("User Created");
      };
  });
});

app.post("/logout", function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.send("Logout Successful");
  });
});

app.get("/user", (req, res) => {
  console.log("GET request made for user");
  res.send(req.user);
});


// Grabs a list of all the genres
app.get("/users", async (req, res) => {

  // Data found is a cursor object and must be turned into an array
  let data = await coll.connectUsers();
  data = await data.find().toArray();
  res.send(data);
});


//Changes user's admin status
app.put("/users/:email/:course", async (req, res) => {

  let prof = req.params.email;
  let course = req.params.course;
  const data = await coll.connectUsers();

  let result = data.updateOne(
      { email: prof },
      { $push: {"courseName" : course}}
  )
  res.send(`Updated! ${result}`);
});

//retrieves all unapproved outlines
app.get("/outlines", async(req, res) => {

  let approval = req.params.isApproved;
  let data = await coll.connectCourseOutlines();
  if(!approval)
  {
    data = await data.find().toArray();
  }
  
  res.send(data);
});

//change a course outline approval status
app.put("/outlines/:id/approve", async (req, res) => {

  let courseId = req.params.id;
  let change = req.body;
  const data = await coll.connectCourseOutlines();

  let result = data.updateOne(
    { courseOutlineID : courseId},
    { $set: {"isApproved" : change.isApproved, "currentDateTime": change.currentDateTime}}
  )
  res.send(`Updated ${result}, course outline name: ${courseId}`);

});

app.put("/outlines/:id/submit", async (req, res) => {

  let courseId = req.params.id;
  let change = req.body;
  const data = await coll.connectCourseOutlines();

  let result = data.updateOne(
    { courseOutlineID : courseId},
    { $set: {"isSubmit" : change.isSubmit}}
  )
  res.send(`Updated ${result}, course outline name: ${courseId}`);

});

//update saved course outline
app.put("/outlines/:id/update", async (req, res) => {

  let courseId = req.params.id;
  let change = req.body;
  const data = await coll.connectCourseOutlines();

  console.log(change.currentDateTime);

  let result = data.updateOne(
    { courseOutlineID : courseId},
    { $set: {"courseOutlineContent" : change.courseOutlineContent,"currentDateTime": change.currentDateTime,}}
  )
  res.send(`Updated ${result}`);

});

app.put("/gradAtt/:id/:lo/:outlineClass/update", async (req,res) => {

  let courseID = req.params.outlineClass
  let gradAtt = req.params.id;
  let learnObj = req.params.lo;
  const data = await coll.connectGradAtt();

  let result=data.updateOne(
    {id: gradAtt, cid: courseID},
    {$set: {"lo":learnObj}}
  )
  res.send(`Updated Graduate Attribute ${result}`);
})

//Grading Assessment
app.put("/gradAtt/:id/:outlineClass/updateGA", async (req, res) => {

  let courseID = req.params.outlineClass
  let gradAtt = req.params.id;
  let change = req.body.ass;
  const data = await coll.connectGradAtt();

  let result = data.updateOne(
    { id : gradAtt, cid : courseID},
    { $set: {"ass" : change}}
  )
  res.send(`Updated ${result}`);

});

app.get("/gradAtt/:id/:outlineClass", async (req, res) => {

  let data = await coll.connectGradAtt();
  let gradAtt = req.params.id;
  let outlineClass = req.params.outlineClass;

  data = await data.find(
      {id: gradAtt, cid: outlineClass}).toArray()

  if (data) {
      res.send(data);
  }
  else {
      res.status(404).send("No matches were found!");
  }
});

//change a course outline approval status
app.put("/outlines/:id/comment", async (req, res) => {

  let courseId = req.params.id;
  let change = req.body;
  const data = await coll.connectCourseOutlines();

  let result = data.updateOne(
    { courseOutlineID : courseId},
    { $push: {"comments" : change.comments}}
  )
  res.send(`Commented ${result}, course outline name: ${courseId}`);

});