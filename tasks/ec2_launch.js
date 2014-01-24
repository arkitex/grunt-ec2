'use strict';

var chalk = require('chalk');
var conf = require('./lib/conf.js');

module.exports = function (grunt) {

    grunt.registerTask('ec2_launch', 'Creates a new instance, giving it a key-pair, a name tag, and an IP. Then sets it up', function (name) {
        conf.init(grunt);

        grunt.log.writeln('Queuing creation tasks for instance %s...', chalk.cyan(name));

        var tasks = [
            'ec2_create_keypair:' + name,
            'ec2_run_instance:' + name,
            'ec2_wait:' + name,
            'ec2_setup:' + name
        ];
        if (conf('EXISTING_SSH_KEY_NAME'))
            tasks = [
                'ec2_run_instance:' + name,
                'ec2_wait:' + name,
                'ec2_setup:' + name
            ];


        grunt.task.run(tasks);
    });
};
