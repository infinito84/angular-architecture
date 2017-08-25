module.exports = {
	uglify : true,

	map : require('./map'),

	modules : {
		test : [
			//Libraries
			'vendors/normalize-css',
			'vendors/jquery',
			'vendors/bootstrap',
			'vendors/angular',
			'commons/libs',
			'vendors/angular-ui-router',
			'vendors/angular-ui-select',
			'vendors/angular-growl-v2',
			'vendors/Snap.svg',
			//App
			'commons/sass',
			'applications/test',
			'commons/factories',
			'widgets/financial',
			'widgets/form',
			'widgets/graphs',
			'widgets/user',
			'views/test'
		]
	}
}
