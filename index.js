const https = require('https');
require('dotenv').config();
const myUserName = process.env.RALLY_USERNAME;
const myPassword = process.env.RALLY_PASSWORD;
const urlStart = 'https://rally1.rallydev.com';
// Function to return my ref.
const getMe = () => {
  return https.get(
    urlStart,
    {
      auth: `${myUserName}:${myPassword}`,
      path: `/slm/webservice/v2.0//user?query=(UserName%20=%20${myUserName})&fetch%20=%20_res,Name`
    },
    res => {
      res.on('data', chunk => {
        console.log(`Body: ${chunk}`);
      });
      res.on('end', () => {
        console.log('Response ended');
      });
      console.log(`Status code: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
    }
  );
};
getMe();
