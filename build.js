var config = require('./config');
var async = require('async');
var fs = require('fs');
var watch = require('gulp-watch');
var gulp = require('gulp');
var staticServer = require('static-server');
var notifier = require('node-notifier');

var modules = config.modules;
var logo = __dirname + '/dist/img/logo-ean.png';

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
            message: apps,
            icon: logo,
        });
    })
}

watch(['modules/**/*', 'modules.js'], process);
process();

var server = new staticServer({
    rootPath: './dist',
    name: 'SergioGNU',
    port: 8484
});

server.start(function() {
	notifier.notify({
		title: 'Impacta',
		message: 'Server listening to: '+ server.port,
		icon: logo,
	});
});
