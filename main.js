/**
 * Created by Zvika on 9/6/14.
 */

var isStopped = true;
var lastImageTime = -1;

function getJson() {
    var url = '/api/image/base64';

    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        contentType: "application/json",
        dataType: 'json',
        success: function(json, textStatus, request) {
            if (isStopped) {
                return;
            }

            var imageTime = request.getResponseHeader('X-Image-Time');
            var msg = 'Received image with timestamp: ' + imageTime;
            console.log(msg);
            if ($('#chk_log').is(':checked')) {
                $('#log_area').append('<div>' + new Date().toLocaleString() + ' - ' + msg + '</div>');
            }

            if (imageTime > lastImageTime) {
                lastImageTime = imageTime;
                var data = json.data;
                $('#error_area').html('');
                $('#image_element').attr('src', 'data:image/png;base64,' + data);
            }

            if (!isStopped) {
                setTimeout(function () {
                    getJson();
                }, $('#polling_interval').val());
            }
        },
        error: function(e) {
            if (!isStopped) {
                $('#image_element').attr('src', '');
                $('#error_area').html('Error: ' + e.message);
            }
        }
    });
}

$(document).ready(function() {
    $('#image_element').mousemove(function (event) {
        if (!isStopped) {
            var msg = 'Mouse over image coordinates: (' + event.offsetX + ', ' + event.offsetY + ')';
            $("#debug_area").html("<div>" + msg + "</div>");
        }
    });

    $('#btn_connect').click(function() {
        if (isStopped) {
            if ($('#polling_interval').val().length > 1) {
                isStopped = false;
                $('#btn_connect').attr('disabled', 'disabled');
                $('#btn_connect').addClass('disabled');
                $('#btn_stop').removeAttr('disabled');
                $('#btn_stop').removeClass('disabled');
                getJson();
            } else {
                alert('Invalid values!');
            }
        }
    });

    $('#btn_stop').click(function() {
        isStopped = true;
        lastImageTime = -1;
        $('#btn_stop').attr('disabled', 'disabled');
        $('#btn_stop').addClass('disabled');
        $('#btn_connect').removeAttr('disabled');
        $('#btn_connect').removeClass('disabled');
        $('#image_element').attr('src', '');
        $('#error_area').html('');
        $('#log_area').html('');
        $('#debug_area').html('');
    });

    $('#chk_log').click(function() {
        if ($('#chk_log').is(':checked')) {
            $('#log_container').show();
        } else {
            $('#log_container').hide();
            $('#log_area').html('');
        }
    });

    $('#lbl_log').click(function() {
        $('#chk_log').click();
    });

    $('#chk_debug').click(function() {
        if ($(this).is(':checked')) {
            $('#debug_container').show();
        } else {
            $('#debug_container').hide();
            $('#debug_area').html('');
        }
    });

    $('#lbl_debug').click(function() {
        $('#chk_debug').click();
    });
});
