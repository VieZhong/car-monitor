var monitorCtrls = angular.module('monitorCtrls', ['ui.grid','ui.grid.selection']);

monitorCtrls.controller("positionMonitor", ['$scope', '$http', '$log', function($scope, $http, $log) {

	
	$scope.curdeviceId = null;

	$http.get("data/getDevices.json")
		.success(function(response) {
			$scope.gridOptions.data = response;
		});

	$scope.gridOptions = {
		enableColumnMenus: false,
		enableSorting: false,
		enableHiding: false,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		multiSelect: false,
		columnDefs: [{ field: 'name' }, { field: 'online' }],
		onRegisterApi: function(gridApi){
	       	gridApi.selection.on.rowSelectionChanged($scope,function(row){
	       		$scope.curdeviceId = row.entity.id;
	       		$http.post('data/getGpsDatas.json',{id:$scope.curdeviceId}).
					success(function(data) {
						$scope.Map.addVerhicle(data);
						$scope.Map.showPath($scope.curdeviceId);
						$log.log($scope.Map.vehicles);
					});
	        });
       	}
	};

}]);

monitorCtrls.controller("statistics", ['$scope', function($scope) {

}]);

monitorCtrls.controller("deviceManagement", ['$scope', function($scope) {

}]);