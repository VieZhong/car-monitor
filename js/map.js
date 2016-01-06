var animating = null;  //动画setimeout
var BaiduMap = function(idName){

	this.map = new BMap.Map(idName);
	this.centerPoint = new BMap.Point(105.530519,36.967249);
	this.vehicles = [];

	this.init = function(){ 
	    this.map.centerAndZoom(this.centerPoint, 5);
	    this.map.enableScrollWheelZoom(true);  
		this.map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_LARGE}));
	}

	this.clearOverlays = function(){
		animating && clearTimeout(animating);
		animating = null;
		this.map.clearOverlays();
	}

	this.addVerhicle = function(newVehicle,type){
		var isExist = false;
		var i;
		for(i=this.vehicles.length-1;i>=0;i--){
			if(newVehicle.id==this.vehicles[i].id){
				isExist = true;
				break;
			}
		}
		if(isExist){
			this.vehicles[i].updateData(newVehicle,type);
		}else{
			this.vehicles.push(new vehicle(this.map,newVehicle,type));
		}
	}

	this.showPosition = function(id){
		this.map.clearOverlays();
		this.map.setZoom(9);
		for(var i=this.vehicles.length-1;i>=0;i--){
			if(id==this.vehicles[i].id){
				this.vehicles[i].showPosition();
				return i;
			}
		}
		return -1;
	}

	this.showPath = function(id){
		for(var i=this.vehicles.length-1;i>=0;i--){
			if(id==this.vehicles[i].id){
				this.vehicles[i].drawPath();
				return i;
			}
		}
		return -1;
	}

	this.beginPlayBack = function(id,callback){
		
		for(var i=this.vehicles.length-1;i>=0;i--){
			if(id==this.vehicles[i].id){
				this.vehicles[i].playBack(callback);
				break;
			}
		}
	}

	this.pausePlayBack = function(id){
		animating && clearTimeout(animating);
		animating = null;

		for(var i=this.vehicles.length-1;i>=0;i--){
			if(id==this.vehicles[i].id){
				this.vehicles[i].pausePlayBack();
				break;
			}
		}
	}

	this.stopPlayBack = function(id){
		animating && clearTimeout(animating);
		animating = null;

		for(var i=this.vehicles.length-1;i>=0;i--){
			if(id==this.vehicles[i].id){
				this.vehicles[i].stopPlayBack();
				break;
			}
		}
	}
	
}


var vehicle = function(_map,newVehicle,type){
	this.map = _map;
	this.name = newVehicle.name;
	this.id = newVehicle.id;	
	this.beginMarker = null;
	this.endMarker = null;
	this.path = null;
	this.animatedPathArray = [];
	this.carMk = new BMap.Marker(this.map.centerPoint,{icon:new BMap.Icon("image/car.png", new BMap.Size(52, 26))});
	this.pbFlat = false;
	this.pbIndex = 0;
	this.pbStayTimes = 0;
	this.stayMkArray = [];

	this.curData = function(newVehicle,type){
		if(type==0){
			return [newVehicle.baiduLng,newVehicle.baiduLat,newVehicle.speed,newVehicle.deviceUtcDate,newVehicle.status,newVehicle.distance];
		}
		return null;
	}(newVehicle,type);

	this.datas = function(newVehicle,type){
		if(type==1){
			return newVehicle.datas;
		}
		return [];
	}(newVehicle,type);

	this.pointArray = function(loc,type){
		if(type==1){				
			var pointArray = [];
		    for(var i=0;i<loc.length;i++){
		        pointArray.push(new BMap.Point(loc[i][1],loc[i][0]));
		    }
		    console.log(pointArray);
		    return pointArray;
		}
	    return [];
	}(this.datas,type);

	this.updateData = function(newVehicle,type){
		this.name = newVehicle.name;
		if(type==1){
			this.pointArray = [];
		    for(var i=0;i<newVehicle.datas.length;i++){
		        this.pointArray.push(new BMap.Point(newVehicle.datas[i][1],newVehicle.datas[i][0]));
		    }
		    this.datas = newVehicle.datas;
	    }else{
	    	this.curData = [newVehicle.baiduLng,newVehicle.baiduLat,newVehicle.speed,newVehicle.deviceUtcDate,newVehicle.status,newVehicle.distance];
	    }
	}

	this.showPosition = function(){
		var curPoint = new BMap.Point(this.curData[0],this.curData[1]);
		this.map.setCenter(curPoint);

		this.carMk.setPosition(curPoint);
        this.carMk.setRotation(-90);
		this.map.addOverlay(this.carMk);

		var opts = {
			width : 180,     // 信息窗口宽度
			height: 80,     // 信息窗口高度
			title : this.name
		}
		var infoString = "状态："+this.curData[4]+"<br>定位时间："+this.curData[3]+"<br>速度："+this.curData[2]+"km/h";
		var rmInWdn = new BMap.InfoWindow(infoString, opts);  // 创建信息窗口对象 
		this.carMk.addEventListener("click", function(){          
			this.map.openInfoWindow(rmInWdn,curPoint); //开启信息窗口
		});
	}

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

		this.carMk.setPosition(this.pointArray[0]);
        this.carMk.setRotation(135);
		this.map.addOverlay(this.carMk);
	
	}

	this.playBack = function(callback){
		this.pbFlat = true;
		if(this.pbIndex == this.pointArray.length-1){
			this.map.setViewport(this.pointArray);
			this.pbIndex = 0;
			for(var j=this.animatedPathArray.length-1;j>=0;j--){
	        	this.map.removeOverlay(this.animatedPathArray[j]);
	        }
			this.animatedPathArray = [];

			for(var j=this.stayMkArray.length-1;j>=0;j--){
	        	this.map.removeOverlay(this.stayMkArray[j]);
	        }
	        this.stayMkArray = [];
		}
		this.carMk.setZIndex(999);
		this.drawAnimatedLines("blue",callback);
	}

	this.stopPlayBack = function(){
		this.pbFlat = false;
		for(var j=this.animatedPathArray.length-1;j>=0;j--){
        	this.map.removeOverlay(this.animatedPathArray[j]);
        }
        this.animatedPathArray = [];

        for(var j=this.stayMkArray.length-1;j>=0;j--){
        	this.map.removeOverlay(this.stayMkArray[j]);
        }
        this.stayMkArray = [];

        this.pbIndex = 0;

        this.carMk.setPosition(this.pointArray[0]);
        this.carMk.setRotation(135);
	}

	this.pausePlayBack = function(){
		this.pbFlat = false;
	}

	this.drawAnimatedLines = function(lineColor,callback){
        
        drawPolyLine(this.pointArray[this.pbIndex],this.pointArray[this.pbIndex+1],this,callback);

        function drawPolyLine(p_begin,p_end,this_vehicle,callback){
            var lng_len = p_end.lng - p_begin.lng,
            lat_len = p_end.lat - p_begin.lat,
            iv = 0, s = 6, p_old = p_begin; 

            //判断是否停留
            if(this_vehicle.pbStayTimes == 0){		            
	            while(this_vehicle.pbIndex+this_vehicle.pbStayTimes < this_vehicle.datas.length-1 && this_vehicle.datas[this_vehicle.pbIndex+this_vehicle.pbStayTimes][2]<1){	            	
	            	this_vehicle.pbStayTimes++;
	            }
	            if(this_vehicle.pbStayTimes>4){
	            	var stayMk = new BMap.Marker(p_begin,{icon:new BMap.Icon("image/stop.png", new BMap.Size(39, 56),{    //小车图片
						anchor: new BMap.Size(20, 50)
	  				})});
	            	this_vehicle.map.addOverlay(stayMk);
	            	this_vehicle.stayMkArray.push(stayMk);
	            }

	        }else{
	        	this_vehicle.pbStayTimes--;
	        }

            line();

            function line(){
                if(iv>s){
                    clearTimeout(animating);
                    animating = null;
                    this_vehicle.pbIndex++;
                    if( this_vehicle.pbIndex < this_vehicle.pointArray.length-1){
                        drawPolyLine(this_vehicle.pointArray[this_vehicle.pbIndex],this_vehicle.pointArray[this_vehicle.pbIndex+1],this_vehicle,callback);                       
                    }else{
                    	this_vehicle.pbFlat = false;
                    	callback(this_vehicle.pbFlat);
                    }
                }else{
                    var p_crr = new BMap.Point( p_old.lng+lng_len/s , p_old.lat+lat_len/s );
                    var sline = new BMap.Polyline([p_old,p_crr],{strokeColor:lineColor,strokeOpacity:0.8});
                    this_vehicle.animatedPathArray.push(sline);
                    this_vehicle.map.addOverlay(sline);
                    
                    this_vehicle.carMk.setPosition(p_crr);
                    this_vehicle.carMk.setRotation(135);

					p_old = p_crr;
                    iv++;
                    animating = setTimeout(arguments.callee, 40);
                }
            }   
        }
    }
}