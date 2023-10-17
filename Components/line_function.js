const axios = require('axios');


//For Line Login Code
const line_login_redirect= (req, res) => {
    const channelId = '2001194332'; // Replace with your actual channel ID
    const clientSecret = 'bfe3364dc425e55a38a6c39c1490c90b'; // Replace with your actual channel secret
    const redirectUri = 'http://localhost:3001/line/line2'; // Replace with your actual redirect URI
    const authorizationCode = req.query.code;
  
    if (!authorizationCode) {
      return res.send('Authorization code is missing.');
    }
  
    // Exchange the authorization code for an access token
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
  
        // Make an API call to get the user's profile using the access token
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
  
            // Render the EJS view with user details
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
    // Generate the LINE login URL and redirect the user to it
    const channelId = '2001194332';  // Replace with your LINE channel ID
    const redirectUri = encodeURIComponent('http://localhost:3001/line/line2');
    const state = generateRandomState(10);  // You need to implement this function
  
    const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${channelId}&redirect_uri=${redirectUri}&scope=profile%20openid&state=${state}`;
  
    // Redirect the user to the LINE authorization URL
    res.redirect(url);
  }



  module.exports={
    line_login_redirect,
    line_login_direct_outside,
  };