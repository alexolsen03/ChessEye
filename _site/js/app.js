var app = angular.module("ChessEye", ['nywton.chess', 'ui.router', 'ngAnimate']);

app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/notation');

	$stateProvider

		.state('notation', {
			url: '/notation',
			templateUrl: '../ChessEye/partials/notation.html',
			controller: 'MainController'
		});

	$stateProvider

		.state('board', {
			url: '/board',
			templateUrl: '../ChessEye/partials/board.html',
			controller: 'BoardController'
		});
});