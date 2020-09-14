const path = require('path');
const axios = require('axios').default;
const protocol = 'https';
const urlBase = 'api.covid19api.com';
const urlEtc = 'world/total';
const url = `${protocol}://${path.join(urlBase, urlEtc)}`;
axios.get(url)
.then(
    response => {
        console.log(response.data);
    },
    error => {
        console.log(error.message);
    }
);
