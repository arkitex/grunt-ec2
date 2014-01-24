'use strict';

var fs = require('fs');
var path = require('path');
var lookup = require('./lookup.js');
var conf = require('./conf.js');
var cache = {};

module.exports = function (name, done) {

    if (name in cache) { // prevent redundant lookups.
        return process.nextTick(function () {
            done(cache[name]);
        });
    }

    lookup(name, function (instance) {
        var keyFile = path.join(conf('SSH_KEYS_FOLDER'), name + '.pem');

        if (conf('EXISTING_SSH_KEY_NAME') && conf('EXISTING_SSH_KEY_NAME') != '')
            keyFile = path.join(conf('SSH_KEYS_FOLDER'), conf('EXISTING_SSH_KEY_NAME') + '.pem');

        var result = cache[name] = {
            id: instance.InstanceId,
            ip: instance.PublicIpAddress,
            host: instance.PublicDnsName,
            port: 22,
            username: conf('AWS_SSH_USER'),
            privateKeyFile: keyFile,
            privateKey: fs.readFileSync(keyFile)
        };

        if (!result.host) {
            delete cache[name];
        }

        done(cache[name]);
    });
};
