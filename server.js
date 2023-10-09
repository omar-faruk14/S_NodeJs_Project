require('dotenv').config();
const express=require('express');
const mysql = require('mysql');
const path=require('path');

const db=require('./db');
const bodyParser = require('body-parser');
//For Ticket Data from models
const {
    bording_info_insert,
    bording_info_display,
}=require('./Models/ticket_data');

//for Line Data from models
const {
  line_signup,
} =require('./Models/line_data');


//import Route
const Boarding_Router=require('./routes/Bus_Ticketman_information');
const Line_Route=require('./routes/Line_Route');

const app=express();

// Serve static files from the root-level 'node_modules' folder
//app.use(express.static('node_modules'));
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))


app.use(bodyParser.urlencoded({ extended: false }));
app.listen(process.env.PORT,()=>{
    console.log("Server listen port", process.env.PORT);
});

//Route
app.use('/',Boarding_Router);
app.use('/line',Line_Route);

app.get("/driver_login", (req, res) => {
  res.render("pages/driver_login");
});



app.get("/Line_Check", (req, res) => {
  const user_id = req.query.user_id;
  const user_name = req.query.user_name;

  const checkUserExistsQuery = 'SELECT COUNT(*) AS count FROM line_basic_information WHERE User_ID = ?';
  db.query(checkUserExistsQuery, [user_id], (checkErr, checkResult) => {
    if (checkErr) {
      throw checkErr;
    }

    const userCount = checkResult[0].count;
    if (userCount > 0) {
      // User_ID already exists, render Boarding_Insert page
      res.render('pages/Boarding_Insert', { User_ID: user_id, name: user_name });
    } else {
      // User_ID doesn't exist, render index for signup
      res.render('pages/index', { id: user_id, name: user_name });
    }
  });
});


//set view engine
app.set('view engine', 'ejs');
app.set("views", "views/");