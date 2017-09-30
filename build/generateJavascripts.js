var async = require('async');
var fs = require('fs');
var sass = require('node-sass');
var UglifyJS = require("uglify-js");
var config = require('../config');

module.exports = function(modules, callback){
	async.each(Object.keys(modules), function(module, callback){
		async.waterfall([
			function(callback){
				var obj = {};
				async.map(modules[module].templates, function(file, callback){
					fs.readFile(file, function(err, data){
						obj[file.split('/').pop().split('.')[0]] = encodeURIComponent(data.toString());
						callback(null)
					})
				}, function(err, data){
					callback(null, JSON.stringify(obj));
				});
			},
			function(templates, callback){
				async.map(modules[module].js, function(file, callback){
					fs.readFile(file, function(err, data){
						if(err) console.error(err);
						var js = data.toString();
						var positions = file.indexOf('vendors/') + file.indexOf('libs/');
						if(positions !== -2) callback(null, js);
						else{
							if(!config.uglify) return callback(null, js);
							var result = UglifyJS.minify(js);
							if(result.error) {
								result.error.filename = file;
								console.error(result.error);
							}
							callback(null, result.code);
						}

					})
				}, function(err, data){
					var js = 'var impactaTemplates = '+ templates +';\n';
					data.forEach(function(d){
						js += d +'\n';
					})
					var file = './dist/'+ module + '/'+ modules[module].version + '/'+ module + '.js';
					fs.writeFile(file, js, callback);
					file = './dist/'+ module + '/fallback/'+ module + '.js';
					fs.writeFile(file, js, function(){});
				});
			}
		], callback)
	}, function(err, data){
		callback(null, modules);
	})
}
