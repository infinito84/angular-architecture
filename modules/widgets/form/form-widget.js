angular.module('test').controller('formWidgetCtrl', [
	'$scope', 'growl', 'ajax', '$state', '$rootScope', '$interval',

	function($scope, growl, ajax, $state, $rootScope, $interval){

		$scope.emails = [
			'infinito84@gmail.com',
			'sanustes@unal.edu.co'
		];

		$scope.data = {};

		$scope.doSubmit = function(){
			$scope.submit = true;
			if($scope.data.contacts.length && $scope.data.subject && $scope.data.message){
				$scope.data.contacts = [];
				$scope.data.subject = '';
				$scope.data.message = '';
				$scope.submit = false;
				growl.success('Ok');
			}
		}
	}
]);
