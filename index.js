const path = require('path');
const axios = require('axios').default;
const protocol = 'https';
const urlBase = 'rally1.rallydev.com/slm/webservice/v2.0';
const urlObj = 'user';
const urlID = '123';
const url = `${protocol}://${path.join(urlBase, urlObj, urlID)}`;
axios.get(url)
.then(
    response => {
        console.log(response.data);
    },
    error => {
        console.log(error.message);
    }
);