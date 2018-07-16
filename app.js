"use strict";

const Homey = require("homey");
const http = require("http");
var request = require("request");
const Log = require("homey-log");
var jar = request.jar();

const RISCO_CLOUD_HOST = "www.riscocloud.com";
const RISCO_CLOUD_ENDPOINT = "/ELAS/WebUI";
const RISCO_CLOUD_PORT = 443;

class MyApp extends Homey.App {
  onInit() {
    this.log("Risco Cloud Security app is running...");
  }

  _post(resource, data, isBinary = false) {
    return new Promise((resolve, reject) => {
      var headersOpt = {
        "content-type": "application/x-www-form-urlencoded"
      };

      request(
        {
          uri: "https://" + RISCO_CLOUD_HOST + RISCO_CLOUD_ENDPOINT + resource,
          method: "POST",
          form: data,
          headers: headersOpt,
          json: true,
          jar: jar
        },
        function(error, response, body) {
          //console.log(response.headers);
          //console.log(body);
          resolve(response);
        }
      );
    });
  }

  getAlarmState() {
    return new Promise((resolve, reject) => {
      this._post("/Security/GetCPState?userIsAlive=true", "")
        .then(response => {
          if (response) {
            resolve(response);
          } else {
            reject("Error obtaining sysinfo.");
          }
        })
        .catch(error => reject(error));
    });
  }

  loginUser(username, password, code) {
    var data = { username: username, password: password, code: code };
    return new Promise((resolve, reject) => {
      this._post("", data)
        .then(response => {
          if (response) {
            resolve("OK");
          } else {
            resolve("NOK");
          }
        })
        .catch(error => reject(error));
    });
  }
}

module.exports = MyApp;
