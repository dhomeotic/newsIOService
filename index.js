const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("a user connected");

    var userData = null;

    //Le client demande expressement des données
    socket.on("getNews", () => {
        if (userData != null) {
            console.log(userData);
            console.log("Voici des news");
        } else {
            console.log("Veuillez d'abord fournir vos préférences utilisateur.");
        }
    });

    //Le client nous envoie ses filtres pour l'api d'actualité.
    socket.on("setUserData", (sendedUserData) => {
        userData = sendedUserData;
        console.log("Préférences utilisateur définies.");
        //On envoi de nous même au client les données
        setInterval(function() {
            //appel api vers l'api d'actualité
            socket.emit("getNewsAuto", {
                uneNews: "Beau temps today",
            });
        }, 5000);
    });
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});