require('dotenv').config();
const axios = require('axios');
//For Line Login Code
const line_login_redirect= (req, res) => {
    const channelId = process.env.channelId; 
    const clientSecret = process.env.clientSecret; 
    const redirectUri = process.env.redirectUri; 
    const authorizationCode = req.query.code;
  
    if (!authorizationCode) {
      return res.send('Authorization code is missing.');
    }
  

    const accessTokenUrl = 'https://api.line.me/oauth2/v2.1/token';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  
    const data = new URLSearchParams();
    data.append('grant_type', 'authorization_code');
    data.append('code', authorizationCode);
    data.append('redirect_uri', redirectUri);
    data.append('client_id', channelId);
    data.append('client_secret', clientSecret);
  
    axios
      .post(accessTokenUrl, data, { headers })
      .then((response) => {
        const access_token = response.data.access_token;
  
        
        const profile_url = 'https://api.line.me/v2/profile';
        const profile_headers = {
          Authorization: 'Bearer ' + access_token,
        };
  
        axios
          .get(profile_url, { headers: profile_headers })
          .then((response) => {
            const user_profile = response.data;
            const user_name = user_profile.displayName;
            const user_picture = user_profile.pictureUrl;
            const user_id = user_profile.userId;
  
        
            res.redirect(`/line/Line_Check?user_id=${user_id}&user_name=${user_name}`);
    })

          .catch((error) => {
            console.error('Failed to retrieve user data.');
            res.status(500).send('Failed to retrieve user data.');
          });
      })
      .catch((error) => {
        console.error('Failed to exchange the authorization code for an access token.');
        res.status(500).send('Failed to exchange the authorization code for an access token.');
      });
  };


  function generateRandomState(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let state = '';
  
    for (let i = 0; i < length; i++) {
      state += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return state;
  }

  const line_login_direct_outside= (req, res) => {
 
    const channelId = process.env.channelId; 
    const redirectUri = encodeURIComponent(process.env.redirectUri);
    const state = generateRandomState(10);  
  
    const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${channelId}&redirect_uri=${redirectUri}&scope=profile%20openid&state=${state}`;
  
    
    res.redirect(url);
  }



  module.exports={
    line_login_redirect,
    line_login_direct_outside,
  };