/**
 * Created by Zvika on 9/6/14.
 */

var events = [];

function add(event) {
    events.push(event);
}

function drain() {
    if (events.length == 0) {
        return [];
    }

    var cloned = [];
    while (events.length > 0) {
        cloned.push(events.pop());
    }

    return cloned;
}

exports.add = add;
exports.drain = drain;
