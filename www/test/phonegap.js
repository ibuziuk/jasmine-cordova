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
        // TODO This test will not pass only when cordova.js isn't found
		console.log("Testing Compass API");

        expect(navigator.compass).toBeDefined();

        function onSuccess(heading) {
            expect(heading.magneticHeading).toBeGreaterThan( -1 );
        }

        function onError(compassError) {
        }

		navigator.compass.getCurrentHeading(onSuccess, onError);
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
        }
        spyOn(obj, 'success').andCallThrough();
        spyOn(obj, 'error');
        spyOn(obj, 'valueChecker');
        runs(function(){
            var db = openDatabase('mydb1', '1.0', '', 2 * 1024 * 1024);
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

});