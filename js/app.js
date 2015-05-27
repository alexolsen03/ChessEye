var app = angular.module("ChessEye", ['nywton.chess', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/notation');

	$stateProvider

		.state('notation', {
			url: '/notation',
			templateUrl: '/partials/notation.html',
			controller: 'MainController'
		});

	$stateProvider

		.state('board', {
			url: '/board',
			templateUrl: '/partials/board.html',
			controller: 'BoardController'
		});
});