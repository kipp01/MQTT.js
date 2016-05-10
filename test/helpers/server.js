'use strict';

var mqtt = require('mqtt');

module.exports.init_server = function (PORT) {
    var server = new mqtt.Server(function (client) {
        /*
        var i, events = ['connect', 'publish', 'pubrel', 'subscribe', 'disconnect'];

        for (i = 0; i < events.length; i++) {
            client.on(events[i], function (packet) {
                //console.dir(packet);
            });
        }
        */

        client.on('connect', function () {
            client.connack(0);
        });

        client.on('publish', function (packet) {
            switch (packet.qos) {
                case 1:
                    client.puback({messageId: packet.messageId});
                    break;
                case 2:
                    client.pubrec({messageId: packet.messageId});
                    break;
                default:
                    // console.log('errors? QOS=', packet.qos);
                    break;
            }

        });

        client.on('pubrel', function (packet) {
            client.pubcomp({messageId: packet.messageId});
        });

        client.on('pingreq', function () {
            client.pingresp();
        });

        client.on('disconnect', function () {
            client.stream.end();
        });
    });
    server.listen(PORT);
    return server;
};
