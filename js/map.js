var BaiduMap = function(idName){

	this.map = new BMap.Map(idName);
	this.centerPoint = new BMap.Point(105.530519,36.967249);
	this.zoom = 5;
	this.vehicles = [];

	this.init = function(){ 
	    this.map.centerAndZoom(this.centerPoint, this.zoom);
	    this.map.enableScrollWheelZoom(true);  
		this.map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_LARGE}));
	}

	this.addVerhicle = function(newVehicle){
		var isExist = false;
		var i;
		for(i=this.vehicles.length-1;i>=0;i--){
			if(newVehicle.id==this.vehicles[i].id){
				isExist = true;
				break;
			}
		}
		if(isExist){
			this.vehicles[i] = new vehicle(this.map,newVehicle);
		}else{
			this.vehicles.push(new vehicle(this.map,newVehicle));
		}
	}

	this.showPath = function(id){
		for(var i=this.vehicles.length-1;i>=0;i--){
			if(id==this.vehicles[i].id){
				this.vehicles[i].drawPath();
				break;
			}
		}
	}

	this.playBack = function(id){
		
		for(var i=this.vehicles.length-1;i>=0;i--){
			if(id==this.vehicles[i].id){
				this.vehicles[i].playBack();
				break;
			}
		}
	}

	
}


var vehicle = function(_map,newVehicle){
	this.map = _map;
	this.name = newVehicle.name;
	this.id = newVehicle.id;
	this.datas = newVehicle.datas;
	this.beginMarker = null;
	this.endMarker = null;
	//this.pointArray = [];
	this.path = null;
	this.animatedPathArray = [];
	this.carMk = new BMap.Marker(this.map.centerPoint,{icon:new BMap.Icon("image/car.png", new BMap.Size(52, 26))});

	this.pointArray = function(loc){				
		this.pointArray = [];
	    for(var i=0;i<loc.length;i++){
	        this.pointArray.push(new BMap.Point(loc[i][0],loc[i][1]));
	    }
	    return this.pointArray;
	}(this.datas);

	this.drawPath = function(){

		this.map.setViewport(this.pointArray);
		this.map.removeOverlay(this.beginMarker);
		this.map.removeOverlay(this.endMarker);
		this.beginMarker = new BMap.Marker(this.pointArray[0],{title:"起点"});
		this.endMarker = new BMap.Marker(this.pointArray[this.pointArray.length-1],{title:"终点"});
		this.map.addOverlay(this.beginMarker);
		this.map.addOverlay(this.endMarker);

		this.map.removeOverlay(this.path);
		this.path = new BMap.Polyline(this.pointArray,{strokeColor:"green"});
		this.map.addOverlay(this.path);
	
	}

	this.playBack = function(){
		this.map.setViewport(this.pointArray);
		this.drawAnimatedLines(this.map,this.pointArray,"blue",this.carMk);
	}

	this.drawAnimatedLines = function(map,p_arr,lineColor,carMk){
        var i=0, pathArray = [];
        for(var j=this.animatedPathArray.length-1;j>=0;j--){
        	this.map.removeOverlay(this.animatedPathArray[j]);
        }
        
        drawPolyLine(p_arr[i],p_arr[i+1]);
        this.animatedPathArray = pathArray;

        function drawPolyLine(p_begin,p_end){
            var animating = null;
            var lng_len = p_end.lng - p_begin.lng,
            lat_len = p_end.lat - p_begin.lat,
            iv = 0, s = 30, p_old = p_begin; 		 
            line();
            function line(){
                if(iv>s){
                    clearTimeout(animating);
                    animating = null;
                    i++;
                    if( i < p_arr.length-1){
                        drawPolyLine(p_arr[i],p_arr[i+1]);
                    }
                }else{
                    var p_crr = new BMap.Point( p_old.lng+lng_len/s , p_old.lat+lat_len/s );
                    var sline = new BMap.Polyline([p_old,p_crr],{strokeColor:lineColor,strokeOpacity:0.8});
                    pathArray.push(sline);
                    map.addOverlay(sline);
                    
                    carMk.setPosition(p_crr);
                    carMk.setRotation(90);
					map.addOverlay(carMk);

					p_old = p_crr;
                    iv++;
                    animating = setTimeout(arguments.callee, 40);
                }
            }   
        }
    }
}