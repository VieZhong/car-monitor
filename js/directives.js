var monitorDirectives = angular.module('monitorDirectives', []);

monitorDirectives.directive("baidumap",function(){
	return{
		restrict:'E',
		templateUrl: 'tpls/BaiduMap.html',
		replace: true,
		scope: false,
		link: function(scope){
			scope.Map = new BaiduMap("baidu_map");
			scope.Map.init();
		}
	};
})