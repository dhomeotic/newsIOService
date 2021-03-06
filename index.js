const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { setTimeout } = require("timers/promises");
const io = new Server(server);

const { callNewsAPI } = require("./services/apiNewsCaller.js");
const {
  getTimeBeforeStartCycle,
  getTimeCycle,
} = require("./services/refreshCycleService");
const { UserData } = require("./src/model/UserData.js");

io.on("connection", (socket) => {
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
      //On envoi de nous même au client les données
      callNewsAPI(userData).then((data) => {
        console.log("Send API data.");
        socket.emit("getNewsAuto", {
          data: data,
        });
      });
      setTimeout(() => {
        //Puis tout les X time on actualise ces données.
        interval = setInterval(function () {
          //appel api vers l'api d'actualité
          callNewsAPI(userData).then((data) => {
            console.log("Send API data.");
            socket.emit("getNewsAuto", {
              data: data,
            });
          });
        }, getTimeCycle());
      }, getTimeBeforeStartCycle());
    } else {
      console.log("Merci de spécifier des préférences utilisateur.");
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
