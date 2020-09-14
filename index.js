const axios = require('axios').default;
const urlBase = 'https://covid19api.com';
const urlEtc = 'world/total';
axios.get(`${urlBase}/${urlEtc}`)
.then(console.log(response));
