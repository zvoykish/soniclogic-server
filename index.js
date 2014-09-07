/**
 * Created by Zvika on 9/6/14.
 */

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var webSocketHandlers = require("./webSocketHandlers");

var handle = {};
handle["/"] = {"GET": requestHandlers.main};
handle["/test"] = {"GET": requestHandlers.test};
handle["static"] = requestHandlers.getStatic;

var webSocketHandle = {};
webSocketHandle["soniclogic"] = webSocketHandlers.sonicLogic;
webSocketHandle["browser"] = webSocketHandlers.browser;

server.start(router.route, handle, webSocketHandle);
