"use strict";

const Homey = require("homey");

class PanelDevice extends Homey.Device {
  onInit() {
    this.log("PanelDevice init");

    this.loginUser().then(result => {
      if (result === "OK") {
        this.startPolling();
      } else {
        this.log("Could not log in user");
        Homey.log("Could not log in user");
      }
    });
  }

  onAdded() {
    this.log("onAdded");
  }

  onDeleted() {
    this.log("onDeleted");
  }

  loginUser() {
    return new Promise((resolve, reject) => {
      var username = Homey.ManagerSettings.get("username");
      var password = Homey.ManagerSettings.get("password");
      var code = Homey.ManagerSettings.get("code");

      Homey.app.loginUser(username, password, code).then(result => {
        resolve("OK");
      });
    });
  }

  getAlarmState() {
    return new Promise((resolve, reject) => {
      Homey.app.getAlarmState().then(result => {
        if (result !== null) {
          if (result.body.overview !== null) {
            if (result.body.overview.partInfo !== null) {
              var state = "";
              if (result.body.overview.partInfo.armedStr === "Yes ") {
                state = "armed";
              } else if (
                result.body.overview.partInfo.partArmedStr === "Yes "
              ) {
                state = "partially_armed";
              } else if (result.body.overview.partInfo.disarmedStr === "Yes ") {
                state = "disarmed";
              } else {
                console.log(" unknown status: ", result.body.overview.partInfo);
              }
              this.setCapabilityValue("homealarm_state", state);
            }
          }
          //var alarmIsOnGoing = result.body.OngoingAlarm;
          //this.setCapabilityValue("alarm_generic", alarmIsOnGoing);
        }

        resolve(result);
      });
    });
  }

  startPolling() {
    const POLL_INTERVAL = 15000;

    this._pollAlarmInterval = setInterval(
      this.getAlarmState.bind(this),
      POLL_INTERVAL
    );
  }
}

module.exports = PanelDevice;
