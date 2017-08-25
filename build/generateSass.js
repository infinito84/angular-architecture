var async = require('async');
var fs = require('fs');
var sass = require('node-sass');

module.exports = function(modules, callback){
	async.each(Object.keys(modules), function(module, callback){
		var css = '';
		var scss = '';
		async.map(modules[module].sass, function(file, callback){
			fs.readFile(file, function(err, data){
				if(err) console.error(file);
				if(file.indexOf('.css') !== -1) css += data.toString() + '\n\n';
				if(file.indexOf('.scss') !== -1) scss += data.toString() + '\n\n';
				callback(err);
			})
		}, function(err){
			if(err) console.error(err);
			var file = './dist/'+ module + '/'+ modules[module].version + '/'+ module + '.css';
			sass.render({
				data : scss
			}, function(err, result){
				if(err) console.error(err);
				result && (css += result.css);
				fs.writeFile(file, css, callback);
			});
		});
	}, function(err, data){
		callback(null, modules);
	})
}
