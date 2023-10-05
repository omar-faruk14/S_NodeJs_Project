const axios = require('axios');
const line_login_redirect= (req, res) => {
    const channelId = '2000133795'; // Replace with your actual channel ID
    const clientSecret = '8b48b99c6e4e7aa063cdeca7097c4c7d'; // Replace with your actual channel secret
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
            res.render('pages/index', {
              name: user_name,
              picture: user_picture,
              id: user_id,
            });
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

  module.exports={
    line_login_redirect,
  };