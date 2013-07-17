/*
  *  cordovaSwither.js gets values after '#' sign and adds <script> with necessary cordova.js necessary based on these values
  *  see index.html
 */
var parameters = window.location.hash.substr(1).split(",");
var cordovaLink;

switch (parameters[0]) {
    case "checkOne" :
        localStorage.setItem("cordovaVersionFromUrl", parameters[1]);
        break;
    case "checkAll" :
        window.checkAll = parameters[0]; // XXX global flag
        break;
}

if (!!window.checkAll) {
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
    cordovaLink = "cordova/" + cordovaVersions[currentCordovaVersion];
} else {
    cordovaLink = "cordova/" + localStorage.getItem("cordovaVersionFromUrl");
}

// Adding script with cordova.js we want to check
var cordovaScript = document.createElement('script');
cordovaScript.setAttribute("type", "text/javascript");
cordovaScript.setAttribute("src", cordovaLink);
document.getElementsByTagName("head")[0].appendChild(cordovaScript);
