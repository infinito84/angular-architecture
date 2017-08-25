angular.module('test').controller('financialWidgetCtrl', [
	'$scope', 'growl', 'ajax', '$state', '$rootScope', '$timeout',

	function($scope, growl, ajax, $state, $rootScope, $timeout){

		$scope.time = Date.now();

		var load = function(){
			// Bars logic
			$scope.barWidth = (98 - ($scope.data.bars.length-1) * 2) / $scope.data.bars.length;
			$scope.barWidth2 = (90 - ($scope.data.info.appl.length-1) * 2) / $scope.data.info.appl.length;
			$timeout(function(){
				var svg = Snap('[ui-view=financial] svg');
				var path = 'M0,100 L ';
				var path2 = 'M1,100 L ';
				$scope.data.bars.forEach(function(bar, i){
					bar.factor = 1;
					path += parseInt((i+$scope.barWidth) * 4)+','+parseInt(100-bar.n)+' ';
					path2 += parseInt((i+$scope.barWidth) * 4)+','+parseInt(100-bar.n+5)+' ';
				})

				$scope.data.info.appl.forEach(function(bar, i){
					bar.factor = 1;
				})

				svg.path(path2).attr({
					stroke: 'rgba(70, 70, 70, 0.28)',
					strokeWidth: 2,
					fill : 'none'
				});

				svg.path(path).attr({
					stroke: '#fff',
					strokeWidth: 1.5,
					fill : 'none'
				});

			}, 50)
		}

		ajax({
			endpoint : '/json/financial.json',
			success : function(data){
				$scope.data = data;
				load();
			}
		})
	}
]);
