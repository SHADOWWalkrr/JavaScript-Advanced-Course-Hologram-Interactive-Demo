(function () {

    var status= document.getElementById('status');
    var orientation = '';

        window.WebSocket = window.WebSocket || window.MozWebSocket;

        var connection = new WebSocket('ws://192.168.0.123:1337');

        if (!localStorage._id) {
            localStorage._id = Date.now();
        }

        if (!window.WebSocket) {
            status.innerHTML = 'WebSocket not supported';
            return;
        }

        connection.onopen = function () {
            status.innerHTML = 'You are in control';

            window.addEventListener('orientationchange', function() {
                orientation = screen.orientation.type.split('-')[0];
            });
        };

        connection.onerror = function (error) {
            status.innerHTML = 'Connection error! Server down?';
        };

        gyro.startTracking(function (coords) {
            for (var coord in coords) {
                if (coord !== "x" && coord !== "y" && coord !== "z") {
                    coords[coord] = parseFloat(coords[coord]).toFixed(3);
                    coords[coord] = parseFloat(coords[coord]);
                }
            }

            if (typeof coords.alpha !== 'undefined') {
                coords.hasGyro = true;
            }else {
                coords.hasGyro = false;
            }

            coords.type = 'client';
            coords._id = localStorage._id;
            coords.orientation = orientation;

            console.log(coords);
            connection.send(JSON.stringify(coords));
        });
})();