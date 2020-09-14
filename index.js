require('dotenv').config();
const rally = require('rally');
// Create a Rally REST API instance, using env user, pw, and API key.
const restAPI = rally({
    requestOptions: {
        headers: {
            'X-RallyIntegrationName': process.env.RALLYINTEGRATIONNAME,
            'X-RallyIntegrationVendor': process.env.RALLYINTEGRATIONVENDOR,
            'X-RallyIntegrationVersion': process.env.RALLYINTEGRATIONVERSION
        }
    }
});
// const refUtils = rally.util.ref;
// const queryUtils = rally.util.query;
const ref = '/user/123';
restAPI.get({
    ref,
    fetch: ['Name']
})
.then(
    result => {
        console.log(result.Object);
    },
    error => {
        console.log(error.message);
    }
);
