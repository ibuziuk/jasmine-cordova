var parameters = window.location.hash.substr(1).split(",");
if (parameters[0].substring(0, 7) === "cordova") {
    localStorage.setItem("cordovaVersionFromUrl", parameters[0]);
    window.needToCheckAllCordovaVersions = parameters[1]; // XXX global flag
}
var cordovaLink;

if (!!window.needToCheckAllCordovaVersions) {
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

var cordovaScript = document.createElement('script');
cordovaScript.setAttribute("type", "text/javascript");
cordovaScript.setAttribute("src", cordovaLink);
document.getElementsByTagName("head")[0].appendChild(cordovaScript);
