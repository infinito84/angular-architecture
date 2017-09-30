var config = require('./config');
var async = require('async');
var fs = require('fs');
var watch = require('gulp-watch');
var gulp = require('gulp');
var notifier = require('node-notifier');

var modules = config.modules;

var process = function() {
    async.waterfall([
        function(callback) {
            callback(null, modules);
        },
        require('./build/filesToProcess'),
        require('./build/createFolders'),
        require('./build/generateSass'),
        require('./build/generateJavascripts'),
        require('./build/createStandardFiles')
    ], function(err, data) {
        if (err) console.error(err);
        console.log('------------');
        var apps = Object.keys(data).map(function(app) {
            return app + '@' + data[app].version;
        }).join(', ');
        notifier.notify({
            title: 'Se compilaron',
            message: apps
        });
    })
}

watch(['modules/**/*', 'modules.js'], process);
process();

require('./backend/index.js');
