const axios = require('axios').default;
const urlBase = 'https://api.covid19api.com';
const urlEtc = 'world/total';
axios.get(`${urlBase}/${urlEtc}`)
.then(response => {
    console.log(response.data);
});
