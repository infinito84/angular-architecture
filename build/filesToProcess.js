var async = require('async');
var fs = require('fs');
var config = require('../config');

module.exports = function(modules, callback){
	var modulesObj = {};
	async.map(Object.keys(modules), function(module, callback){
		var obj = modulesObj[module] = {
			sass : [],
			templates : [],
			js : [],
			cache : null
		};
		async.map(config.modules[module], function(module, callback){
			if(config.map[module]) {
				callback(null, config.map[module].map(function(file){
					return module +'/'+file;
				}));
			}
			else{
				fs.readdir('./modules/'+ module, function(err, files){
					if(err) console.error(err);
					callback(err, (files || []).map(function(file){
						return module +'/'+file;
					}))
				});
			}
		}, function(err, files){
			files.forEach(function(files){
				files.forEach(function(file){
					if(file.indexOf('.scss') !== -1 || file.indexOf('.css') !== -1) obj.sass.push('./modules/'+ file);
					else if(file.indexOf('.js') !== -1) obj.js.push('./modules/'+ file);
					else if(file.indexOf('.html') !== -1) obj.templates.push('./modules/'+ file);
					else if(file.indexOf('appcache') !== -1) obj.cache = './modules/'+ file;
				});
			})
			callback();
		})
	}, function(){
		async.map(Object.keys(modulesObj), function(module, callback){
			module = modulesObj[module];
			if(!module.cache) callback();
			else{
				fs.readFile(module.cache, function(err, data){
					if(err) console.error(err);
					module.cache = data.toString();
				})
				callback();
			}
		}, function(){
			callback(null, modulesObj);
		});
	})
}