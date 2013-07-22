/*
  *  cordovaSwither.js gets values after '#' sign and adds <script> with necessary cordova.js based on these values
  *  see index.html
 */
var parameters = window.location.hash.substr(1).split(",");
var cordovaLink;

switch (parameters[0]) {
    case "checkOne" :
        localStorage.setItem("cordovaVersionFromUrl", parameters[1]);
        break;
    case "checkAll" :
        window.checkAll = true;
        break;
}

if (window.checkAll) {
    var cordovaVersionsToCheck = localStorage.cordovaVersionsToCheck;
    if (cordovaVersionsToCheck) {
        cordovaVersionsToCheck = JSON.parse(cordovaVersionsToCheck);
    } else {  // initialize array for the very first time with all cordova versions and save it in the local storage
        cordovaVersionsToCheck =  [ "cordova-2.0.0.js",
                                    "cordova-2.1.0.js",
                                    "cordova-2.2.0.js",
                                    "cordova-2.3.0.js",
                                    "cordova-2.4.0.js",
                                    "cordova-2.5.0.js",
                                    "cordova-2.6.0.js",
                                    "cordova-2.7.0.js",
                                    "cordova-2.8.0.js",
                                    "cordova-2.8.1.js",
                                    "cordova-2.9.0.js"];
        localStorage.cordovaVersionsToCheck = JSON.stringify(cordovaVersionsToCheck);
    }
    var currentCordovaVersion = cordovaVersionsToCheck[0]; // current cordova version is the first element in the array
    cordovaLink = "cordova/" + currentCordovaVersion;
} else {
    cordovaLink = "cordova/" + localStorage.getItem("cordovaVersionFromUrl");
}

// Adding script with cordova.js we want to check
var cordovaScript = document.createElement('script');
cordovaScript.setAttribute("type", "text/javascript");
cordovaScript.setAttribute("src", cordovaLink);
document.getElementsByTagName("head")[0].appendChild(cordovaScript);
