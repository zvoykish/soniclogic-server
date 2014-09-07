var http = require("http");
var httpServer = http.Server();
var io = require("socket.io")(httpServer);
var url = require("url");
var log = require("./logger").log;

var PORT = 8888;
var WS_PORT = 8889;

function start(route, handle, webSocketHandlers) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        log("Request: " + pathname);
        io.emit('event', 'Event for: ' + pathname);
        route(handle, pathname, response, request);
    }

    var sockets = {};
    io.on("connection", function (currentSocket) {
        currentSocket.on('type', function (type) {
            log("Received type event: " + type);
            var handleSocket = webSocketHandlers[type];
            if (handleSocket) {
                handleSocket(currentSocket, sockets);
            } else {
                log("Unknown socket type: " + type);
            }
        });
        log("A user connected...");
    });

    httpServer.listen(WS_PORT, function () {
        log("WebSocket Server listening on port: " + WS_PORT);
    });

    var server = http.createServer(onRequest);
    server.listen(PORT);
    log("HTTP Server listening on port: " + PORT);
}

exports.start = start;
