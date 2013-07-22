describe("Phonegap", function () {

    var switchCordovaVersion = function() {
        var cordovaVersionsToCheck = JSON.parse(localStorage.cordovaVersionsToCheck);
        var currentCordovaVersion = cordovaVersionsToCheck[0];

        addCordovaVersionInfo(currentCordovaVersion);
        addCordovaVersionToAllDescriptionLinks(currentCordovaVersion);
        saveTestResults();

        if (cordovaVersionsToCheck.length > 1) {
            deleteCheckedCordovaVersion(cordovaVersionsToCheck);
            location.reload();
        } else { // we reach the last element of the array, all tests have been run
            doAfterAllTests();
        }
    };

    var deleteCheckedCordovaVersion  = function(cordovaVersionsToCheck) {
        cordovaVersionsToCheck.shift(); // removing first element of the array
        localStorage.cordovaVersionsToCheck = JSON.stringify(cordovaVersionsToCheck);
    };

    var addCordovaVersionInfo = function(currentCordovaVersion) {
        var cordovaVersionContainer = document.createElement("div");
        var cordovaVersionHeader = document.createElement("h1");
        cordovaVersionHeader.innerHTML = currentCordovaVersion;
        var hr = document.createElement("hr"); // XXX deprecated in HTML 5
        cordovaVersionContainer.appendChild(hr);
        cordovaVersionContainer.appendChild(cordovaVersionHeader);
        document.body.insertBefore(cordovaVersionContainer, document.body.firstElementChild);
    };

    var addCordovaVersionToAllDescriptionLinks = function(currentCordovaVersion) {
        var links = document.getElementsByClassName("description");
        for(var i = 0; i < links.length; i++){
            var hrefWithCordovaVersion = links[i].getAttribute("href") + "#checkOne,"  + currentCordovaVersion;
            links[i].setAttribute("href", hrefWithCordovaVersion);
        }
    };

    var saveTestResults = function() {
        var previousResults = localStorage.getItem("results");
        var results = (!!previousResults) ? previousResults + document.body.innerHTML : document.body.innerHTML;
        localStorage.setItem("results", results);
    };

    var doAfterAllTests = function() {
        document.body.innerHTML = localStorage.results;
        delete localStorage.results;
        delete localStorage.cordovaVersionsToCheck;
        delete window.checkAll;
    };

    xit("Device API", function () {
        console.log("Testing Notification API");

        expect(device).toBeDefined();
        expect(device).not.toBe(null);


        // TODO - doesn't work with cordova 2.5.0 - 2.9.0
/*      expect(device.name).toBeDefined();
        expect(device.name).not.toBe(null);

        expect(device.cordova).toBeDefined();
        expect(device.cordova).not.toBe(null);

        expect(device.platform).toBeDefined();
        expect(device.platform).not.toBe(null);

        expect(device.uuid).toBeDefined();
        expect(device.uuid).not.toBe(null);

        expect(device.version).toBeDefined();
        expect(device.version).not.toBe(null);*/
    });

    it("Notification API", function () {
        // TODO This test will not pass only when cordova.js isn't found
        console.log("Testing Notification API");

        expect(navigator.notification).toBeDefined();
        expect(navigator.notification.alert).toBeDefined();
    });

    it("Compass API", function () {
        console.log("Testing Compass API");

        var obj = {
            success: function (heading) {
                expect(heading.magneticHeading).toBeDefined();
                expect(heading.magneticHeading).not.toBeNull();
            },
            error: function () {
                console.log("Error while simulating Compass API");
            }
        };
        spyOn(obj, "success").andCallThrough();
        spyOn(obj, "error").andCallThrough();

        runs(function () {
            navigator.compass.watchHeading(obj.success, obj.error);
        });

        waitsFor(function () {
            return obj.success.callCount > 0 || obj.error.callCount > 0;
        });

        runs(function () {
            expect(obj.success.callCount).toBe(1);
            expect(obj.error.callCount).toBe(0);
        });
    });

    it("Storage API", function () {
        console.log("Testing Storage API");

        var obj = {
            success: function (tx, results) {
                var len = results.rows.length, i;
                for (i = 0; i < len; i++) {
                    obj.valueChecker(results.rows.item(i).text);
                }
            },
            error: function () {
            },
            valueChecker: function () {
            }
        };
        spyOn(obj, 'success').andCallThrough();
        spyOn(obj, 'error');
        spyOn(obj, 'valueChecker');
        runs(function () {
            var db = openDatabase('mydb', '1.0', 'mydb', 2 * 1024 * 1024);
            db.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS foo');
                tx.executeSql('CREATE TABLE IF NOT EXISTS foo (id unique, text)');
                tx.executeSql('INSERT INTO foo (id, text) VALUES (1, "synergies")');
                tx.executeSql('SELECT * FROM foo', [], obj.success, obj.error);
            });
        });
        waitsFor(function () {
            return obj.success.callCount > 0 || obj.error.callCount > 0
        });
        runs(function () {
            expect(obj.success.callCount).toBe(1);
            expect(obj.error.callCount).toBe(0);
            expect(obj.valueChecker).toHaveBeenCalledWith('synergies');
        });
    });

    xit("Geolocation API", function () {
        console.log("Testing Geolocation API");

        var obj = {
            success: function (position) {
                expect(position.coords).toBeDefined();

                expect(position.coords.longitude).toBeDefined();
                expect(position.coords.longitude).not.toBeNull();

                expect(position.coords.altitude).toBeDefined();
                expect(position.coords.altitude).not.toBeNull();

                expect(position.coords.accuracy).toBeDefined();
                expect(position.coords.accuracy).not.toBeNull();

                expect(position.coords.heading).toBeDefined();
                expect(position.coords.heading).not.toBeNull();

                expect(position.coords.speed).toBeDefined();
                expect(position.coords.speed).not.toBeNull();

                expect(position.timestamp).toBeDefined();
                expect(position.timestamp).not.toBeNull();
            },
            error: function () {
                console.log("Error while simulating Geolocation API");
            }
        };
        spyOn(obj, "success").andCallThrough();
        spyOn(obj, "error").andCallThrough();

        runs(function () {
            navigator.geolocation.getCurrentPosition(obj.success, obj.error);
        });

        waitsFor(function () {
            return obj.success.callCount > 0 || obj.error.callCount > 0;
        });

        runs(function () {
            expect(obj.success.callCount).toBe(1);
            expect(obj.error.callCount).toBe(0);
        });
    });

    xit("Connection API", function () {
        console.log("Testing Connection API");
        var networkState = navigator.connection.type;

        expect(networkState).toBeDefined();
        expect(networkState).not.toBe(null);

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';
        expect(states[networkState]).toBe(states[Connection.ETHERNET]); // By default "Ethernet" connection is used in the CordovaSim (it can be changed via "Device & Network Setting" tab)
    });

    // TODO doesn't work with cordova 2.0.0 - 2.1.0
    xit("Globalization API", function () {
        console.log("Testing Globalization API");

        var obj = {
            successLanguage: function (language) {
                expect(language).toBeDefined();
                expect(language.value).toEqual(jasmine.any(String));
            },
            errorLanguage: function () {
                console.log("Globalization preferredLanguage error");
            },
            successLocalName: function (locale) {
                expect(locale).toBeDefined();
                expect(locale.value).toEqual(jasmine.any(String));
            },
            errorLocalName: function () {
                console.log("Globalization localName error");
            },
            successDatePattern: function (date) {
                expect(date).toBeDefined();
            },
            errorDatePattern: function () {
                console.log("Globalization datePattern error");
            }
        };
        spyOn(obj, 'successLanguage').andCallThrough();
        spyOn(obj, 'errorLanguage').andCallThrough();

        spyOn(obj, 'successLocalName').andCallThrough();
        spyOn(obj, 'errorLocalName').andCallThrough();

        spyOn(obj, 'successDatePattern').andCallThrough();
        spyOn(obj, 'errorDatePattern').andCallThrough();

        runs(function () {
            console.log("Testing Globalization getPreferredLanguage method");
            navigator.globalization.getPreferredLanguage(obj.successLanguage, obj.errorLanguage);
        });

        waitsFor(function () {
            return obj.successLanguage.callCount > 0 || obj.errorLanguage.callCount > 0;
        });

        runs(function () {
            console.log("Testing Globalization getLocaleName method");
            navigator.globalization.getLocaleName(obj.successLocalName, obj.errorLocalName);
        });

        waitsFor(function () {
            return obj.successLocalName.callCount > 0 || obj.errorLocalName.callCount > 0;
        });

        runs(function () {
            console.log("Testing Globalization getDatePattern method");
            navigator.globalization.getDatePattern(obj.successDatePattern, obj.errorDatePattern);
        });

        waitsFor(function () {
            return obj.successDatePattern.callCount > 0 || obj.errorDatePattern.callCount > 0;
        });

        runs(function () {
            expect(obj.successLanguage.callCount).toBe(1);
            expect(obj.errorLanguage.callCount).toBe(0);

            expect(obj.successLocalName.callCount).toBe(1);
            expect(obj.errorLocalName.callCount).toBe(0);

            expect(obj.successDatePattern.callCount).toBe(1);
            expect(obj.errorDatePattern.callCount).toBe(0);
        });
    });

    it("Accelerometer API", function () {
        console.log("Testing Accelerometer API");

        var obj = {
            successCurrentAcceleration: function (acceleration) {
                expect(acceleration.x).toEqual(jasmine.any(Number));
                expect(acceleration.y).toEqual(jasmine.any(Number));
                expect(acceleration.z).toEqual(jasmine.any(Number));
            },
            errorCurrentAcceleration: function () {
                console.log("Accelerometer getCurrentAcceleration error");
            },
            successWatchAcceleration: function (acceleration) {
                expect(acceleration.x).toEqual(jasmine.any(Number));
                expect(acceleration.y).toEqual(jasmine.any(Number));
                expect(acceleration.z).toEqual(jasmine.any(Number));
                expect(acceleration.timestamp).toEqual(jasmine.any(Number));
            },
            errorWatchAcceleration: function () {
                console.log("Accelerometer watchAcceleration error");
            }
        };
        spyOn(obj, "successCurrentAcceleration").andCallThrough();
        spyOn(obj, "errorCurrentAcceleration").andCallThrough();

        spyOn(obj, "successWatchAcceleration").andCallThrough();
        spyOn(obj, "errorWatchAcceleration").andCallThrough();

        runs(function () {
            navigator.accelerometer.getCurrentAcceleration(obj.successCurrentAcceleration, obj.errorCurrentAcceleration);
        });

        waitsFor(function () {
            return obj.successCurrentAcceleration.callCount > 0 || obj.errorCurrentAcceleration.callCount > 0;
        });

        runs(function () {
            var options = { frequency: 300 };  // Update every 0,3 seconds
            navigator.accelerometer.watchAcceleration(obj.successWatchAcceleration, obj.errorWatchAcceleration, options);
        });

        waitsFor(function () {
            return obj.successWatchAcceleration.callCount > 2 || obj.errorCurrentAcceleration.callCount > 0;
        });

        runs(function () {
            expect(obj.successCurrentAcceleration.callCount).toBe(1);
            expect(obj.errorCurrentAcceleration.callCount).toBe(0);

            expect(obj.successWatchAcceleration.callCount).toBe(3);
            expect(obj.errorCurrentAcceleration.callCount).toBe(0);
        });
    });

    if (window.checkAll) {
        it("Switching cordova version", function() {
           switchCordovaVersion(); // XXX switching cordova js version in a separate jasmine test
           var pendingIconsOfThisTest = document.getElementsByClassName("pending"); // XXX removing pending icons of this test
           for (index = pendingIconsOfThisTest.length - 1; index >= 0; index--) {
                pendingIconsOfThisTest[index].parentNode.removeChild(pendingIconsOfThisTest[index]);
            }
        });
    }
});