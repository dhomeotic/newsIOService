// client is installed as well when `npm i socket.io`
const client = require("socket.io-client")("http://localhost:3000");

client.emit("setUserData", {
    lang: "en",
    //countries: "FR",
    //topic: "tech",
    sources: "lemonde.fr",
});
client.emit("getNews");

client.on("getNewsAuto", (data) => {
    console.log(data);
});