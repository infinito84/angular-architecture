var async = require('async');
var fs = require('fs');
var sass = require('node-sass');
var dummies;
var files = ['current.js', 'index.html', 'manifest.appcache', 'fallback.js'];

module.exports = function(modules, callback){
	async.waterfall([
		function(callback){
			if(dummies) callback(null, dummies);
			else{
				async.map(files, function(file, callback){
					fs.readFile('./build/templates/'+ file, callback);
				}, function(err, data){
					dummies = data.map(function(d){
						return d.toString();
					});
					callback(null, dummies);
				});
			}
		},
		function(dummies, callback){
			async.each(Object.keys(modules), function(module, callback){
				async.map([0,1,2,3], function(n, callback){
					var d = dummies[n].replace(/{{version}}/g, modules[module].version);
					d = d.replace(/{{module}}/g, module);
					d = d.replace(/{{cache}}/g, modules[module].cache);
					fs.writeFile('./dist/'+ module + '/'+ files[n], d, callback);
				}, callback);
			}, callback);
		}
	], function(err, data){
		callback(null, modules);
	})
}
