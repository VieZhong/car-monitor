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

monitorDirectives.directive("datetimepicker",function(){
	return{
		restrict:'EA',
		template: '<input id="datetimepicker" ng-model="model" class="rightMar" type="text">',
		replace: true,
		scope: {
			model: '='
		},
		link: function(scope,elem,attr){
			jQuery.datetimepicker.setLocale('de');
		    elem.datetimepicker({
				i18n:{
					de:{
						months:[
						'一月','二月','三月','四月',
						'五月','六月','七月','八月',
						'九月','十月','十一月','十二月',
						]
					}
				},
				format:'Y-m-d h:m'
		    });
		    elem.attr("size",12);
		    elem.css("text-align","center");
		}
	};
})

monitorDirectives.directive("rangeslider",function(){
	return{
		restrict:'EA',
		template: '<input type="hidden" value="3" ng-model="pbSpeed"/>',
		replace: true,
		scope: false,
		link: function(scope,elem,attr){
			elem.jRange({
                from: 1,
                to: 5,
                step: 1,
                scale: [1,2,3,4,5],
                width: 150,
                showLabels: false,
				snap: true,
				onstatechange: function(value){scope.updatePBSpeed(value)}
            });
		}
	};
})