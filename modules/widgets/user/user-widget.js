angular.module('test').controller('userWidgetCtrl', [
	'$scope', 'growl', 'ajax', '$state', '$rootScope', '$interval',

	function($scope, growl, ajax, $state, $rootScope, $interval){

		ajax({
			endpoint : '/json/user.json',
			success : function(data){
				$scope.data = data;
			}
		})

		$scope.doView = function(){
			if($scope.view){
				$scope.data.views--;
				$scope.view = false;
			}
			else{
				$scope.data.views++;
				$scope.view = true;
			}
		}

		$scope.doComment = function(){
			if($scope.comment){
				$scope.data.comments--;
				$scope.comment = false;
			}
			else{
				$scope.data.comments++;
				$scope.comment = true;
			}
		}

		$scope.doLike = function(){
			if($scope.like){
				$scope.data.likes--;
				$scope.like = false;
			}
			else{
				$scope.data.likes++;
				$scope.like = true;
			}
		}
	}
]);
