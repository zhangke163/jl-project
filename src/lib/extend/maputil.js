layui.define(['leaflet',
	'esri-leaflet',
	'L.Control.BetterScale',
	'L.Control.MousePosition',
	'mouse-position',
	'leaflet.draw',
	'proj4',
	'proj4leaflet',
	'leaflet-measure',
	'expData'
], function(exports) {
	var $ = layui.jquery;
	expData = layui.expData;
	var standardLevel = 14;
	var hotOption = {
		min: 100,
		max: 350,
		palette: {
			0.0: '#008800',
			0.5: '#ffff00',
			1.0: '#ff0000'
		},
		weight: 30,
		outlineColor: '#000000',
		outlineWidth: 0
	}

	var popupArr = [];
	//点击管线或者管点的弹出框
	var pipePopup = null;

	function _initGlobal() {
		map = null;

		//街道全景状态
		baiduFlag = false;
		//井盖图片网站
		imageHref = layui.setter.ip.imageHref;
		//管线视频网站
		videoSrc = layui.setter.ip.videoSrc;
		//后台api服务器
		backUrl = layui.setter.ip.backUrl;
		//地图管线管网列表
		pipeUrl = layui.setter.ip.pipeUrl;
		//金华排水分级服务
		//		mapServer = 'http://localhost:6080/arcgis/rest/services/JHPS/Default20180706/MapServer';
		mapServer = layui.setter.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/金华排水分级/MapServer';
		//规划数据
		ghServerTDT = layui.setter.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/jhzxqydgh_tdt/MapServer';
		ghServerGD = layui.setter.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/jhzxqydgh_gd/MapServer';
		//干管服务
		wsServer = layui.setter.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/金华市区污水干管/MapServer';
		//路网服务
		roadServer = layui.setter.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/JHLW/MapServer';
		//金华切片服务
		normalmUrl = layui.setter.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/JHJT/MapServer';
		normalaUrl = layui.setter.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/JHJTBZ/MapServer';
		imgmUrl = layui.setter.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/JHYX/MapServer';
		imgaUrl = layui.setter.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/JHYXBZ/MapServer';
		//街道全景图层
		baiduServer = layui.setter.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/baidu/MapServer';
		//污水干网
		wsggServer = layui.setter.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/jhwsgg/MapServer';
		resUrl = layui.setter.base + 'style/res';
		crs = new L.Proj.CRS("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs", {
			resolutions: [
				1.40625,
				0.703125,
				0.3515625,
				0.17578125,
				0.087890625,
				0.0439453125,
				0.02197265625,
				0.010986328125,
				0.0054931640625,
				0.00274658203125,
				0.001373291015625,
				6.866455078125E-4,
				3.4332275390625E-4,
				1.71661376953125E-4,
				8.58306884765625E-5,
				4.291534423828125E-5,
				2.1457672119140625E-5,
				1.0728836059570312E-5,
				5.364418029785156E-6,
				2.682209064925356E-6,
				1.3411045324626732E-6
			],
			origin: [-179.9999, 90.00016],
			bounds: L.bounds([117.75370429660006, 26.99449191557761, ], [123.63262097540007, 32.2668788575695])
		});
		bounds = L.latLngBounds(L.latLng(29.23306, 119.36072), L.latLng(28.92991, 119.94332));

		YilaodianIcon = L.Icon.extend({
			options: {
				iconSize: [20, 20]
			}
		});
		yld_greenIcon1 = new YilaodianIcon({
				iconUrl: resUrl + '/易涝点-有设备正常.png'
			}),
			yld_redIcon1 = new YilaodianIcon({
				iconUrl: resUrl + '/易涝点-有设备报警.png'
			}),
			yld_yellowIcon1 = new YilaodianIcon({
				iconUrl: resUrl + '/易涝点-有设备预警.png'
			}),
			yld_greenIcon0 = new YilaodianIcon({
				iconUrl: resUrl + '/易涝点-无设备正常.png'
			}),
			yld_redIcon0 = new YilaodianIcon({
				iconUrl: resUrl + '/易涝点-无设备报警.png'
			}),
			yld_yellowIcon0 = new YilaodianIcon({
				iconUrl: resUrl + '/易涝点-无设备正常.png'
			});

		//流量,geojson数据	
		ll_greenIcon = new YilaodianIcon({
				iconUrl: resUrl + '/流量计-正常.png'
			}),
			ll_redIcon = new YilaodianIcon({
				iconUrl: resUrl + '/流量计-报警.png'
			}),
			ll_yellowIcon = new YilaodianIcon({
				iconUrl: resUrl + '/流量计-预警.png'
			});
		liuliang = L.geoJSON(expData.liuliang, {
			pointToLayer: function(feature, latlng) {
				return L.marker(latlng, {
					icon: ll_greenIcon,
					id: feature.properties.id
				});
			},
			onEachFeature: function(feature, layer) {
				if(feature.properties && feature.properties.name) {
					// popupContent = feature.properties.name;
					popupContent = `<div class="pop-html">
														<div class="pop-right">
															<div class="pop-left">
																<div class="left-content">
																	<div class="svg-box">
																		<img src="../src/style/res/svg/flow.svg">
																	</div>
																	<div class="monitor-type">流量监测点</div>
																</div>
															</div>
															<div class="monitor-site">
																<a href="javascript:void(0);">
																	<span>${feature.properties.name}</span>
																	<span class="icon-box"><i class="layui-icon layui-icon-right" style="height:12px;display:inline-block;position:relative;top:-1px;font-size: 12px; color: #fff;"></i></span>
																</a>
															</div>
															<div class="show-data">
																<div class="data-float">
																	<div class="data-name">待接入<span class="unit"></span></div>
																	<div class="data-value">null</div>
																</div>
															</div>
															<div class="svg-img">
																<img src="../src/style/res/svg/flow.svg">
															</div>
														</div>
													</div>`;
				}
				layer.bindPopup(popupContent);
			}
		});
		//水质监测,geojson数据
		sz_greenIcon = new YilaodianIcon({
				iconUrl: resUrl + '/水质监测-正常.png'
			}),
			sz_redIcon = new YilaodianIcon({
				iconUrl: resUrl + '/水质监测-报警.png'
			}),
			sz_yellowIcon = new YilaodianIcon({
				iconUrl: resUrl + '/水质监测-预警.png'
			});
		shuizhi = L.geoJSON(expData.shuizhi, {
			pointToLayer: function(feature, latlng) {
				return L.marker(latlng, {
					icon: sz_greenIcon,
					id: feature.properties.id
				});
			},
			onEachFeature: function(feature, layer) {
				if(feature.properties && feature.properties.name) {
					// popupContent = feature.properties.name;
					popupContent = `<div class="pop-html">
														<div class="pop-right">
															<div class="pop-left">
																<div class="left-content">
																	<div class="svg-box">
																		<img src="../src/style/res/svg/flood.svg">
																	</div>
																	<div class="monitor-type">水质监测点</div>
																</div>
															</div>
															<div class="monitor-site">
																<a href="javascript:void(0);">
																	<span>${feature.properties.name}</span>
																	<span class="icon-box"><i class="layui-icon layui-icon-right" style="height:12px;display:inline-block;position:relative;top:-1px;font-size: 12px; color: #fff;"></i></span>
																</a>
															</div>
															<div class="show-data">
																<div class="data-float">
																	<div class="data-name">待接入<span class="unit"></span></div>
																	<div class="data-value">null</div>
																</div>
															</div>
															<div class="svg-img">
																<img src="../src/style/res/svg/flood.svg">
															</div>
														</div>
													</div>`;
				}
				layer.bindPopup(popupContent);
			}
		});
		//
		jcp = L.layerGroup([liuliang, shuizhi]);

		//液位计			
		YeweijiIcon = L.Icon.extend({
			options: {
				iconSize: [20, 20]
			}
		});
		ywj_greenIcon = new YeweijiIcon({
				iconUrl: resUrl + '/液位计-正常.png'
			}),
			ywj_redIcon = new YeweijiIcon({
				iconUrl: resUrl + '/液位计-报警.png'
			}),
			ywj_yellowIcon = new YeweijiIcon({
				iconUrl: resUrl + '/液位计-预警.png'
			});

		ywj = L.geoJSON(expData.yeweiji, {
			pointToLayer: function(feature, latlng) {
				return L.marker(latlng, {
					icon: ywj_greenIcon,
					id: feature.properties.id
				});
			},

			onEachFeature: function(feature, layer) {
				if(feature.properties && feature.properties.name) {
					// popupContent = feature.properties.name;
					popupContent = `<div class="pop-html">
														<div class="pop-right">
															<div class="pop-left">
																<div class="left-content">
																	<div class="svg-box">
																		<img src="../src/style/res/svg/contentGage.svg">
																	</div>
																	<div class="monitor-type">液位监测点</div>
																</div>
															</div>
															<div class="monitor-site">
																<a href="javascript:void(0);">
																	<span>${feature.properties.name}</span>
																	<span class="icon-box"><i class="layui-icon layui-icon-right" style="height:12px;display:inline-block;position:relative;top:-1px;font-size: 12px; color: #fff;"></i></span>
																</a>
															</div>
															<div class="show-data">
																<div class="data-float">
																	<div class="data-name">待接入<span class="unit"></span></div>
																	<div class="data-value">null</div>
																</div>
															</div>
															<div class="svg-img">
																<img src="../src/style/res/svg/contentGage.svg">
															</div>
														</div>
													</div>`;
				}
				layer.bindPopup(popupContent);
			}
		});

		// 泵站使用的图标
		BengzhanIcon = L.Icon.extend({
			options: {
				iconSize: [20, 20]
			}
		});
		bz_greenIcon = new BengzhanIcon({
			iconUrl: resUrl + '/泵站-正常.png'
		}), bz_redIcon = new BengzhanIcon({
			iconUrl: resUrl + '/泵站-报警.png'
		}), bz_yellowIcon = new BengzhanIcon({
			iconUrl: resUrl + '/泵站-预警.png'
		}), bz_gw = new BengzhanIcon({
			iconUrl: resUrl + '/gwbz.png',
			iconSize: [40, 38]
		});

		// 污水处理厂使用的图标
		WushuichulichangIcon = L.Icon.extend({
			options: {
				iconSize: [25, 25]
			}
		});
		wushuichulichangIcon = new WushuichulichangIcon({
			iconUrl: resUrl + '/污水处理厂.png'
		});
		gw_wushuichulichangIcon = new WushuichulichangIcon({
			iconUrl: resUrl + '/gwwscl.png',
			iconSize: [64, 40]
		});

		identifiedFeature = null;

		resUrl = layui.setter.base + 'style/res';
		normalm = L.esri.tiledMapLayer({
			url: normalmUrl,
			maxZoom: 20
		});
		normala = L.esri.tiledMapLayer({
			url: normalaUrl,
			maxZoom: 20
		});
		imgm = L.esri.tiledMapLayer({
			url: imgmUrl,
			maxZoom: 20
		});
		imga = L.esri.tiledMapLayer({
			url: imgaUrl,
			maxZoom: 20
		});

		vector = L.layerGroup([normalm, normala]);
		raster = L.layerGroup([imgm, imga]);

		mapserver = L.esri.dynamicMapLayer({
			url: mapServer,
			opacity: 0.8
		});

		//雨水管点
		yspoint = L.esri.dynamicMapLayer({
			url: mapServer,
			layers: [0],
			opacity: 0.8
		});

		//污水管点
		wspoint = L.esri.dynamicMapLayer({
			url: mapServer,
			layers: [1],
			opacity: 0.8
		});

		//雨水管线
		ysline = L.esri.dynamicMapLayer({
			url: mapServer,
			layers: [2],
			layerDefs: {
				2: "权重>7"
			},
			opacity: 0.8
		});

		//污水管线
		wsline = L.esri.dynamicMapLayer({
			url: mapServer,
			layers: [3],
			layerDefs: {
				3: "权重>7"
			},
			opacity: 0.8
		});

		wsGG = L.esri.dynamicMapLayer({
			url: wsServer,
			layers: [0],
			opacity: 0.8
		});

		wsWSC = L.esri.dynamicMapLayer({
			url: wsServer,
			layers: [1],
			opacity: 0.8
		});

		roadLayer = L.esri.dynamicMapLayer({
			url: roadServer,
			layers: [0],
			opacity: 1
		});

		wsggLayer = L.esri.dynamicMapLayer({
			url: wsggServer,
			layers: [0],
			opacity: 1
		});

		wsNet = L.layerGroup([wsGG, wsWSC]);

		//街道全景
		baiduLayer = L.esri.dynamicMapLayer({
			url: baiduServer,
			opacity: 0.8
		});

		//规划数据
		ghserverLayerTDT = L.esri.dynamicMapLayer({
			url: ghServerTDT,
			opacity: 0.8
		});

		ghserverLayerGD = L.esri.dynamicMapLayer({
			url: ghServerGD,
			opacity: 0.8
		});

		ys = L.layerGroup([ysline, yspoint]);
		ws = L.layerGroup([wsline, wspoint]);

		// 泵站标记
		bz = L.geoJSON(expData.bengzhan, {
			pointToLayer: function(feature, latlng) {
				return L.marker(latlng, {
					icon: bz_greenIcon
				});
			},

			onEachFeature: function(feature, layer) {
				var name = feature.properties.name;
				if(feature.properties && feature.properties.name) {
					// popupContent = `<a href='#/stationManage/pumpStationManage/monitorControl/stationName=${escape(name)}'> 
					// 	${name}
					// 	</a>`;
					popupContent = `<div class="pop-html">
														<div class="pop-right">
															<div class="pop-left">
																<div class="left-content">
																	<div class="svg-box">
																		<img src="../src/style/res/svg/pumpStation.svg">
																	</div>
																	<div class="monitor-type">泵站监测点</div>
																</div>
															</div>
															<div class="monitor-site">
																<a href="#/stationManage/pumpStationManage/monitorControl/stationName=${escape(name)}">
																	<span>${name}</span>
																	<span class="icon-box"><i class="layui-icon layui-icon-right" style="height:12px;display:inline-block;position:relative;top:-1px;font-size: 12px; color: #fff;"></i></span>
																</a>
															</div>
															<div class="show-data">
																<div class="data-float">
																	<div class="data-name">待接入<span class="unit"></span></div>
																	<div class="data-value">null</div>
																</div>
															</div>
															<div class="svg-img">
																<img src="../src/style/res/svg/pumpStation.svg">
															</div>
														</div>
													</div>`;
				}
				layer.bindPopup(popupContent);
			}
		});

		// 泵站标记
		gw_bz = L.geoJSON(expData.gw_bz, {
			pointToLayer: function(feature, latlng) {
				return L.marker(latlng, {
					icon: bz_gw
				});
			},

			onEachFeature: function(feature, layer) {
				var name = feature.properties.name;
				if(feature.properties && feature.properties.name) {
					popupContent = `<div class="pop-html">
														<div class="pop-right">
															<div class="pop-left">
																<div class="left-content">
																	<div class="svg-box">
																		<img src="../src/style/res/svg/pumpStation.svg">
																	</div>
																	<div class="monitor-type">泵站监测点</div>
																</div>
															</div>
															<div class="monitor-site">
																<a href="#/stationManage/pumpStationManage/monitorControl/stationName=${escape(name)}">
																	<span>${name}</span>
																	<span class="icon-box"><i class="layui-icon layui-icon-right" style="height:12px;display:inline-block;position:relative;top:-1px;font-size: 12px; color: #fff;"></i></span>
																</a>
															</div>
															<div class="show-data">
																<div class="data-float">
																	<div class="data-name">待接入<span class="unit"></span></div>
																	<div class="data-value">null</div>
																</div>
															</div>
															<div class="svg-img">
																<img src="../src/style/res/svg/pumpStation.svg">
															</div>
														</div>
													</div>`;
				}
				layer.bindPopup(popupContent);
			}
		});

		bzp = L.layerGroup([bz]);
		// 污水处理厂标记
		wsclc = jinlongwan = L.geoJSON(expData.wushuichulichang, {
			pointToLayer: function(feature, latlng) {
				return L.marker(latlng, {
					icon: wushuichulichangIcon
				});
			},
			onEachFeature: function(feature, layer) {
				if(feature.properties && feature.properties.name) {
					// popupContent = `<a href='#/stationManage/sewerage_manage/monitorControl'> 
					// ${feature.properties.name}
					// </a>`;
					popupContent = `<div class="pop-html">
														<div class="pop-right">
															<div class="pop-left">
																<div class="left-content">
																	<div class="svg-box">
																		<img src="../src/style/res/svg/pumpStation.svg">
																	</div>
																	<div class="monitor-type">污水处理厂</div>
																</div>
															</div>
															<div class="monitor-site">
																<a href="#/stationManage/sewerage_manage/monitorControl">
																	<span>${feature.properties.name}</span>
																	<span class="icon-box"><i class="layui-icon layui-icon-right" style="height:12px;display:inline-block;position:relative;top:-1px;font-size: 12px; color: #fff;"></i></span>
																</a>
															</div>
															<div class="show-data">
																<div class="data-float">
																	<div class="data-name">待接入<span class="unit"></span></div>
																	<div class="data-value">null</div>
																</div>
															</div>
															<div class="svg-img">
																<img src="../src/style/res/svg/pumpStation.svg">
															</div>
														</div>
													</div>`;
				}
				layer.bindPopup(popupContent);
			}
		});
		wsca = L.layerGroup([wsclc]);

		// 污水处理厂标记
		gw_wscl = L.geoJSON(expData.gw_wscl, {
			pointToLayer: function(feature, latlng) {
				return L.marker(latlng, {
					icon: gw_wushuichulichangIcon
				});
			},
			onEachFeature: function(feature, layer) {
				if(feature.properties && feature.properties.name) {
					popupContent = `<div class="pop-html">
														<div class="pop-right">
															<div class="pop-left">
																<div class="left-content">
																	<div class="svg-box">
																		<img src="../src/style/res/svg/pumpStation.svg">
																	</div>
																	<div class="monitor-type">污水处理厂</div>
																</div>
															</div>
															<div class="monitor-site">
																<a href="#/stationManage/sewerage_manage/monitorControl">
																	<span>${feature.properties.name}</span>
																	<span class="icon-box"><i class="layui-icon layui-icon-right" style="height:12px;display:inline-block;position:relative;top:-1px;font-size: 12px; color: #fff;"></i></span>
																</a>
															</div>
															<div class="show-data">
																<div class="data-float">
																	<div class="data-name">待接入<span class="unit"></span></div>
																	<div class="data-value">null</div>
																</div>
															</div>
															<div class="svg-img">
																<img src="../src/style/res/svg/pumpStation.svg">
															</div>
														</div>
													</div>`;
				}
				layer.bindPopup(popupContent);
			}
		});

		markerGroup = new L.featureGroup([]);
		selectedType = 'yspoint';

		/*wab空间分析高亮显示 */
		analystHightLightGroup = new L.featureGroup([]);

		//易涝点数据获取，ajax
		var jsonYLD;
		geojsonYLD = {
			"type": "FeatureCollection",
			"features": []
		};
		$.ajax({
			url: backUrl + "checkPoint/get?type=1&limit=-1",
			async: false,
			success: function(result) {
				jsonYLD = result.data;
				jsonYLD.forEach(function(item, index) {
					if(item.used == 2) {
						$.ajax({
							url: backUrl + 'checkPointData/getLastDataById?checkpointId=' + item.id,
							async: false,
							success: function(res) {
								var feature = {
									"type": "Feature",
									"geometry": {
										"type": "Point",
										"coordinates": [item.longitude, item.latitude]
									},
									"properties": {
										"id": item.id,
										"type": 1,
										"device": 1,
										"name": item.location,
										"value": res.data.length == 1 ? res.data[0].dataValue : '未知',
										"paras": {
											"a": item.a,
											"b": item.b,
											"c": item.c
										},
										"used": item.used,
										"updatetime": item.updatetime
									}
								};
								geojsonYLD.features.push(feature);
							}
						});
					} else {
						var feature = {
							"type": "Feature",
							"geometry": {
								"type": "Point",
								"coordinates": [item.longitude, item.latitude]
							},
							"properties": {
								"id": item.id,
								"type": 1,
								"device": 1,
								"name": item.location,
								"value": '未知',
								"paras": {
									"a": item.a,
									"b": item.b,
									"c": item.c
								},
								"used": item.used,
								"updatetime": item.updatetime
							}
						};
						geojsonYLD.features.push(feature);
					}
				});

			}
		});
		yld = L.geoJSON(geojsonYLD, {
			pointToLayer: function(feature, latlng) {
				var iconStyle = L.marker(latlng, {
					icon: yld_greenIcon0
				});
				if(feature.properties.device) {
					iconStyle = L.marker(latlng, {
						icon: yld_greenIcon1
					});
				}
				return iconStyle;
			}
			/*,
						onEachFeature: function(feature, layer) {
							if(feature.properties && feature.properties.name) {
								popupContent = feature.properties.name;
							}
							layer.bindPopup(popupContent);
						}*/
		});

		yldg = L.layerGroup([yld]);
		//弹出层
		popupGroup = L.layerGroup([]);

	}

	function hideHomepage() {
		$("#map_container").css("display", "none");
		$("#panorama_container").css("display", "block");
		$(".right-Modular").css("display", "none");
		$(".right-user").css("display", "none");
		$(".Controllayer").css("display", "none");
		$(".Legend").css("display", "none");
		$(".left-frame>.i-input").css("display", "none");
		$(".left-frame>.query").css("display", "none");
		$(".left-frame>.positionLink").css("display", "none");
		$(".left-frame>.positionRecord").css("display", "none");
		//$("body .left-frame").css("min-height", "44px");
	}

	function _initMapEvent() {
		map.on('zoomend', function(e) {
			markZoom = map.getZoom();

			if(markZoom < 13) {

				ysline.setLayerDefs({
					2: "权重>7"
				});
				wsline.setLayerDefs({
					3: "权重>7"
				});
			} else if(markZoom < 15) {
				ysline.setLayerDefs({
					2: "权重>6"
				});
				wsline.setLayerDefs({
					3: "权重>6"
				});
			} else {
				ysline.setLayerDefs({});
				wsline.setLayerDefs({});
			}
		})

		map.on('zoomend', function() {
			markZoom = map.getZoom();
			showDataByZoom(markZoom);
		});

		map.on('click', function(e) {
			if(identifiedFeature) {
				map.removeLayer(identifiedFeature);
			}
			markerGroup.clearLayers();
			if(!baiduFlag) {
				mapserver.identify().on(map).at(e.latlng).run(function(error, featureCollection) {
					if(featureCollection.features.length > 0) {
						var featureType = [];
						featureCollection.features.forEach(function(item) {
							featureType.push(item.geometry.type);
						})
						var pointIndex = featureType.indexOf("Point");
						if(pointIndex != -1) {
							identifiedFeature = L.geoJson(featureCollection.features[pointIndex]).addTo(map);
							proToTable(featureCollection.features[pointIndex].properties, e.latlng);
						} else {
							identifiedFeature = L.geoJson(featureCollection.features[0]).addTo(map);
							proToTable(featureCollection.features[0].properties, e.latlng);
						}
					}
				});
			} else {
				$(".left-frame").css('display', 'none');
				//由于耗时太长，暂时不去做判断
				//baiduLayer.identify().on(map).at(e.latlng).run(function(error, featureCollection) {
				//if(featureCollection.features.length > 0) {
				var ggPoint = new BMap.Point(e.latlng.lng, e.latlng.lat);
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
				var convertor = new BMap.Convertor();
				var pointArr = [];
				pointArr.push(ggPoint);
				convertor.translate(pointArr, 1, 5, translateCallback)
				//}
				//});

			}
		});

	}
	window.closePopup = function(id) {
		var popup = popupArr[id];
		popup.removeFrom(map);
		popupArr[id] = null;
	}

//	function showDataByZoom(level, closeArr) {
	function showDataByZoom(level) {

		popupGroup.clearLayers();
		//易涝点
		var arrYLD = [];
		for(var p in yld._layers) {
			arrYLD.push(p);
		}
		arrYLD.forEach(function(p) {
			var layer = yld._layers[p];
			var feature = layer.feature;
			var id = feature.properties.id;
			var used = feature.properties.used;
			feature.properties.value = nullChange(feature.properties.value);
			var content = `<div class="pop-html">
											<div class="pop-right">
												<button class="close-button" onclick="closePopup(${id})"><i class="layui-icon layui-icon-close" style="font-size: 14px;color: #e0e0e0;position: relative;top: -1px;height: 14px;display: inline-block;"></i></button>
												<div class="pop-left">
													<div class="left-content">
														<div class="svg-box">
															<img src="../src/style/res/svg/floodHas.svg">
														</div>
														<div class="monitor-type">易涝监测点</div>
													</div>
												</div>
												<div class="monitor-site">
													<a href="#/detection/rainSystem/floodTest">
														<span>${feature.properties.name}</span>
														<span class="icon-box"><i class="layui-icon layui-icon-right" style="height:12px;display:inline-block;position:relative;top:-1px;font-size: 12px; color: #fff;"></i></span>
													</a>
												</div>
												<div class="show-data">
													<div class="data-float">
														<div class="data-name">水位<span class="unit">(m)</span></div>
														<div class="data-value">${feature.properties.value}</div>
													</div>
												</div>
												<div class="svg-img">
													<img src="../src/style/res/svg/floodHas.svg">
												</div>
											</div>
										</div>`;
			if(used == 2) {
				if(popupArr[id] !== null && level >= standardLevel) {
					var  popup = L.popup({
							autoPan: false,
							autoClose: false,
							closeOnClick: false,
							closeButton: false
						})
						.setLatLng(layer._latlng)
						.setContent(content).addTo(popupGroup); 
					popupArr[id] = popup;

				} else {
					layer.off('click');
					layer.on('click', function(e) {
						var  popup = L.popup({
								autoPan: false,
								autoClose: false,
								closeOnClick: false,
								closeButton: false
							})
							.setLatLng(layer._latlng)
							.setContent(content).addTo(popupGroup); 
						popupArr[id] = popup;
					});
				}
			} else {
				layer.off('click');
				layer.on('click', function(e) {
					var  popup = L.popup({
							autoPan: false,
							autoClose: false,
							closeOnClick: false,
							closeButton: false
						})
						.setLatLng(layer._latlng)
						.setContent(content).addTo(popupGroup); 
					popupArr[id] = popup;
				});
			}
		});

		//流量
		var arrLL = [];
		for(var p in liuliang._layers) {
			arrLL.push(p);
		}
		arrLL.forEach(function(p) {
			var layer = liuliang._layers[p];
			var feature = layer.feature;
			var id = feature.properties.id;
			feature.properties.value = nullChange(feature.properties.value);
			var content = `<div class="pop-html">
											<div class="pop-right">
												<button class="close-button" onclick="closePopup(${id})"><i class="layui-icon layui-icon-close" style="font-size: 14px;color: #e0e0e0;position: relative;top: -1px;height: 14px;display: inline-block;"></i></button>
												<div class="pop-left">
													<div class="left-content">
														<div class="svg-box">
															<img src="../src/style/res/svg/flow.svg">
														</div>
														<div class="monitor-type">流量监测点</div>
													</div>
												</div>
												<div class="monitor-site">
													<a href="#/detection/sewageSystem/flow_test">
														<span>${feature.properties.name}</span>
														<span class="icon-box"><i class="layui-icon layui-icon-right" style="height:12px;display:inline-block;position:relative;top:-1px;font-size: 12px; color: #fff;"></i></span>
													</a>
												</div>
												<div class="show-data">
													<div class="data-float">
														<div class="data-name">流量<span class="unit">(m³/s)</span></div>
														<div class="data-value">${feature.properties.value}</div>
													</div>
												</div>
												<div class="svg-img">
													<img src="../src/style/res/svg/flow.svg">
												</div>
											</div>
										</div>`;

			if(popupArr[id] !== null && level >= standardLevel) {
				var  popup = L.popup({
						autoPan: false,
						autoClose: false,
						closeOnClick: false,
						closeButton: false
					})
					.setLatLng(layer._latlng)
					.setContent(content).addTo(popupGroup); 
				popupArr[id] = popup;
			} else {
				//layer.bindPopup(content);
				layer.off('click');
				layer.on('click', function(e) {
					var  popup = L.popup({
							autoPan: false,
							autoClose: false,
							closeOnClick: false,
							closeButton: false
						})
						.setLatLng(layer._latlng)
						.setContent(content).addTo(popupGroup); 
					popupArr[id] = popup;
				});
			}

		});

		//水质
		var arrSZ = [];
		for(var p in shuizhi._layers) {
			arrSZ.push(p);
		}
		arrSZ.forEach(function(p) {
			var layer = shuizhi._layers[p];
			var feature = layer.feature;
			var id = feature.properties.id;
			feature.properties.value['PH'] = nullChange(feature.properties.value['PH']);
			feature.properties.value['COD'] = nullChange(feature.properties.value['COD']);
			feature.properties.value['氨氮'] = nullChange(feature.properties.value['氨氮']);
			feature.properties.value['总磷'] = nullChange(feature.properties.value['总磷']);
			feature.properties.value['总氮'] = nullChange(feature.properties.value['总氮']);
			var content = `<div class="pop-html">
											<div class="pop-right">
												<button class="close-button" onclick="closePopup(${id})"><i class="layui-icon layui-icon-close" style="font-size: 14px;color: #e0e0e0;position: relative;top: -1px;height: 14px;display: inline-block;"></i></button>
												<div class="pop-left">
													<div class="left-content">
														<div class="svg-box">
															<img src="../src/style/res/svg/water.svg">
														</div>
														<div class="monitor-type">水质监测点</div>
													</div>
												</div>

												<div class="monitor-site">
													<a href="#/detection/sewageSystem/water_test">
														<span>${feature.properties.name}</span>
														<span class="icon-box"><i class="layui-icon layui-icon-right" style="height:12px;display:inline-block;position:relative;top:-1px;font-size: 12px; color: #fff;"></i></span>
													</a>
												</div>
												<div class="show-data">
													<div class="data-float">
														<div class="data-name">PH<span class="unit"></span></div>
														<div class="data-value">${feature.properties.value['PH']}</div>
													</div>
													<div class="data-float">
														<div class="data-name">COD<span class="unit">(mg/l)</span></div>
														<div class="data-value">${feature.properties.value['COD']}</div>
													</div>
													<div class="data-float">
														<div class="data-name">氨氮<span class="unit">(mg/l)</span></div>
														<div class="data-value">${feature.properties.value['氨氮']}</div>
													</div>
													<div class="data-float">
														<div class="data-name">总磷<span class="unit">(mg/l)</span></div>
														<div class="data-value">${feature.properties.value['总磷']}</div>
													</div>
													<div class="data-float">
														<div class="data-name">总氮<span class="unit">(mg/l)</span></div>
														<div class="data-value">${feature.properties.value['总氮']}</div>
													</div>
												</div>
												<div class="svg-img">
													<img src="../src/style/res/svg/water.svg">
												</div>
											</div>
										</div>`;
			if(popupArr[id] !== null) {

			}
			if(popupArr[id] !== null && level >= standardLevel) {
				var  popup = L.popup({
						autoPan: false,
						autoClose: false,
						closeOnClick: false,
						closeButton: false
					})
					.setLatLng(layer._latlng)
					.setContent(content).addTo(popupGroup); 
				popupArr[id] = popup;
			} else {
				//layer.bindPopup(content);
				layer.off('click');
				layer.on('click', function(e) {
					var  popup = L.popup({
							autoPan: false,
							autoClose: false,
							closeOnClick: false,
							closeButton: false
						})
						.setLatLng(layer._latlng)
						.setContent(content).addTo(popupGroup); 
					popupArr[id] = popup;
				});
			}
		});
	}
	//	毫秒转日期
	function formatterDateTime(myDate) {
		var date = new Date(myDate);
		var datetime = date.getFullYear() +
			"-" // "年"
			+
			((date.getMonth() + 1) < 10 ? "0" +
				(date.getMonth() + 1) : (date.getMonth() + 1)) +
			"-" // "月"
			+
			(date.getDate() < 10 ? "0" + date.getDate() : date
				.getDate()) +
			" " +
			(date.getHours() < 10 ? "0" + date.getHours() : date
				.getHours()) +
			":" +
			(date.getMinutes() < 10 ? "0" + date.getMinutes() : date
				.getMinutes()) +
			":" +
			(date.getSeconds() < 10 ? "0" + date.getSeconds() : date
				.getSeconds());
		return datetime;
	}

	function nullChange(indexs) {
		if(indexs === "Null" || indexs === " " || indexs === null) {
			indexs = '未知';
		}
		return indexs;
	}

	function proToTable(properties, latlng) {
		var type = properties['物探点号'];
		var popInfo;
		var mmDates = properties['探测时间'];
		var Dates = formatterDateTime(mmDates);
		var subDate = Dates.substring(0, 10);
		var aimDate = subDate.replace(/-/g, '/');
		if(type == undefined) {
			var video = 'test.mp4',
				videoSrc1 = `${videoSrc}${video}`;
			$("#line_pop #line_video").attr('src', videoSrc1);
			properties['管线性质'] = nullChange(properties['管线性质']);
			properties['起点高程'] = nullChange(properties['起点高程']);
			properties['使用状态'] = nullChange(properties['使用状态']);
			properties['管径'] = nullChange(properties['管径']);
			properties['终点高程'] = nullChange(properties['终点高程']);
			properties['所在道路'] = nullChange(properties['所在道路']);
			properties['管线材质'] = nullChange(properties['管线材质']);
			properties['埋设类型'] = nullChange(properties['埋设类型']);
			properties['起点点号'] = nullChange(properties['起点点号']);
			properties['沟截面宽高'] = nullChange(properties['沟截面宽高']);
			properties['探测单位'] = nullChange(properties['探测单位']);
			properties['终点点号'] = nullChange(properties['终点点号']);
			properties['权属单位'] = nullChange(properties['权属单位']);
			aimDate = nullChange(aimDate);
			properties['起点埋深'] = nullChange(properties['起点埋深']);
			properties['线型'] = nullChange(properties['线型']);
			properties['备注'] = nullChange(properties['备注']);
			properties['终点埋深'] = nullChange(properties['终点埋深']);
			properties['探测状态'] = nullChange(properties['探测状态']);
			$('#line_pop #line_title').html(properties['管线性质'] + '管线信息');

			$('#line_pop #line_gxxz').html(properties['管线性质']).attr('title', properties['管线性质']);
			$('#line_pop #line_qdgc').html(properties['起点高程']).attr('title', properties['起点高程']);
			$('#line_pop #line_syzt').html(properties['使用状态']).attr('title', properties['使用状态']);
			$('#line_pop #line_gj').html(properties['管径']).attr('title', properties['管径']);
			$('#line_pop #line_zdgc').html(properties['终点高程']).attr('title', properties['终点高程']);
			$('#line_pop #line_szdl').html(properties['所在道路']).attr('title', properties['所在道路']);
			$('#line_pop #line_gxcz').html(properties['管线材质']).attr('title', properties['管线材质']);
			$('#line_pop #line_mslx').html(properties['埋设类型']).attr('title', properties['埋设类型']);

			$('#line_pop #line_qddh').html(properties['起点点号']).attr('title', properties['起点点号']);
			$('#line_pop #line_gjmkg').html(properties['沟截面宽高']).attr('title', properties['沟截面宽高']);
			$('#line_pop #line_tcdw').html(properties['探测单位']).attr('title', properties['探测单位']);
			$('#line_pop #line_zddh').html(properties['终点点号']).attr('title', properties['终点点号']);
			$('#line_pop #line_qsdw').html(properties['权属单位']).attr('title', properties['权属单位']);
			$('#line_pop #line_tcsj').html(aimDate).attr('title', aimDate);
			$('#line_pop #line_qdms').html(properties['起点埋深']).attr('title', properties['起点埋深']);
			$('#line_pop #line_xx').html(properties['线型']).attr('title', properties['线型']);
			$('#line_pop #line_bz').html(properties['备注']).attr('title', properties['备注']);
			$('#line_pop #line_zdms').html(properties['终点埋深']).attr('title', properties['终点埋深']);
			$('#line_pop #line_tczt').html(properties['探测状态']).attr('title', properties['探测状态']);

			popInfo = $('#line_pop').html();
		} else {
			imgSrc = `${imageHref}${properties['物探点号']}.jpg`;
			$('#point_pop #point_img').attr('src', imgSrc);

			properties['管线性质'] = nullChange(properties['管线性质']);
			properties['附属物'] = nullChange(properties['附属物']);
			properties['井底深'] = nullChange(properties['井底深']);
			properties['井室规格'] = nullChange(properties['井室规格']);
			properties['地面高程'] = nullChange(properties['地面高程']);
			properties['井盖材质'] = nullChange(properties['井盖材质']);
			properties['井脖高'] = nullChange(properties['井脖高']);
			properties['井盖规格'] = nullChange(properties['井盖规格']);
			properties['所在道路'] = nullChange(properties['所在道路']);
			properties['井室角度'] = nullChange(properties['井室角度']);
			properties['井脖规格'] = nullChange(properties['井脖规格']);

			properties['物探点号'] = nullChange(properties['物探点号']);
			properties['偏心井位'] = nullChange(properties['偏心井位']);
			properties['图例角度'] = nullChange(properties['图例角度']);
			properties['X坐标'] = nullChange(properties['X坐标']);
			properties['井室附属物代码'] = nullChange(properties['井室附属物代码']);
			properties['探测单位'] = nullChange(properties['探测单位']);
			properties['Y坐标'] = nullChange(properties['Y坐标']);
			properties['图幅号'] = nullChange(properties['图幅号']);
			aimDate = nullChange(aimDate);
			properties['特征点'] = nullChange(properties['特征点']);
			properties['图上点号'] = nullChange(properties['图上点号']);
			properties['备注'] = nullChange(properties['备注']);
			$('#point_pop #point_title').html(properties['管线性质'] + '管点信息');

			$('#point_pop #point_gxxz').html(properties['管线性质']).attr('title', properties['管线性质']);
			$('#point_pop #point_fsw').html(properties['附属物']).attr('title', properties['附属物']);
			$('#point_pop #point_jds').html(properties['井底深']).attr('title', properties['井底深']);
			$('#point_pop #point_jsgg').html(properties['井室规格']).attr('title', properties['井室规格']);
			$('#point_pop #point_dmgc').html(properties['地面高程']).attr('title', properties['地面高程']);
			$('#point_pop #point_jgcz').html(properties['井盖材质']).attr('title', properties['井盖材质']);
			$('#point_pop #point_jbg').html(properties['井脖高']).attr('title', properties['井脖高']);
			$('#point_pop #point_jggg').html(properties['井盖规格']).attr('title', properties['井盖规格']);
			$('#point_pop #point_szdl').html(properties['所在道路']).attr('title', properties['所在道路']);
			$('#point_pop #point_jsjd').html(properties['井室角度']).attr('title', properties['井室角度']);
			$('#point_pop #point_jbgg').html(properties['井脖规格']).attr('title', properties['井脖规格']);

			$('#point_pop #point_wtdh').html(properties['物探点号']).attr('title', properties['物探点号']);
			$('#point_pop #point_pxjw').html(properties['偏心井位']).attr('title', properties['偏心井位']);
			$('#point_pop #point_tljd').html(properties['图例角度']).attr('title', properties['图例角度']);
			$('#point_pop #point_Xzb').html(properties['X坐标']).attr('title', properties['X坐标']);
			$('#point_pop #point_jsfswdm').html(properties['井室附属物代码']).attr('title', properties['井室附属物代码']);
			$('#point_pop #point_tcdw').html(properties['探测单位']).attr('title', properties['探测单位']);
			$('#point_pop #point_Yzb').html(properties['Y坐标']).attr('title', properties['Y坐标']);
			$('#point_pop #point_tfh').html(properties['图幅号']).attr('title', properties['图幅号']);
			$('#point_pop #point_tcsj').html(aimDate).attr('title', aimDate);
			$('#point_pop #point_tzd').html(properties['特征点']).attr('title', properties['特征点']);
			$('#point_pop #point_tsdh').html(properties['图上点号']).attr('title', properties['图上点号']);
			$('#point_pop #point_bz').html(properties['备注']).attr('title', properties['备注']);

			popInfo = $('#point_pop').html();
		}

		pipePopup = L.popup({
				minWidth: 460
			})
			.setLatLng(latlng)
			.setContent(popInfo)
			.openOn(map);
	}

	function _initMapControl() {

		//坐标显示
		L.control.mousePosition({
			'position': 'bottomright'
		}).addTo(map);

		//比例尺添加
		L.control.betterscale({
			'position': 'bottomright'
		}).addTo(map);
	}

	function CheckImgExists(imgurl) {
		var img = new Image(); //判断图片是否存在  
		img.src = imgurl;
		//没有图片，则返回-1  
		if(img.fileSize > 0 || (img.width > 0 && img.height > 0)) {
			return true;
		} else {
			return false;
		}
	}
	//arrMarkerLayer:图层数组,比如[yld,liuliang,shuizhi]
	function getCurrentData(arrMarkerLayer) {
		var data = [];
		$.ajax({
			url: backUrl + "checkPointData/newestData?origin=1&used=2&limit=-1",
			async:false,
			success: function(res) {				
				data = res.data;
				arrMarkerLayer.forEach(function(item) {
					var _markerLayer = item;
					var arr = [];
					for(var p in _markerLayer._layers) {
						arr.push(p);
					}
					arr.forEach(function(index) {
						var layer = _markerLayer._layers[index];
						var feature = layer.feature;
						data.forEach(function(item) {
							//返回数据id与当前要素id一致时，进行数据展示
							if(item.checkPointId == feature.properties.id) {
								//有其他监测图层进行数据展示，需要在这进行类型判断和对应的数据展示格式处理
								if(item.type == "易涝监测点" || item.type == "流量监测点") {									
									feature.properties.value = item.dataValue;
								} else if(item.type == "水质监测点") {
									var field = null;
									switch(item.dataType) {
										case "PH":
											field = "PH";
											break;
										case "COD":
											field = "COD";
											break;
										case "氨氮":
											field = "氨氮";
											break;
										case "总磷":
											field = "总磷";
											break;
										case "总氮":
											field = "总氮";
											break;
									}
									feature.properties.value[field] = item.dataValue;
								}
							}
						});
					});
				})
			}
		});

	}
	//MarkLayer:点图层
	function getCurrentState(MarkLayer) {
		var arr = [];
		for(var p in MarkLayer._layers) {
			arr.push(p);
		}
		$.ajax({
			url: backUrl + "alarm/judgeStatus",
			success: function(res) {
				var data = res.data;
				//出现报警的监测点数量
				var count = res.count;
				if(count == 0) {
					arr.forEach(function(p) {
						var layer = MarkLayer._layers[p];
						if(layer.feature.properties.type == 1) {
							window.yldCurrentIcon = yld_greenIcon1;
							layer.setIcon(yld_greenIcon1);
						}
						if(layer.feature.properties.type == 2) {
							window.szCurrentIcon = sz_greenIcon;
							layer.setIcon(sz_greenIcon);
						}
						if(layer.feature.properties.type == 3) {
							window.llCurrentIcon = ll_greenIcon;
							layer.setIcon(ll_greenIcon);
						}

					})
					return;
				} else {
					data.forEach(function(item) {
						arr.forEach(function(p) {
							var layer = MarkLayer._layers[p];
							if(layer.feature.properties.id == item.CHECK_POINT_ID) {
								if(item.COUNT > 0) {
									if(layer.feature.properties.type == 1) {
										if(item.ALARM_LEVEL == "报警") {
											window.yldCurrentIcon = yld_redIcon1;
										} else if(item.ALARM_LEVEL == "预警") {
											window.yldCurrentIcon = yld_yellowIcon1;
										}
										layer.setIcon(yldCurrentIcon);
									}
									if(layer.feature.properties.type == 2) {
										if(item.ALARM_LEVEL == "报警") {
											window.szCurrentIcon = sz_redIcon;
										} else if(item.ALARM_LEVEL == "预警") {
											window.szCurrentIcon = sz_yellowIcon;
										}
										layer.setIcon(szCurrentIcon);
									}
									if(layer.feature.properties.type == 3) {
										if(item.ALARM_LEVEL == "报警") {
											window.llCurrentIcon = ll_redIcon;
										} else if(item.ALARM_LEVEL == "预警") {
											window.llCurrentIcon = ll_yellowIcon;
										}
										layer.setIcon(llCurrentIcon);
									}
								} else {
									if(layer.feature.properties.type == 1) {
										window.yldCurrentIcon = yld_greenIcon1;
										layer.setIcon(yld_greenIcon1);
									}
									if(layer.feature.properties.type == 2) {
										window.szCurrentIcon = sz_greenIcon;
										layer.setIcon(sz_greenIcon);
									}
									if(layer.feature.properties.type == 3) {
										window.llCurrentIcon = ll_greenIcon;
										layer.setIcon(ll_greenIcon);
									}
								}
							}

						})
					})
				}
			}
		});
	}

	var exp = {
		'initGlobal': _initGlobal,
		'initMapEvent': _initMapEvent,
		'initMapControl': _initMapControl,
		'proToTable': proToTable,
		'showDataByZoom': showDataByZoom,
		'getCurrentState': getCurrentState,
		'getCurrentData': getCurrentData
	}

	$(document).ready(function() {
		//点击查看按钮
		$(document).on('click', 'a.check', function(event) {
			event.preventDefault();
			$(this).parents('.pop-body')
				.siblings('.check-detail')
				.stop(true, true)
				.animate({
					'right': '-310px'
				}, 200);
		});
		//点击返回按钮
		$(document).on('click', 'a.check-back', function(event) {
			event.preventDefault();
			$(this).parents('.check-detail')
				.stop(true, true)
				.animate({
					'right': '0px'
				}, 200);
		});

		//点击更多详情按钮
		$(document).on('click', 'a.more-info', function(event) {
			event.preventDefault();
			$(this).parents('.pop-body')
				.siblings('.more-detail')
				.stop(true, true)
				.animate({
					'left': '-378px'
				}, 200);
		});
		//点击返回按钮
		$(document).on('click', 'a.detail-back', function(event) {
			event.preventDefault();
			$(this).parents('.more-detail')
				.stop(true, true)
				.animate({
					'left': '0px'
				}, 200);
		});
	});
	exports('maputil', exp);
})