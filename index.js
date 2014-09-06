/**
 * Created by Zvika on 9/6/14.
 */

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = {"GET": requestHandlers.main};
handle["/api/events"] = {"GET": requestHandlers.getEvents, "POST": requestHandlers.addEvent};
handle["/api/image"] = {"GET": requestHandlers.getImage, "POST": requestHandlers.setImage};
handle["/api/image/base64"] = {"GET": requestHandlers.getImageBase64};
handle["/api/imageTimestamp"] = {"GET": requestHandlers.lastImageUpdate};
handle["static"] = requestHandlers.getStatic;

server.start(router.route, handle);
