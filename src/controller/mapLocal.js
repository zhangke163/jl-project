layui.use([
	'layer','global'
], function(exports) {
	var $ = layui.jquery,
		laypage = layui.laypage,
		layer = layui.layer,global = layui.global;
	$(function() {
		
		initGlobal();
		initMap();
		/*传参*/
		var selectId = GetQueryString('id');
		var selectLayer = GetQueryString('layer');

		local(selectLayer, selectId);
	});

	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null)
			return unescape(r[2]);
		return null;
	}

	function initGlobal() {
		localMap = null;
		//井盖图片网站
		imageHref = global.ip.imageHref;
		//管线视频网站
		videoSrc = global.ip.videoSrc;
		//后台api服务器
		backUrl = global.ip.backUrl;
		//金华排水分级服务
		//		mapServer = 'http://localhost:6080/arcgis/rest/services/JHPS/Default20180706/MapServer';
		mapServer = global.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/金华排水分级/MapServer'
		//干管服务
		wsServer = global.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/金华市区污水干管/MapServer'
		//金华切片服务
		normalmUrl = global.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/JHJT/MapServer';
		normalaUrl = global.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/JHJTBZ/MapServer';
		imgmUrl = global.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/JHYX/MapServer';
		imgaUrl = global.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/JHYXBZ/MapServer';
		resUrl = '../../style/res';
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
		bounds = L.latLngBounds(L.latLng(29.27742, 119.3692), L.latLng(28.987421, 120.02701));

		identifiedFeature = null;

		normalm = L.esri.tiledMapLayer({
			url: normalmUrl,
			maxZoom: 20
		});
		normala = L.esri.tiledMapLayer({
			url: normalaUrl,
			maxZoom: 20
		});

		vector = L.layerGroup([normalm, normala]);

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
		
		ys = L.layerGroup([ysline, yspoint]);
		ws = L.layerGroup([wsline, wspoint]);
		markerGroup = new L.featureGroup([]);
		analystHightLightGroup = new L.featureGroup([]);

	}

	function initMap() {
		console.log(document.getElementById('map'));
		map = L.map('map', {
			crs: crs,
			zoomControl: false,
			attributionControl: false,
			doubleClickZoom: false,
			boxZoom: true,
			dragging: true,
			minZoom: 12,
			maxZoom: 20,
			maxBounds: bounds,
			layers: [ys, ws, markerGroup, analystHightLightGroup]
		}).setView([29.08948, 119.65279], 13);
		map.addLayer(vector);
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
	}

	function local(layerType, featureId) {
		
		layerType = layerType || 'ysline';
		var tempLayerUrl = "";
		switch(layerType) {
			case "ysline":
				tempLayerUrl = mapServer + '/2';
				break;
			case "wsline":
				tempLayerUrl = mapServer + '/3';
				break;
			case "yspoint":
				tempLayerUrl = mapServer + '/0';
				break;
			case "wspoint":
				tempLayerUrl = mapServer + '/1';
				break;
		}

		var query = L.esri.query({
			url: tempLayerUrl
		});
		console.log(tempLayerUrl);
		var whereStr = `OBJECTID=${featureId}`;
		query.where(whereStr);
		query.run(function(error, featureCollection, response) {
			// debugger
			if(featureCollection.features.length == 1) {
				var feature = featureCollection.features[0];
				identifiedFeature = L.geoJson(feature, {
					style: function() {
						return {
							color: '#F00',
							weight: 5
						};
					}
				}).addTo(map);
				map.fitBounds(identifiedFeature.getBounds());

				var latlng = null;
				if(feature.geometry.type == 'Point') {
					latlng = L.GeoJSON.coordsToLatLng(feature.geometry.coordinates);
				} else {
					latlng = L.GeoJSON.coordsToLatLng(feature.geometry.coordinates[0]);
				}
				proToTable(feature.properties, latlng);
			}
		});
	}

	//	毫秒转日期
	function formatterDateTime(myDate) {
    var date = new Date(myDate);
    var datetime = date.getFullYear()
        + "-"// "年"
        + ((date.getMonth() + 1) < 10 ?"0"
        + (date.getMonth() + 1): (date.getMonth() + 1))
        + "-"// "月"
        + (date.getDate() < 10 ? "0" + date.getDate() : date
            .getDate())
        + " "
        + (date.getHours() < 10 ? "0" + date.getHours() : date
            .getHours())
        + ":"
        + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
            .getMinutes())
        + ":"
        + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
            .getSeconds());
    return datetime;
  }
	function nullChange(indexs){
		if(indexs == "Null" || indexs == " "|| indexs == null){
			indexs = '未知';
		}
		return indexs;
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

	window.proToTable = function(properties, latlng) {
		var type = properties['物探点号'];
		var popInfo;
		var mmDates = properties['探测时间'];
		var Dates = formatterDateTime(mmDates);
		var subDate = Dates.substring(0,10);
    var aimDate = subDate.replace(/-/g,'/');
		if(type == undefined) {
			var video = 'test.mp4',
				videoSrc1 = `${videoSrc}${video}`;
			$("#line_pop #line_video").attr('src', videoSrc1);
			properties['管线性质']=nullChange(properties['管线性质']);
			properties['起点高程']=nullChange(properties['起点高程']);
			properties['使用状态']=nullChange(properties['使用状态']);
			properties['管径']=nullChange(properties['管径']);
			properties['终点高程']=nullChange(properties['终点高程']);
			properties['所在道路']=nullChange(properties['所在道路']);
			properties['管线材质']=nullChange(properties['管线材质']);
			properties['埋设类型']=nullChange(properties['埋设类型']);
			properties['起点点号']=nullChange(properties['起点点号']);
			properties['沟截面宽高']=nullChange(properties['沟截面宽高']);
			properties['探测单位']=nullChange(properties['探测单位']);
			properties['终点点号']=nullChange(properties['终点点号']);
			properties['权属单位']=nullChange(properties['权属单位']);
			aimDate=nullChange(aimDate);
			properties['起点埋深']=nullChange(properties['起点埋深']);
			properties['线型']=nullChange(properties['线型']);
			properties['备注']=nullChange(properties['备注']);
			properties['终点埋深']=nullChange(properties['终点埋深']);
			properties['探测状态']=nullChange(properties['探测状态']);
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
			console.log(properties);
			imgSrc = `${imageHref}${properties['物探点号']}.jpg`;
			
			$('#point_pop #point_img').attr('src', imgSrc);
			$('#point_pop #point_img').on('error',function(){
				this.src="../../style/res/hasNotImg.png";
			});
			
			    properties['管线性质']=nullChange(properties['管线性质']);
				properties['附属物']=nullChange(properties['附属物']);
				properties['井底深']=nullChange(properties['井底深']);
				properties['井室规格']=nullChange(properties['井室规格']);
				properties['地面高程']=nullChange(properties['地面高程']);
				properties['井盖材质']=nullChange(properties['井盖材质']);
				properties['井脖高']=nullChange(properties['井脖高']);
				properties['井盖规格']=nullChange(properties['井盖规格']);
				properties['所在道路']=nullChange(properties['所在道路']);
				properties['井室角度']=nullChange(properties['井室角度']);
				properties['井脖规格']=nullChange(properties['井脖规格']);
				
				properties['物探点号']=nullChange(properties['物探点号']);
				properties['偏心井位']=nullChange(properties['偏心井位']);
				properties['图例角度']=nullChange(properties['图例角度']);
				properties['X坐标']=nullChange(properties['X坐标']);
				properties['井室附属物代码']=nullChange(properties['井室附属物代码']);
				properties['探测单位']=nullChange(properties['探测单位']);
				properties['Y坐标']=nullChange(properties['Y坐标']);
				properties['图幅号']=nullChange(properties['图幅号']);
				aimDate=nullChange(aimDate);
				properties['特征点']=nullChange(properties['特征点']);
				properties['图上点号']=nullChange(properties['图上点号']);
				properties['备注']=nullChange(properties['备注']);
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
		L.popup({
				minWidth: 460
			})
			.setLatLng(latlng)
			.setContent(popInfo)
			.openOn(map);

	}

	window.sort = function(originObj, orderObj) {
		var info = '';
		var temp;
		$.each(orderObj, function(index, e) {
			for(var k in originObj) {
				if(originObj[e] === originObj[k] && e === k) {
					if(k == "探测单位" || k == "权属单位") {
						temp = originObj[k].length < 9 ? originObj[k] : originObj[k].substr(0, 8).concat('...');
					} else if(k.indexOf('时间') != -1 || k.indexOf('TIME') != -1) {
						var time = (new Date(originObj[k])).toLocaleDateString();
						temp = time != 'Invalid Date' ? time : '空';
					} else if(k == "终点高程" || k == "起点埋深" || k == '起点高程' || k == "SHAPE_Length") {

						try {
							temp = originObj[k].toFixed(3);
						} catch(e) {
							temp = originObj[k];
						}
					} else {
						temp = originObj[k];
					}
					info += '<li>' +
						'<span class="cate">' + k + '</span>' +
						'<span class="num" title="' + originObj[k] + '">' + temp + '</span>' +
						'</li>';
				}
			}
		})
		return info;
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
})