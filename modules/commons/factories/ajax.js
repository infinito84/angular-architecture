//  ajax.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('test').factory('ajax', [
	'$http', 'growl', '$rootScope',

	function($http, growl, $rootScope){
		var online = navigator.onLine;
		var urlServices = '';
        var fingerprint = null;
		var suscribedFunction = null;
		var started = 0;
		var ended = 0;
		var notifyTimeout = 0;

		var notifyEnd = function(){
			ended++;
			clearTimeout(notifyTimeout);
			notifyTimeout = setTimeout(function(){
				if(ended === started){
					if($rootScope.ajaxListener){
						$rootScope.ajaxListener();
					}
					delete $rootScope.ajaxListener;
				}
			});
		}

		document.addEventListener("offline", function(){
			online = false;
		}, false);
		document.addEventListener("online", function(){
			online = true;
		}, false);

		var validateOptions = function(options, callback){
			var f = function(){};
			options.success = options.success || f;
			options.error = options.error || f;
			options.complete = options.complete || f;
			options.method = options.method || 'GET';
			options.responseType = options.responseType || 'json';
			options.data = options.data || {};
			options.headers = options.headers || {};
			if(options.showError === undefined) options.showError =true;
			if(options.loading === undefined) options.loading = true;
            if(!options.url){
                options.url = urlServices + options.endpoint;
            }
            options.url += '?_timestamp=' +Date.now();
			if(options.optionalData){
				for(var attr in options.optionalData){
					if(options.optionalData[attr]){
						options.data[attr] = options.optionalData[attr];
					}
				}
			}
            if(options.method === 'GET' && jQuery && Object.keys(options.data || {}).length){
                options.url += '&'+ jQuery.param(options.data);
                options.data = {};
            }
            if(options.getData){
                options.url += '&'+ jQuery.param(options.getData);
            }
            if(options.sign){
                var sign = function(){
                    if(localStorage.token){
                        options.headers.Authorization = 'Bearer '+localStorage.token;
                        options.headers.Signature = CryptoJS.MD5(fingerprint+localStorage.token+options.endpoint).toString();
                    }
                    else{
                        options.headers.Signature = fingerprint;
                    }
                    callback();
                }
                if(fingerprint) sign();
                else{
					fingerprint = CryptoJS.MD5(new ClientJS().getFingerprint()).toString();
                    sign();
                }
            }
			else callback();
		}

		var request = function(options){
			online = navigator.onLine

			var controlledError = function (response) {
				notifyEnd();
				if(response.status === 401){
					localStorage.error = response.data.message;
					return location.href = '../auth/';
				}
				if(options.showError){
					if(response.xhrStatus === 'timeout' || response.status === -1 || response.xhrStatus === 'abort'){
						growl.error('Parece que no tienes conexión a internet.');
					}
					else if(response.data && response.data.error){
						var msg = response.data.message;
						growl.error(msg);
					}
					else growl.error('Ha ocurrido un error, por favor intente más tarde.');
				}
				options.error.apply({}, [].slice.call(arguments));
				options.complete.apply({}, [{}]);
			}

			if(online && navigator.onLine){
				var params = {
					method: options.method,
					url: options.url,
					data : options.data,
					headers : options.headers,
					responseType : options.responseType
				};
				if(options.timeout) params.timeout = options.timeout;
				if(options.file || options.isMultipart){
					var fd = new FormData();
					if(options.file) fd.append(options.fileKey || 'file', options.file, options.filename);
					for(var attr in options.data){
						fd.append(attr, options.data[attr]);
					}
					params.data = fd;
					params.transformRequest = angular.identity;
					options.headers['Content-Type'] = undefined;
				}
				$http(params).then(function(response){
                    if(response.data.token) localStorage.token = response.data.token;
					if(response.data.error){
						return controlledError.apply({}, [response]);
					}
					options.success.apply({}, [response.data, response]);
					options.complete.apply({}, [{}]);
					notifyEnd();
				}, controlledError);
			}
			else{
				if(options.showError){
					growl.error('Check your internet connection.');
				}
				options.error.apply({}, [{}]);
				options.complete.apply({}, [{}]);
			}
		}
		var previousOptions = '';
		var previousTime = new Date().getTime();
		return function(options){
			var opts = JSON.stringify(options);
			var t = new Date().getTime();
			if(opts === previousOptions && t - previousTime < 1000 && !options.doDuplicates) return;
			started++;
			previousOptions = opts;
			previousTime = t;

			validateOptions(options, function(){
                request(options);
            });
		}
	}
]);
