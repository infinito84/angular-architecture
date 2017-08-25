var app = angular.module('test', ['ui.router', 'angular-growl', 'pascalprecht.translate', 'ui.select']);


//Definimos templates
var templates = {}
for(var t in impactaTemplates){
	templates[t] = decodeURIComponent(impactaTemplates[t]);
}
app.value('templates', templates);


//Definimos routers
var config = function($stateProvider, $urlRouterProvider, growlProvider, $translateProvider) {

	$translateProvider
		.useStaticFilesLoader({
			prefix: '/locales/',
			suffix: '.json'
		})
		.registerAvailableLanguageKeys(['en', 'es'])
		.preferredLanguage('en')
		.useSanitizeValueStrategy('escapeParameters');

	$stateProvider.state({
		name: 'test',
		url: '/',
		views : {
			'' : {
				template : templates['test'],
				controller : 'testCtrl'
			},
			'financial@test' : {
				template : templates['financial-widget'],
				controller : 'financialWidgetCtrl'
			},
			'graphs@test' : {
				template : templates['graphs-widget'],
				controller : 'graphsWidgetCtrl'
			},
			'user@test' : {
				template : templates['user-widget'],
				controller : 'userWidgetCtrl'
			},
			'form@test' : {
				template : templates['form-widget'],
				controller : 'formWidgetCtrl'
			}
		}
	});

	$urlRouterProvider.otherwise('/');
	growlProvider.globalTimeToLive(5000);
}
config.$inject = ['$stateProvider', '$urlRouterProvider', 'growlProvider', '$translateProvider'];
app.config(config);
