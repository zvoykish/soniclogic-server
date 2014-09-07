/**
 * Created by Zvika on 9/6/14.
 */

var log = require("./logger").log;
var lastImage = null;

function sonicLogic(socket, sockets) {
    sockets.sonicLogic = socket;
    socket.on('image', function (image) {
        lastImage = image;
        var browser = sockets.browser;
        if (browser) {
            browser.emit('image', image);
        }
    });
}

function browser(socket, sockets) {
    sockets.browser = socket;
    /*
     socket.on('move', function (location) {
     log('Received move event at: ' + location.x + ',' + location.y);
     var sonicLogic = sockets.sonicLogic;
     if (sonicLogic) {
     sonicLogic.emit('move', location);
     }
     });
     */
    socket.on('click', function (location) {
        log('Received click event at: ' + location.x + ',' + location.y);
        var sonicLogic = sockets.sonicLogic;
        if (sonicLogic) {
            sonicLogic.emit('click', location);
        }
    });

    // "Send history"
    if (lastImage) {
        socket.emit('image', lastImage);
    }
}

exports.sonicLogic = sonicLogic;
exports.browser = browser;
