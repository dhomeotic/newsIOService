const axios = require("axios");
const instance = axios.create({
    baseURL: "https://api.newscatcherapi.com/v2/",
    timeout: 1000,
});

function generateUrl(endpoint, userData) {
    endpoint = endpoint.concat("when=", userData.when);
    if (userData.lang != null) {
        endpoint = endpoint.concat("&lang=", userData.lang);
    }
    if (userData.countries != null) {
        endpoint = endpoint.concat("&countries=", userData.countries);
    }
    if (userData.topic != null) {
        endpoint = endpoint.concat("&topic=", userData.topic);
    }
    if (userData.sources != null) {
        endpoint = endpoint.concat("&sources=", userData.sources);
    }
    return endpoint;
}

async function callNewsAPI(userData) {
    return instance
        .get(generateUrl("/latest_headlines?", userData), {
            timeout: 5000,
            headers: { "x-api-key": "KJmaITz--gyy0Nh6M18LYS_Jvxb50mVpmAasqdtyxBw" },
        })
        .then(function(response) {
            return response.data;
        })
        .catch((err) => {
            console.log(err);

            responseJson = {
                error: err.response.data,
                status: err.response.status,
            };

            return responseJson;
        });
}
exports.callNewsAPI = callNewsAPI;