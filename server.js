require('dotenv').config();
const express=require('express');
const mysql = require('mysql');

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


app.use(bodyParser.urlencoded({ extended: false }));
app.listen(process.env.PORT,()=>{
    console.log("Server listen port", process.env.PORT);
});

//Route
app.use('/',Boarding_Router);
app.use('/line',Line_Route);




//*****************************Line path For line */
// app.get('/line', (req, res) => {
//   res.render('pages/line_test');
// });

// app.get('/line3', (req, res) => {
//   res.render('pages/login_with_line');
// });


// Define a route to handle LINE Messenger login
// app.get('/line2',line_login_redirect );

// app.get("/line_home", (req, res) => {
//   res.render("pages/index")
// });

// app.post('/signup', line_signup);

//set view engine
app.set('view engine', 'ejs');
app.set("views", "views/");