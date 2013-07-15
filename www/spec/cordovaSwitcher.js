var cordovaVersions = new Array();
cordovaVersions[0] = "cordova-2.0.0.js";
cordovaVersions[1] = "cordova-2.1.0.js";
cordovaVersions[2] = "cordova-2.2.0.js";
cordovaVersions[3] = "cordova-2.3.0.js";
cordovaVersions[4] = "cordova-2.4.0.js";
cordovaVersions[5] = "cordova-2.5.0.js";
cordovaVersions[6] = "cordova-2.6.0.js";
cordovaVersions[7] = "cordova-2.7.0.js";
cordovaVersions[8] = "cordova-2.8.0.js";
cordovaVersions[9] = "cordova-2.9.0.js";
//TODO cordova-2.8.1 is not in the array

var retrievedObject = JSON.parse(localStorage.getItem("currentCordovaVersion"));
var currentCordovaVersion = (!!retrievedObject) ? retrievedObject.currentCordovaVersion : 0;

var cordovaScript = document.createElement('script');
cordovaScript.setAttribute("type", "text/javascript");
cordovaScript.setAttribute("src", "cordova/" + cordovaVersions[currentCordovaVersion]);
document.getElementsByTagName("head")[0].appendChild(cordovaScript);
