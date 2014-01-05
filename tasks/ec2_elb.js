'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var util = require('util');
var conf  = require('./lib/conf.js');
var aws = require('./lib/aws.js');

module.exports = function (grunt) {
    var map = {
        attach: {
            cli: 'register-instances-with-load-balancer',
            sdk: 'registerInstancesWithLoadBalancer'
        },
        detach: {
            cli: 'deregister-instances-from-load-balancer',
            sdk: 'deregisterInstancesFromLoadBalancer'
        }
    };

    function register (action) {

        var taskName = 'ec2_elb_' + action;
        var capitalized = action[0].toUpperCase() + action.substr(1);
        var description = util.format('%s instances to an AWS ELB load balancer', capitalized);

        grunt.registerTask(taskName, description, function (name, elb) {
            conf.init(grunt);

            if (arguments.length === 0) {
                grunt.fatal([
                    'You should provide an instance name. ELB name parameter is optional.',
                    'e.g: ' + chalk.yellow(util.format('grunt %s:instance-name:elb-name?', taskName))
                ].join('\n'));
            }

            var cmd = map[action];
            var balancer = elb || conf('AWS_ELB_NAME');
            var names = _.toArray(arguments);
            var done = this.async();
            var params = {
                LoadBalancerName: balancer,
                Instances: [name]
            };

            grunt.log.writeln('%sing %s instances', capitalized, chalk.cyan(names.join(' ')));

            aws.log('aws elb %s --load-balancer-name %s --instances %s', cmd.cli, balancer, name);
            aws.elb[cmd.sdk](params, aws.capture('Done! Instance %sed.', action, done));
        });
    }

    register('attach');
    register('detach');
};
