const express = require("express");
const { cp } = require("fs/promises");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { setTimeout } = require("timers/promises");
const io = new Server(server);

const { callNewsAPI } = require("./services/apiNewsCaller.js");
const {
    startCycle,
} = require("./services/refreshCycleService");
const { UserData } = require("./src/model/UserData.js");

io.on("connection", async function(socket) {
    console.log("a user connected");

    var userData = null;
    var interval;

    socket.on("disconnect", () => {
        clearInterval(interval);
    });

    //Le client demande expressement des données
    socket.on("getNews", () => {
        if (userData != null) {
            callNewsAPI(userData).then((data) => {
                console.log("Send API data.");
                socket.emit("getNewsAuto", {
                    data: data,
                });
            });
        } else {
            console.log("Veuillez d'abord fournir vos préférences utilisateur.");
        }
    });

    //Le client nous envoie ses filtres pour l'api d'actualité.
    socket.on("setUserData", (sendedUserData) => {
        userData = new UserData(
            sendedUserData.lang,
            sendedUserData.countries,
            sendedUserData.topic,
            sendedUserData.sources
        );
        if (userData != null) {
            console.log("Préférences utilisateur définies.");
            //On envoi de nous même au client les données en guise de réponse.
            callNewsAPI(userData).then((data) => {
                console.log("Send API data.");
                socket.emit("getNewsAuto", {
                    data: data,
                });
            });

            startCycle(userData, interval, socket).then((value) => {
                interval = value
            })
        } else {
            console.log("Merci de spécifier des préférences utilisateur.");
        }
    });
});

function test (userData, interval, socket) {
  callNewsAPI(userData).then((data) => {
    console.log("Send API data.");
    socket.emit("getNewsAuto", {
      data: data,
    });
  });
  //Puis tout les X time on actualise ces données.
  interval = setInterval(function () {

    console.log("-------------------CA FONCTIONNE----------------")

    //appel api vers l'api d'actualité
    callNewsAPI(userData).then((data) => {
      console.log("Send API data.");
      socket.emit("getNewsAuto", {
        data: data,
      });
    });
  }, getTimeCycle());
}

server.listen(3000, () => {
    console.log("listening on *:3000");
});