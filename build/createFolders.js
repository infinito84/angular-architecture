var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
var fsExtra = require('fs-extra');

module.exports = function(modules, callback){
	async.each(Object.keys(modules), function(module, callback){
		async.waterfall([
			function(callback){
				mkdirp('./dist/'+ module, callback);
			},
			function(err, callback){
				fs.readdir('./dist/'+ module, callback);
			},
			function(files, callback){
				var n = 1;
				files.forEach(function(file){
					if(file.indexOf('v') === 0){
						n = parseInt(file.substr(1)) + 1;
						fsExtra.remove('./dist/'+ module +'/'+ file);
					}
				});
				callback(null, n);
			},
			function(n, callback){
				modules[module].version = 'v'+n;
				mkdirp('./dist/'+ module +'/v'+n, callback);
			}
		], function(){
			callback();
		})
	}, function(){
		callback(null, modules);
	})
}