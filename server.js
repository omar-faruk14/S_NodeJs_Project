require('dotenv').config();
const express=require('express');
const axios = require('axios');
const db=require('./db');
const bodyParser = require('body-parser');

const {
    bording_info_insert,
    bording_info_display,
}=require('./Models/ticket_data');

const Boarding_Router=require('./routes/Bus_Ticketman_information');
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



app.get('/home', (req, res) => {
    res.render('index');
  });

app.get('/redirect', (req, res) => {
    const authorizationCode = req.query.code;
  
    if (authorizationCode) {
      const clientId = '2000133795'; // Replace with your LINE Messenger channel's client ID
      const clientSecret = '8b48b99c6e4e7aa063cdeca7097c4c7d'; // Replace with your LINE Messenger channel's client secret
      const redirectUri = 'http://localhost:3001/redirect'; // Replace with your actual redirect URI
  
      // Exchange the authorization code for an access token
      axios.post('https://api.line.me/oauth2/v2.1/token', null, {
        params: {
          grant_type: 'authorization_code',
          code: authorizationCode,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(response => {
        const accessToken = response.data.access_token;
        return axios.get('https://api.line.me/v2/profile', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      })
      .then(response => {
        const user_profile = response.data;
        res.render('user-details', { user: user_profile });
      })
      .catch(error => {
        console.error('Failed to retrieve user data:', error);
        res.send('Failed to retrieve user data.');
      });
    } else {
      // You can choose to handle this case differently or redirect to the login page.
      res.send('Authorization code not found.');
    }
  });


//set view engine
app.set('view engine', 'ejs');
app.set("views", "views/");

