var monitorCtrls = angular.module('monitorCtrls', ['ui.grid','ui.grid.selection']);

monitorCtrls.controller("positionMonitor", ['$scope', '$http', '$log', function($scope, $http, $log) {

	$scope.curdeviceIndex = -1;
	$scope.curdeviceId = null;
	$scope.pbFlat = false;
	$scope.playBack = function(){
		$scope.pbFlat = true;
		$scope.Map.playBack($scope.curdeviceId,function(flat){$scope.$apply(function(){$scope.pbFlat = flat})});
	}

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
	       		$http.get('data/getGpsDatas.json').
					success(function(data) {
						$scope.Map.clearOverlays();
						$scope.pbFlat = false;
						$scope.Map.addVerhicle(data);
						$scope.curdeviceIndex = $scope.Map.showPath($scope.curdeviceId);
					});
	        });
       	}
	};

}]);

monitorCtrls.controller("statistics", ['$scope', function($scope) {

}]);

monitorCtrls.controller("deviceManagement", ['$scope', function($scope) {

}]);