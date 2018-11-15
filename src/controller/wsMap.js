layui.define([
	'admin',
	'layer',
	'laypage',
	'html5shiv',
	'maputil',
	'customUtil',
	'leaflet.ChineseTmsProviders',
	'leaflet-ant-path',
	'leaflet.groupedlayercontrol'
], function(exports) {
	var $ = layui.jquery,
		laypage = layui.laypage,
		layer = layui.layer,
		maputil = layui.maputil,
		customUtil = layui.customUtil;
	var resUrl = layui.setter.base + 'style/res';
	var getList = customUtil.getList,
		pageInit = customUtil.pageInit;
	var animationGroup = L.layerGroup([]);

	$(function() {
		initWindow();
		maputil.initGlobal();
		initMap();
		//maputil.initMapControl();
		//maputil.initMapEvent();
		initEvent();
		initAnimation();
	})

	function initAnimation() {
		L.esri.query({
			url: wsServer + "/0",
		}).where("1=1").run(function(error, result) {
			// debugger
			animationGroup.clearLayers();
			result.features.forEach(function(item) {
				route = item.geometry.coordinates;
				var coords = [];
				route.forEach(function(e, i) {
					// debugger
					coords.push(e.reverse())
				});

				var antPath = L.polyline.antPath;
				var path = antPath(coords, {
					"paused": false,
					"reverse": false,
					"delay": 3000,
					"dashArray": [10, 20],
					"weight": 5,
					"opacity": 1,
					"color": "#008FD6",
					"pulseColor": "#36F6FF"
				});
				path.addTo(animationGroup);

				var elements = document.getElementsByClassName("leaflet-ant-path");;
				var count = elements.length;
				for(var i = 0; i < count; i++) {
					var pathLength = elements[i].getTotalLength();
					elements[i].style.strokeDashoffset = pathLength;
					animateRoute(elements[i], pathLength);
				}
			});

		});

	}

	function animateRoute(e, len) {

		len -= 1; //每次偏移的位置
		if(len >= 1000) {
			//大于1000后重置初始偏移，重复运动
			len = -200;
		}
		//设置元素偏移
		e.style.strokeDashoffset = len;
		//10毫秒执行一次
		setTimeout(function() {
			animateRoute(e, len);
		}, 100);

	}

	function initWindow() {
		// 初始化 map_container div 的大小
		$('#map_container').height($(window).height() - 81);
		// 监听浏览器窗口发生变化时，动态调整div的尺寸
		$(window).resize(function() {
			$('#map_container').height($(window).height() - 81);
			map.invalidateSize(); //重置地图尺寸
		});
		// 初始化 panorama_container div 的大小
		$('#panorama_container').height($(window).height() - 81);
		// 监听浏览器窗口发生变化时，动态调整div的尺寸
		$(window).resize(function() {
			$('#panorama_container').height($(window).height() - 81);
			map.invalidateSize(); //重置地图尺寸
		});
	}

	function initMap() {
		/**  
		 * 智图地图内容  
		 */
		var normalm1 = L.tileLayer.chinaProvider('Geoq.Normal.Map', {
			maxZoom: 18,
			minZoom: 5
		});
		var normalm3 = L.tileLayer.chinaProvider('Geoq.Normal.PurplishBlue', {
			maxZoom: 18,
			minZoom: 5
		});
		//高德	
		var normalm = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
			maxZoom: 18,
			minZoom: 5
		});
		var normala = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
			maxZoom: 18,
			minZoom: 5
		});

		var gaode = L.layerGroup([normalm, normala]);

		vector = L.layerGroup([normalm, normala]);
		raster = L.layerGroup([imgm, imga]);

/*		var basemaps = {
			"高德地图": gaode,
			"智图藏蓝": normalm3
		};

		var groupedOverlays = {
			"专题图": {
				"污水": animationGroup,
				"汇水区域": wsWSC
			}
		}*/

		map = L.map('map_container', {
			zoomControl: false,
			attributionControl: false,
			doubleClickZoom: false,
			boxZoom: true,
			dragging: true,
			minZoom: 11,
			maxZoom: 16,
			maxBounds: bounds,
			layers: [ghserverLayerGD, normalm3, animationGroup, gw_bz, gw_wscl]
		}).setView([29.08948, 119.65279], 13);

		if(identifiedFeature) {
			map.removeLayer(identifiedFeature);
		}
	}

	function initEvent() {
		$(".dropdown-toggle").mouseover(function() {
			$(".dropdown").addClass("open");
			$(".fa-angle-down").css("transform", "rotate(180deg)");
		}).mouseout(function() {
			$(".dropdown").removeClass("open");
			$(".fa-angle-down").css("transform", "rotate(0deg)");
		})

		$(".positionRecord li,.positionLink li").on('click', function(e) {
			var lat = $(e.currentTarget).attr('lat');
			var lng = $(e.currentTarget).attr('lng');
			if(lat && lng) {
				markerGroup.clearLayers();
				var marker = L.marker([lat, lng]);
				// 点击marker后打开百度全景
				marker.on('click', function(e) {
					var ggPoint = new BMap.Point(lng, lat);
					//坐标转换完之后的回调函数
					translateCallback = function(data) {
						if(data.status === 0) {
							hideHomepage();
							// 打开全景
							var panorama = new BMap.Panorama('panorama_container', {
								navigationControl: false
							});
							panorama.setPosition(data.points[0]); //根据经纬度坐标展示全景图
							panorama.setPov({
								heading: -40,
								pitch: 6
							});
							$('.BMap_cpyCtrl').remove();
						}
					};
					setTimeout(function() {
						var convertor = new BMap.Convertor();
						var pointArr = [];
						pointArr.push(ggPoint);
						convertor.translate(pointArr, 1, 5, translateCallback)
					}, 1000);
				});
				markerGroup.addLayer(marker);
				map.setView([lat, lng], 18);
			} else {}
		});

		$('.searchInput').click(function() {
			$(".positionLink,.positionRecord").css('display', 'block');
			$(".result").css("display", "none");
		});

		$("#dlSearch").click(function() {

			$(".result").css("display", "block");
			$(".positionLink").css("display", "none");
			$(".positionRecord").css("display", "none");
			var road = $.trim($(".searchInput")[0].value);
			searchByRoad(road);

			//阻止事件冒泡
			event.stopPropagation();

			//标志result是否展开
			//result展开
			var flag_this = true;

			//获取result
			var result = $('.result');

		});

		//		map.on('click', function() {
		//			$(".positionLink,.positionRecord").css('display', 'none');
		//			$(".result").css("display", "none");
		//		});

		//图例控制
		var trun = 1;
		$(".Legendname").click(function() {
			if(trun) {
				$(".Legendcontent").css("display", "block");
				$(".shrink").css("background", "url('" + resUrl + "/sq.png') no-repeat");
				trun = 0;
			} else {
				$(".Legendcontent").css("display", "none");
				$('.shrink').css("background", "url('" + resUrl + "/zk.png') no-repeat");
				trun = 1;
			}
		})

		//图层控制
		var trun1 = 1;
		$(".Legendname1").click(function() {
			if(trun1) {
				$(".Legendcontent1").css("display", "none");
				$(".shrink1").css("background", "url('" + resUrl + "/zk.png') #092f75 2px 11px no-repeat");
				trun1 = 0;
			} else {
				$(".Legendcontent1").css("display", "block");
				$('.shrink1').css("background", "url('" + resUrl + "/sq.png') #092f75 2px 11px no-repeat");
				trun1 = 1;
			}
		})
		$('.shrink1').click(function(event) {
			if(trun1) {
				$(".Legendcontent1").css("display", "none");
				$(".shrink1").css("background", "url('" + resUrl + "/zk.png') #092f75 2px 11px no-repeat");
				trun1 = 0;
			} else {
				$(".Legendcontent1").css("display", "block");
				$('.shrink1').css("background", "url('" + resUrl + "/sq.png') #092f75 2px 11px no-repeat");
				trun1 = 1;
			}
		});
		$('.Legendcontent1 input:checkbox').on('click', function(e) {
			var el = e.target;
			var checked = el.checked;
			var value = el.value;
			switch(value) {
				case "汇水区域":
					if(!checked) {
						map.removeLayer(wsWSC);
					} else {
						map.addLayer(wsWSC);
					}
					break;
				case "泵站":
					if(!checked) {
						map.removeLayer(gw_bz);
					} else {
						map.addLayer(gw_bz);
					}
					break;
				case "污水处理厂":
					if(!checked) {
						map.removeLayer(gw_wscl);
					} else {
						map.addLayer(gw_wscl);
					}
					break;
				case "污水管线":
					if(!checked) {
						map.removeLayer(animationGroup);
					} else {
						map.addLayer(animationGroup);
						var elements = document.getElementsByClassName("leaflet-ant-path");;
						var count = elements.length;
						for(var i = 0; i < count; i++) {
							var pathLength = elements[i].getTotalLength();
							elements[i].style.strokeDashoffset = pathLength;
							animateRoute(elements[i], pathLength);
						}
					}
					break;
			}
		});

	}

	exports('wsMap', {})
})