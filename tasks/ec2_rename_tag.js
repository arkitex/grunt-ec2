'use strict';

var chalk = require('chalk');
var aws = require('./lib/aws.js');
var conf = require('./lib/conf.js');
var lookup = require('./lib/lookup.js');

module.exports = function (grunt) {

    grunt.registerTask('ec2_rename_tag', 'renames the associated name tag for an instance', function (name, newName) {
        conf.init(grunt);

        if (arguments.length < 2) {
            grunt.fatal([
                'You should provide an instance id.',
                'e.g: ' + chalk.yellow('grunt ec2_rename_tag:id')
            ].join('\n'));
        }

        grunt.log.writeln('Removing EC2 instance name tag from %s...', chalk.cyan(name));

        var done = this.async();
        lookup(name, function (instance) {
            var id = instance.InstanceId;

            var params = {
                Resources: [id],
                Tags: [{ Key: 'Name', Value: newName }]
            };

            aws.log('ec2 rename-tags --resources %s --tags Key=Name,Value=%s', id, newName);
            aws.ec2.createTags(params, aws.capture('Instance tagged as %s', newName, done));
        });


    });
};