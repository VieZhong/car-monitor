var monitorCtrls = angular.module('monitorCtrls', ['ui.grid','ui.grid.selection']);

monitorCtrls.controller("positionMonitor", ['$scope', '$http','$interval', function($scope, $http, $interval) {

	$scope.curdeviceIndex = -1;
	$scope.curdeviceId = null;
	$scope.pbFlat = 'Stop';
	$scope.pageActive = true;
	$scope.realTimeInfo = "请选择一辆设备"
	$scope.getDataStatus;

	$scope.openRMPage = function(){
		if(!$scope.pageActive){
			$scope.pageActive = true;
			$scope.getLastData();
			$scope.updateLastData();
			/*为了防止切换至回放页面时，回放从中间段开始*/
			if($scope.curdeviceIndex >= 0){
				$scope.Map.vehicles[$scope.curdeviceIndex].pbFlat = false;
				$scope.Map.vehicles[$scope.curdeviceIndex].pbIndex = $scope.Map.vehicles[$scope.curdeviceIndex].pointArray.length-1;
			}
		}
	}
	
	$scope.getLastData = function(){
		$http.get('data/getLastData.json').
			success(function(data) {
				$scope.realTimeInfo = "状态："+data.status+"；定位时间："+data.deviceUtcDate+"；速度："+data.speed+"km/h"
				$scope.Map.clearOverlays();
				$scope.pbFlat = 'Stop';
				$scope.Map.addVerhicle(data,0);
				$scope.curdeviceIndex = $scope.Map.showPosition($scope.curdeviceId);
			});
	}

	$scope.updateLastData = function() {		
		if ( angular.isDefined($scope.getDataStatus) ) return;
		$scope.getDataStatus = $interval(function() {
			$scope.getLastData();
		}, 5000);
	};

	$scope.stopGetData = function() {
		if (angular.isDefined($scope.getDataStatus)) {
			$interval.cancel($scope.getDataStatus);
			$scope.getDataStatus = undefined;
		}
	};

	$scope.openPBPage = function(){
		if($scope.pageActive){
			$scope.pageActive = false;
			$scope.stopGetData();
			$scope.getGpsDatas();	
		}
	}

	$scope.getGpsDatas = function(){
		$http.get('data/getGpsDatas.json').
			success(function(data) {
				$scope.Map.clearOverlays();
				$scope.pbFlat = 'Stop';
				$scope.Map.addVerhicle(data,1);
				$scope.curdeviceIndex = $scope.Map.showPath($scope.curdeviceId);
			});
	}

	$scope.beginPlayBack = function(){
		$scope.pbFlat = 'Begin';
		$scope.Map.beginPlayBack($scope.curdeviceId,function(flat){$scope.$apply(function(){$scope.pbFlat = 'Stop';})});			
	}

	$scope.pausePlayBack = function(){
		$scope.pbFlat = 'Pause';
		$scope.Map.pausePlayBack($scope.curdeviceId);
	}

	$scope.stopPlayBack = function(){
		$scope.pbFlat = 'Stop';
		$scope.Map.stopPlayBack($scope.curdeviceId);
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
		columnDefs: [{ field: 'name' }, { field: 'status' }],
		onRegisterApi: function(gridApi){
	       	gridApi.selection.on.rowSelectionChanged($scope,function(row){
	       		$scope.curdeviceId = row.entity.id;
				if($scope.pageActive){
					$scope.getLastData();
					$scope.updateLastData();	
				}else{
					$scope.stopGetData();
					$scope.getGpsDatas();	
				}
	        });
       	}
	};

	$scope.$watch('pbFlat',function(){
		$scope.pbBegin = ('Begin'==$scope.pbFlat);
		$scope.pbPause = ('Pause'==$scope.pbFlat || 'Stop'==$scope.pbFlat);
		$scope.pbStop = ('Stop'==$scope.pbFlat);
	});

}]);

monitorCtrls.controller("statistics", ['$scope', function($scope) {

}]);

monitorCtrls.controller("deviceManagement", ['$scope', function($scope) {

}]);