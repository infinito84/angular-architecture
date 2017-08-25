angular.module('test').controller('graphsWidgetCtrl', [
	'$scope', 'growl', 'ajax', '$state', '$timeout', 'growl', '$translate', 

	function($scope, growl, ajax, $state, $timeout, growl, $translate){

		$scope.noYet = function(){
			growl.warning('Not implemented yet')
		}

		$scope.lang = 'en';
		$scope.setLang = function(lang){
			$scope.lang = lang;
			$translate.use(lang);
		}

		var load = function(){
			$timeout(function(){
				var svg = Snap('[ui-view=graphs] svg');

				var total = 0;
				$scope.data.graph.forEach(function(el){
					var temp = total;
					var temp2 = total;
					var end = total + el.n;
					var a = 360*total/100;
					var ar = Math.PI*(a) / 180;
					var y1 = (50 - 37 * Math.cos(ar)).toFixed(2);
					var x1 = (50 + 37 * Math.sin(ar)).toFixed(2);

					var path1 = 'M'+x1+','+y1+' A37,37 0 '+ (360*el.n/100 > 180 ? 1 : 0) +',1 '+x1+','+y1;

					var arc = svg.path(path1).attr({
						stroke: el.color,
						strokeWidth: 20,
						fill : 'none',
						cursor : 'pointer'
					}).mouseover(function(){
						arc.attr({strokeWidth: 25});
					}).mouseout(function(){
						arc.attr({strokeWidth: 20});
					}).click(function(){
						growl.success('Value: '+el.n+'%');
					})


					var getPath2 = function(){
						var b = 360*(temp)/100;
						var br = Math.PI*(b) / 180;
						var y2 = (50 - 37 * Math.cos(br)).toFixed(2);
						var x2 = (50 + 37 * Math.sin(br)).toFixed(2);
						return 'M'+x1+','+y1+' A37,37 0 '+ (360*(temp - temp2)/100 > 180 ? 1 : 0) +',1 '+x2+','+y2;
					}

					var animate = function(){
						temp++;
						arc.attr({d: getPath2()});
						if(temp < end) setTimeout(animate, 10);
					}

					setTimeout(animate, 1000*total/100);
					total += el.n;
				});
			}, 50);
		}

		ajax({
			endpoint : '/json/graph.json',
			success : function(data){
				$scope.data = data;
				load();
			}
		})
	}
]);
