"use strict";

const Homey = require("homey");

class PanelDriver extends Homey.Driver {
  onInit() {
    this.log("PanelDriver init");
  }

  onPair(socket) {
    socket.on("submit_credentials", (data, callback) => {
      Homey.ManagerSettings.set("username", data.username);
      Homey.ManagerSettings.set("password", data.password);
      Homey.ManagerSettings.set("code", data.code);
      this.log("Risco cloud settings set");

      callback(null, "done");
    });

    socket.on("completed", (data, callback) => {
      callback();
    });
  }
}

module.exports = PanelDriver;
