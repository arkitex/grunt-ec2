'use strict';

var _ = require('lodash');
var util = require('util');
var conf = require('./conf.js');
var parse = require('./parse.js');

module.exports = {
  pm2_reload: function () {
    return util.format('sudo pm2 reload all || echo "pm2 not started."');
  },
  pm2_start: function (name) {
    var defaults = {
      NODE_ENV: name
    };
    var user = conf('ENV');
    var env = {};

    // user can override NODE_ENV if need be
    _.assign(env, defaults, user);

    return util.format('pm2 kill && cd /srv/apps/ec2/current/dist/ && sudo %s pm2 start %s --name %s -f || echo "pm2 already started."',
      'NODE_ENV=' + env.NODE_ENV, conf('NODE_SCRIPT'), name
    );
  }
};