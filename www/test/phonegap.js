describe("Phonegap", function() {

	it("Device API", function() {
        console.log("Testing Notification API");

        expect(device).toBeDefined();
		expect(device).not.toBe(null);

        expect(device.cordova).toBeDefined();
		expect(device.cordova).not.toBe(null);

        expect(device.platform).toBeDefined();
		expect(device.platform).not.toBe(null);

        expect(device.uuid).toBeDefined();
		expect(device.uuid).not.toBe(null);

        expect(device.version).toBeDefined();
        expect(device.version).not.toBe(null);
	 });

	it("Notification API", function() {
        // TODO This test will not pass only when cordova.js isn't found
        console.log("Testing Notification API");

		expect(navigator.notification).toBeDefined();
        expect(navigator.notification.alert).toBeDefined();
	});

	it("Compass API", function() {
		console.log("Testing Compass API");

        var obj = {
            success:function(heading) {
                expect(heading.magneticHeading).toBeDefined();
                expect(heading.magneticHeading).not.toBeNull();
            },
            error:function() {
                console.log("Error while simulating Compass API");
            }
        };
        spyOn(obj, "success").andCallThrough();
        spyOn(obj, "error").andCallThrough();

        runs(function() {
            navigator.compass.watchHeading(obj.success, obj.error);
        });

        waitsFor(function(){
            return obj.success.callCount > 0 || obj.error.callCount > 0;
        });

        runs(function() {
            expect(obj.success.callCount).toBe(1);
            expect(obj.error.callCount).toBe(0);
        });
	});

    it("Storage API", function() {
        console.log("Testing Storage API");

        var obj = {
            success:function (tx, results) {
                var len = results.rows.length, i;
                for (i = 0; i < len; i++) {
                    obj.valueChecker(results.rows.item(i).text);
                }
            },
            error:function(){},
            valueChecker:function(){}
        };
        spyOn(obj, 'success').andCallThrough();
        spyOn(obj, 'error');
        spyOn(obj, 'valueChecker');
        runs(function(){
            var db = openDatabase('mydb', '1.0','mydb', 2 * 1024 * 1024);
            db.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS foo');
                tx.executeSql('CREATE TABLE IF NOT EXISTS foo (id unique, text)');
                tx.executeSql('INSERT INTO foo (id, text) VALUES (1, "synergies")');
                tx.executeSql('SELECT * FROM foo', [], obj.success, obj.error);
            });
        });
        waitsFor(function(){
            return obj.success.callCount > 0 || obj.error.callCount > 0
        });
        runs(function(){
            expect(obj.success.callCount).toBe(1);
            expect(obj.error.callCount).toBe(0);
            expect(obj.valueChecker).toHaveBeenCalledWith('synergies');
        });
    });

    it("Geolocation API", function() {
        console.log("Testing Geolocation API");

        var obj = {
            success:function(position) {
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
            error:function() {
                console.log("Error while simulating Geolocation API");
            }
        };
        spyOn(obj, "success").andCallThrough();
        spyOn(obj, "error").andCallThrough();

        runs(function() {
            navigator.geolocation.getCurrentPosition(obj.success, obj.error);
        });

        waitsFor(function(){
            return obj.success.callCount > 0 || obj.error.callCount > 0;
        });

        runs(function() {
            expect(obj.success.callCount).toBe(1);
            expect(obj.error.callCount).toBe(0);
        });
    });

    it("Connection API", function() {
        console.log("Testing Geolocation API");

        var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        expect(states[networkState]).toBe( states[Connection.ETHERNET]); // By Default "Ethernet" Connection is used in the CordovaSim (it can be changed in the "Device & Network Setting" tab)
    });
});