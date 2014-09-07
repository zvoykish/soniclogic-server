function route(handle, pathname, response, request) {
    var method = request.method;
    var pathHandlers = handle[pathname];
    if (pathHandlers) {
        var handler = pathHandlers[method];
        if (typeof handler === 'function') {
            handler(response, request);
        } else {
            console.log("No request handler found for " + method + " " + pathname);
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not found");
            response.end();
        }
    } else {
        handle["static"](response, pathname.slice(1));
    }
}

exports.route = route;
