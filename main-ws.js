/**
 * Created by Zvika on 9/6/14.
 */

var WS_PORT = 8889;
var isStopped = true;
var socket;

function updateImage(data) {
    $('#error_area').html('');
    $('#image_element').attr('src', 'data:image/png;base64,' + data);
}

function connect() {
    socket = io('http://localhost:' + WS_PORT);
    socket.on('connect', function () {
        socket.emit('type', 'browser');
        socket.on('image', function (imageData) {
            console.log("Received image data: " + imageData);
            updateImage(imageData);
        });
        socket.on('disconnect', function () {
            console.log('Disconnected!');
        });
    });
}

$(document).ready(function () {
    /*
     $('#image_element').mousemove(function (event) {
     if (!isStopped) {
     var x = event.offsetX;
     var y = event.offsetY;
     var msg = 'Mouse over image coordinates: (' + x + ', ' + y + ')';
     $("#debug_area").html("<div>" + msg + "</div>");
     socket.emit('move', {'x': x, 'y': y});
     }
     });
     */

    $('#image_element').click(function (event) {
        if (!isStopped) {
            var x = event.offsetX;
            var y = event.offsetY;
            var msg = 'Mouse clicked at image coordinates: (' + x + ', ' + y + ')';
            $("#debug_area").html("<div>" + msg + "</div>");
            socket.emit('click', {'x': x, 'y': y});
        }
    });

    $('#btn_connect').click(function () {
        if (isStopped) {
            isStopped = false;
            $('#btn_connect').attr('disabled', 'disabled');
            $('#btn_connect').addClass('disabled');
            $('#btn_stop').removeAttr('disabled');
            $('#btn_stop').removeClass('disabled');
            connect();
        }
    });

    $('#btn_stop').click(function () {
        isStopped = true;
        socket = null;
        $('#btn_stop').attr('disabled', 'disabled');
        $('#btn_stop').addClass('disabled');
        $('#btn_connect').removeAttr('disabled');
        $('#btn_connect').removeClass('disabled');
        $('#image_element').attr('src', '');
        $('#error_area').html('');
        $('#log_area').html('');
        $('#debug_area').html('');
    });

    $('#chk_log').click(function () {
        if ($('#chk_log').is(':checked')) {
            $('#log_container').show();
        } else {
            $('#log_container').hide();
            $('#log_area').html('');
        }
    });

    $('#lbl_log').click(function () {
        $('#chk_log').click();
    });

    $('#chk_debug').click(function () {
        if ($(this).is(':checked')) {
            $('#debug_container').show();
        } else {
            $('#debug_container').hide();
            $('#debug_area').html('');
        }
    });

    $('#lbl_debug').click(function () {
        $('#chk_debug').click();
    });
});
