// client is installed as well when `npm i socket.io`
const client = require("socket.io-client")("http://localhost:3000");

client.emit("setUserData", "mesuserdata");
client.emit("getNews");

client.on("getNewsAuto", (news) => {
    console.log(news.uneNews);
});