var events = require('./events');
var fs = require('fs');

var url = require('url');

var imageData;
var imageDataBase64;
var imageFile = '1.png';

var lastImageTime = new Date();


function loadImage() {
    fs.readFile(imageFile, function (err, data) {
        if (!err) {
            imageData = data;
            imageDataBase64 = new Buffer(imageData, 'binary').toString('base64');
        }
    });
}

loadImage();

function main(response) {
    fs.createReadStream("main.html").pipe(response);
}

function getStatic(response, path) {
    fs.exists(path, function (exists) {
        if (exists) {
            fs.createReadStream(path).pipe(response);
        } else {
            console.log("No request handler found for " + method + " " + pathname);
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not found");
            response.end();
        }
    });
}

function getImage(response) {
    response.writeHead(200, "OK", {'Content-Type': 'image/png'});
    response.write(imageData);
    response.end();
}

function getImageBase64(response) {
    response.setHeader("X-Image-Time", lastImageTime.getTime());
    response.writeHead(200, "OK", {'Content-Type': 'application/json'});
    response.write(JSON.stringify({'data':imageDataBase64}));
    response.end();
}

function setImage(response, request) {
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    imageFile = query.filename;
    lastImageTime = new Date();
    loadImage();
    console.log("new image file: " + imageFile);

    response.writeHead(200, "OK", {'Content-Type': 'application/json'});
    response.end();
}

function lastImageUpdate(response) {
    response.writeHead(200, "OK", {'Content-Type': 'application/json'});
    response.write(JSON.stringify({'timestamp': lastImageTime.getTime()}));
    response.end();
}

function getEvents(response) {
    var newEvents = events.drain();
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(newEvents));
    response.end();
}

function addEvent(response, request) {
    var buffer = '';
    request.on('data', function (chunk) {
        buffer += chunk;
        console.log("Received body data: " + chunk.toString());
    });

    request.on('end', function () {
        var event = JSON.parse(buffer);
        events.add(event);

        // empty 200 OK response for now
        response.writeHead(200, "OK", {'Content-Type': 'application/json'});
        response.end();
    });
}

exports.main = main;
exports.getStatic = getStatic;
exports.getImage = getImage;
exports.getImageBase64 = getImageBase64;
exports.setImage = setImage;
exports.lastImageUpdate = lastImageUpdate;
exports.getEvents = getEvents;
exports.addEvent = addEvent;
