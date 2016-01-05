var monitor = angular.module('monitorApp', ['ui.router','ui.bootstrap','monitorCtrls','monitorDirectives']);

monitor.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/PositionMonitor");

	$stateProvider
		.state("PositionMonitor",{
			url: "/PositionMonitor",
			templateUrl: "tpls/PositionMonitor.html",
			controller: 'positionMonitor'
		})
		.state("Statistics",{
			url: "/Statistics",
			templateUrl: "tpls/Statistics.html",
			controller: 'statistics'
		})
		.state("DeviceManagement",{
			url: "/DeviceManagement",
			templateUrl: "tpls/DeviceManagement.html",
			controller: 'deviceManagement'
		})
});

