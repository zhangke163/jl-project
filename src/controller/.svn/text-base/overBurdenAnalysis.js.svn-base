layui.define([
	'admin',
	'layer',
	'laypage',
	'html5shiv',
	'maputil',
	'expData'
], function(exports) {
	
	var $ = layui.jquery,
		laypage = layui.laypage,
		layer = layui.layer,
		maputil = layui.maputil,

		expData = layui.expData,
		config = expData.config;
	var resUrl = layui.setter.base + 'style/res';
	var editableLayers = new L.featureGroup();
	var drawLayer = null;	
	$(function() {		
		initWindow();
		maputil.initGlobal();
		initMap();
		maputil.initMapControl();
		maputil.initMapEvent();
		initEvent();		
		initDrawControl();
		map.invalidateSize(); //重置地图尺寸		
	})

	function initDrawControl() {
		/*Draw配置*/
		var options = {
			position: 'topleft',
			draw: {
				marker: false,
				polyline: false,
				polygon: {
					allowIntersection: false, // Restricts shapes to simple polygons
					drawError: {
						color: '#e1e100' // Color the shape will turn when intersects
					},
					shapeOptions: {
						color: '#bada55'
					}
				},
				circle: false, // Turns off this drawing tool
				rectangle: {
					shapeOptions: {
						clickable: false
					}
				}
			},
			edit: false
		};
		drawControl = new L.Control.Draw(options);
		map.addControl(drawControl);
		map.addLayer(editableLayers);

		/*绘制完成事件*/
		map.on(L.Draw.Event.CREATED, function(e) {

			console.log("L.Draw.Event.CREATED");
			var type = e.layerType,
				layer = e.layer,
				geo = getInputGeo(type, layer),
				//				geoJson = geo.toGeoJSON() //绘制几何要素
				//				,
				rings = convertRings(layer._latlngs[0]); //几何要素的rings
			geoBounds = geo.getBounds();

			/*覆土深度分析*/
			OverBurdenDepth(rings);
			editableLayers.addLayer(layer);
		});
		map.on(L.Draw.Event.DRAWSTART, function(e) {
			editableLayers.clearLayers();
		});

		/*获取几何要素*/
		function getInputGeo(shapeType, drawLayer) {
			var arrlatlng = [];
			if(shapeType === 'polygon' || shapeType === 'rectangle') {
				drawLayer._latlngs[0].forEach(function(item) {
					var temp = [];
					temp[0] = item.lat;
					temp[1] = item.lng;
					arrlatlng.push(temp);
				});
				var polygon = L.polygon(arrlatlng);
				return polygon;
			} else {
				drawLayer._latlngs.forEach(function(item) {
					var temp = [];
					temp[0] = item.lat;
					temp[1] = item.lng;
					arrlatlng.push(temp);
				});

				var polyline = L.polyline(arrlatlng);
				return polyline;
			}
		}

		/*转为rings*/
		function convertRings(latlngs) {
			var rings = [];
			$.each(latlngs, function() {
				var latlng = this,
					tempArry = []; //记录点坐标
				tempArry.push(latlng.lng);
				tempArry.push(latlng.lat);
				rings.push(tempArry);
			});
			rings.push([latlngs[0].lng, latlngs[0].lat]);
			return [rings];
		}

		/*覆土深度分析*/
		function OverBurdenDepth(rings) {

			var inputPolygon = {};
			inputPolygon.rings = rings;
			inputPolygon = JSON.stringify(inputPolygon);
			//pipelineTypes
			var pipelineTypes = ["1", "2", "3"];
			var analysisFields = [];
			//起点点号
			analysisFields[0] = "起点埋深";
			//终点点号
			analysisFields[1] = "终点埋深";
			/*空间分析url*/
			var url = "?inputPolygon=" + inputPolygon + "&pipelineTypes=" + pipelineTypes + "&analysisFields=" + analysisFields + "&isJWD=true&f=json";
			//			var requestUrl = "http://localhost:6080/arcgis/rest/services/JHPS/Default20180706/MapServer" + "/exts/pipelineSpatialAnalysis/OverburdenDepth" + url;
			var requestUrl = mapServer + "/exts/pipelineSpatialAnalysis/OverburdenDepth" + url;
			$.ajax({
				url: requestUrl,
				type: 'GET',
				async: false,
				success: function(data) {
					var layer = layui.layer;
					var results = JSON.parse(data); //Arc server返回数据
					var html = ""; //模板html
					var url = layui.setter.base + 'views/spatialAnalysis/overBurdenResult.html'; //'./assets/view/OverBurdenDepth.html';
					/*请求渲染模板，弹出层显示*/

					$.ajax({
						url: url,
						type: 'GET',
						dataType: 'html',
						async: false,
						success: function(result) {
							html = result;
						},
						error: function(err) {

							alert('模板请求失败' + err);
						}
					});
					/*覆土分析结果面板*/
					layer.open({
						type: 1,
						title: '覆土分析结果',
						content: html,
						id: 'overBurdenDepth',
						area: ["600px", "580px"],
						shade: 0,
						shadeClose: false,
						closeBtn: true,
						success: function(layero, index) {

							$('.layui-layer-title ').css('height', '35px'); //弹出层标题栏
							$('.layui-layer-title ').css('line-height', '35px'); //弹出层标题栏
							$('.layui-layer-setwin a').css('background-position', '1px -40px'); // 弹出层关闭按钮
							if(results.error == null) {
								OverBurdenDepthResult(results);
							}
						},
						end: function() {
							/*清楚图层要素*/
							analystHightLightGroup.clearLayers();
							/*结束功能*/
						}
					});
				},
				error: function(error, XHQ, data) {}
			});
		}

		/*结果计算*/
		function OverBurdenDepthResult(results) {

			var result = results.result; //server分析结果
			var tableData = []; //表格数据
			var startPtNum = "起点点号";
			var endPtNum = "终点点号";
			var fMap = {}; //覆土深度map,配置文件覆土标准数据
			$.each(config.FTSDStan, function() {
				var item = this;
				fMap[item.id] = item;
			});
			$.each(result, function(index) {
				var temp = {};
				var item = this;
				/*获取要素数据*/
				temp.id = item.line.attributes[config.onlyID]; //此处有坑，配置文件一定正确
				temp.layerId = item.layerInfo.id;
				temp.GXZL = item.layerInfo.name;
				temp.FTSD = Math.floor(item.depth * 100) / 100; //覆土深度,两位
				temp.QDDH = item.line.attributes[startPtNum]; //起点点号
				temp.QDDH = item.line.attributes[endPtNum]; //终点点号
				if(fMap[item.layerInfo.name] === undefined) {
					alert("找不到图层，请检查配置文件");
					temp.BZJL = 0;
					return false;
				}
				//标准距离
				temp.BZJL = fMap[item.layerInfo.name].stand;
				/*是否合格*/
				temp.FTSD > fMap[item.layerInfo.name].stand ? temp.SFDB = "符合" : temp.SFDB = "不符合";
				tableData.push(temp);
			});
			//显示表格
			tableShow(tableData);
		}

		/*表格显示*/
		function tableShow(tableData) {
			layui.use('table', function() {
				var table = layui.table;
				/*渲染表格*/
				table.render({
					elem: '#analysisResult',
					height: '500px',
					data: tableData,
					page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
						layout: ['count', 'prev', 'page', 'next', 'skip'] //自定义分页布局
							//,curr: 5 //设定初始在第 5 页
							,
						groups: 3 //只显示 1 个连续页码
							,
						first: false //不显示首页
							,
						last: false //不显示尾页

					},
					cellMinWidth: 40,
					text: {
						none: '没有返回结果哦，请检查配置文件及数据'
					},
					cols: [
						[{
								field: 'GXZL',
								title: '类型',
								sort: true,
								align: 'center',
								fixed: 'false'
							},
							{
								field: 'FTSD',
								title: '覆土深度',
								sort: true,
								align: 'center',
								fixed: 'false'
							},
							{
								field: 'BZJL',
								title: '标距',
								sort: false,
								align: 'center',
								fixed: 'false'
							},
							{
								field: 'SFDB',
								title: '是否达标',
								sort: true,
								fixed: 'false'
							},
							{
								title: '操作',
								width: 120,
								fixed: 'right',
								align: 'center',
								toolbar: '#tableTool'
							}
						]
					],
					even: true,
					id: 'analysisResult'
				});
				$('.analysisTool .layui-btn-xs').css('font-size', '10px'); //表格工具栏按钮，定位- 详情
				$('.analysisTool .layui-btn').css('margin-left', '0');
				/*绑定事件*/
				table.on('tool(analysis)', function(obj) {

					var data = obj.data; //获得当前行数据
					var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
					var tr = obj.tr; //获得当前行 tr 的DOM对象
					var id = data.id;
					var layerId = data.layerId;
					//定位
					if(layEvent === 'locate') {
						/*定位*/
						zoomRow(id, layerId);
					}
					//详情
					else if(layEvent === 'detail') {

					}
				});
			});
		}

		/*定位*/
		function zoomRow(id, layerId) {

			/*查询字符串*/
			var queryString = config.onlyID + '= ' + id; //OBJECTID
			/*查询URL*/
			var url = mapServer + '/' + layerId;
			/*定义查询对象*/
			var query = L.esri.query({
				url: url
			});
			/*设定查询条件*/
			query.where(queryString);
			/*执行查询*/
			query.run(function(error, featureCollection, response) {

				/*获取路径*/
				var linePath = response.features[0].geometry.paths[0];
				var paths = [];
				/*经纬度转换，[纬度 经度]*/
				$.each(linePath, function() {
					var path = this;
					var temp = [];
					temp[0] = path[1];
					temp[1] = path[0];
					paths.push(temp);
				});
				//画一根线
				var pLine = L.polygon(paths, {
					color: 'red',
					opacity: 1,
					weight: 3,
					clickable: false
				});
				/*清楚高亮显示*/
				analystHightLightGroup.clearLayers();
				/*高亮显示*/
				analystHightLightGroup.addLayer(pLine);
				//map.setView(paths[0]);
				/*定位*/
				map.fitBounds(pLine.getBounds());

			});
		}

	}

	function initWindow() {
		// 初始化 map_container div 的大小
		$('#map_container').height($(window).height() - 107);
		// 监听浏览器窗口发生变化时，动态调整div的尺寸
		$(window).resize(function() {
			$('#map_container').height($(window).height() - 107);
		});
	}

	function initMap() {
		//		document.getElementById('map_container').innerHTML = "<div id='mapPanel' style='width: 100%; height: 100%;'></div>";
	
		map = L.map('map_container', {
			crs: crs,
			zoomControl: false,
			attributionControl: false,
			doubleClickZoom: false,
			boxZoom: true,
			dragging: true,
			minZoom: 12,
			maxZoom: 20,
			maxBounds: bounds,
			layers: [ys, ws, analystHightLightGroup]
		}).setView([29.08948, 119.65279], 13);
		map.addLayer(vector);
	}

	function initEvent() {
		$(".dropdown-toggle").mouseover(function() {
			$(".dropdown").addClass("open");
			$(".fa-angle-down").css("transform", "rotate(180deg)");
		}).mouseout(function() {
			$(".dropdown").removeClass("open");
			$(".fa-angle-down").css("transform", "rotate(0deg)");
		})

		map.on('click', function() {
			$(".positionLink,.positionRecord").css('display', 'block');
			$(".result").css("display", "none");
		});

		$(".selectType li").click(function(e) {
			var road = $.trim($(".searchInput")[0].value);
			selectedType = $(e.target).attr('data');
			var dataUrl = `${backUrl}search/searchByType?type=${selectedType}&szdl=${road}`;

			getList(1, dataUrl, $("#listPanel"), $(".container.paginationWrap"), 'pagination', $("#searchRes"), getTable);
		});

		$('#back').click(function() {
			reopenHomepage();
		});
	}

	function proToTable(properties, latlng) {
		var type = properties['物探点号'];
		var obj1 = [];
		var obj2 = [];
		var obj3 = [];
		var obj4 = [];
		var arrKey = Object.keys(properties);
		var popInfo = '<div style="padding:19px 0 0 0;box-sizing: border-box;"><div class="pipeName clearfix">';
		if(type == undefined) {
			obj1 = ['管径', '管线性质', '起点点号'];
			obj2 = ['材质', '埋设类型', '终点点号'];
			obj3 = ['OBJECTID', 'SHAPE', '起点埋深', '终点埋深', '起点高程', '终点高程', '沟截面宽高', '探测单位', '探测时间', '压力', '流向'];
			obj4 = ['建设年代', '使用年限', '权属单位', '线型', '探测状态', 'PIPE_LEN', 'ELEMSTIME', 'ELEMETIME', 'SHAPE_Leng', 'SHAPE_Length', '备注'];
			popInfo += `<div class="fl" id="message">管线信息</div><div class="fr"><a href="javascript:;" style="font-size: 10px;">视频接入<img data="${properties['OBJECTID']}" src="${resUrl}/视频.png" alt="视频" onclick="showWellVideo(event)" style="margin: -3px 0 0 3px;;"></a></div></div><div style="padding:0 20px;"><div class="bcgblue"><div class="title"><span>雨水管线#${properties['OBJECTID']}</span><span id="use">${properties['使用状态']}</span></div>`;
		} else {
			obj1 = ['附属物', '井盖材质', '特征点', '管线性质', '井盖规格'];
			obj2 = ['井底深', '井室规格', '井脖高', '井脖规格', '井室角度'];
			obj3 = ['OBJECTID', 'SHAPE', '物探点号', 'X坐标', 'Y坐标', '地面高程', '偏心井位', '井室附属物代码', '图幅号'];
			obj4 = ['图上点号', '图例角度', '探测单位', '探测时间', '建设年代', '生效时间', '失效时间', '权重', '备注'];
			popInfo += `<div class="fl" id="message">管点信息</div><div class="fr"><a href="javascript:;" style="font-size: 10px;">图片查看<img  data="${properties['物探点号']}" src="${resUrl2}/图片.png" alt="图片" onclick="showWellImage(event)" style="margin: -3px 0 0 3px;"></a></div></div><div style="padding:0 20px;"><div class="bcgblue"><div class="title"><span>雨水管点#${properties['OBJECTID']}</span><span id="photocode">井盖照片代码<strong style="font-size:14px;font-weight:normal;margin-left:8px;">${properties['OBJECTID']}</strong></span></div>`;
		}
		popInfo += '<div class="content clearfix"><ul class="fl con-left">' + sort(properties, obj1) +
			'</ul><ul class="fl con-right">' + sort(properties, obj2) +
			'</ul></div><div class="position"><div class="fl"><i class="fa fa-map-marker" aria-hidden="true"></i> 所在道路</div><div class="fr">' + properties['所在道路'] + '</div></div></div></div><div class="list"><ul class="list-left">' + sort(properties, obj3) +
			'</ul><ul class="list-right">' + sort(properties, obj4) + '</ul></div></div>';
		L.popup({
				minWidth: 460
			})
			.setLatLng(latlng)
			.setContent(popInfo)
			.openOn(map);
	}

	function sort(originObj, orderObj) {
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
	//yaoxi  --END

	function markerCluser() {
		ysurl = pipeUrl + "arcgis/rest/services/jhzhps/金华排水分级/MapServer/0";
		wsurl = pipeUrl + "arcgis/rest/services/jhzhps/金华排水分级/MapServer/1";

		// showMarkerCluster( '雨水',ysurl, markerList1, markerClusterGroup1, map);
		// showMarkerCluster('污水', wsurl, markerList, markerClusterGroup, map);
		// showMarkerCluster('雨水', ysurl, markerList1, markerClusterGroup1, map);
	}

	//聚合显示的主要代码
	function showMarkerCluster(title, dataUrl, markerList, markerClusterGroup, map) {
		L.esri.query({
			url: dataUrl
		}).run(function(error, collect) {
			var featuresList = collect.features;
			var featureCount = featuresList.length;
			for(var i = 0; i < featureCount; i++) {
				var item = featuresList[i];
				var geometry = item.geometry;
				var lat = geometry.coordinates[1];
				var lng = geometry.coordinates[0];

				var tooltip = "";
				tooltip += "<table cellpadding='0' cellspacing='0' border='0'><tr><td>";
				tooltip += "<div name='marker' class='map_mark'>";
				tooltip += "<span class='map_num'>" + title + "</span>";
				tooltip += "<div class='map_mark_inner'>";
				tooltip += " </div>";
				tooltip += "</td></tr></table>";

				// 点样式
				var pointStyle = L.divIcon({
					iconAnchor: [8, 8],
					//className: 'leaflet-divlabel',
					html: tooltip
				});

				marker = L.marker(L.latLng(lat, lng), {
					icon: pointStyle,
					riseOnHover: true,
				});
				markerList.push(marker);
				markerClusterGroup.addLayer(marker);

			}
			map.addLayer(markerClusterGroup);
		})

	}

	function hideHomepage() {
		$("#map_container2").css("display", "none");
		$("#panorama_container").css("display", "block");
		$(".right-Modular").css("display", "none");
		$(".right-user").css("display", "none");
		$(".Controllayer").css("display", "none");
		$(".Legend").css("display", "none");
		$(".left-frame>.i-input").css("display", "none");
		$(".left-frame>.query").css("display", "none");
		$(".left-frame>.positionLink").css("display", "none");
		$(".left-frame>.positionRecord").css("display", "none");
		$("body .left-frame").css("min-height", "44px");
	}

	function reopenHomepage() {
		$("#map_container2").css("display", "block");
		$("#panorama_container").css("display", "none");
		$(".right-Modular").css("display", "block");
		$(".right-user").css("display", "block");
		$(".Controllayer").css("display", "block");
		$(".Legend").css("display", "block");
		$(".left-frame>.i-input").css("display", "block");
		$("body .left-frame").css("min-height", "87px");
	}

	//生成属性列表
	function getTable(result, pageIndex, pageSize) {
		var data = "";
		if(result != "" && result != null) {
			//获取json数据
			if(selectedType.indexOf('line') != -1) {
				$.each(result.data, function(idx, item) {
					let orderNum = (pageIndex - 1) * pageSize + idx + 1;
					let qddh = item.QDDH;
					let zddh = item.ZDDH;
					let gj = item.GJ;
					let cz = item.CZ;
					let OBJECTID = item.ID;
					data += `<li data="${OBJECTID}" onclick="local('${selectedType}',${OBJECTID})">
                    <a href="javascript:;">
                           <div class="left">${orderNum}</div>
                    <div class="center">
                        <div class="tit">                            	 
                            	 <div class="info-left">#${qddh} -- #${zddh}</div>
                            	 <div class="right">                            	     
                            	         查看视频<img src="${resUrl}/视频.png" alt="查看视频" title="查看视频" onclick="showWellVideo(event)">
                            	     
                            	 </div>
                        </div>
                        <div class="content">
                                
                                <div class="bottom-left"><span class="bottom-name">管径：</span><span class="bottom-info">${gj}</span></div>
                                <div class="bottom-right"><span class="bottom-name">材质：</span><span class="bottom-info">${cz}</span></div>
                        </div>
                    </div>
                    
                    </a>
                </li> `;
				})
			} else {
				$.each(result.data, function(idx, item) {

					let orderNum = (pageIndex - 1) * pageSize + idx + 1;
					let wtdh = item.WTDH;
					let fsw = item.FSW;
					let jgcz = item.JGCZ;
					let OBJECTID = item.ID;
					data += `<li data="${wtdh}"  onclick="local('${selectedType}','${OBJECTID}')">
                    <a href="javascript:;">
                           <div class="left">${orderNum}</div>
                    <div class="center">
                        <div class="tit">
                            	<div class="info-left">管点 #${wtdh}</div>
                            	<div class="right">
                            	   
                            	        查看图片<img data="${wtdh}" class="wellImage" onclick="showWellImage(event)" src="${resUrl}/图片.png" alt="查看图片" title="查看图片">
                            	    
                            	</div>
                        </div>
                        <div class="content">
                                <div class="bottom-left"><span class="bottom-name">附属物：</span><span class="bottom-info">${fsw}</span></div>
                                <div class="bottom-right"><span class="bottom-name">材质：</span><span class="bottom-info">${jgcz}</span></div>
                        </div>
                    </div>
                    
                    </a>
                </li> `;
				});
			}

		}
		data = data === "" ? "<div class='nolist'>暂无数据</div>" : data;
		return data;
	}

	var show = 0;
	window.showMoreInfo = function(obj) {
		if(show) {
			$("div").find(".moreinfo").css("display", "none");
			$(obj).text("更多");
			show = 0;
		} else {
			$("div").find(".moreinfo").css("display", "block");
			$(obj).text("收起");
			show = 1;
		}
	}

	window.showWellImage = function(e) {
		e.stopPropagation();
		//取到物探编号
		var wtdh = $(e.target).attr('data');
		imgSrc = `${imageHref2}${wtdh}.jpg`;
		var img = $(`<img src="${imgSrc}">`);
		img.css('height', '800px').css('width', '600px');
		$("#imgContainer").empty().append(img);

		layer.open({
			type: 1,
			title: false,
			closeBtn: true,
			area: ['600px', '800px'],
			skin: 'layui-layer-nobg', //没有背景色
			shadeClose: false,
			shade: 0,
			content: $('#imgContainer')
		});
	}

	window.showWellVideo = function(e) {
		e.stopPropagation();
		var video = 'test.mp4',
			videoSrc1 = `${videoSrc2}${video}`;
		$("#wellVideo").attr('src', videoSrc1);

		layer.open({
			type: 1,
			title: false,
			closeBtn: true,
			area: ['600px', '485px'],
			skin: 'layui-layer-nobg', //没有背景色
			shadeClose: false,
			shade: 0,
			content: $('#videoContainer')
		});
	}

	window.local = function(layerType, objectID) {
		if(identifiedFeature) {
			map.removeLayer(identifiedFeature);
		}
		var url = "";
		switch(layerType) {
			case "yspoint":
				url = pipeUrl + "arcgis/rest/services/jhzhps/金华排水分级/MapServer/0";
				break;
			case "wspoint":
				url = pipeUrl + "arcgis/rest/services/jhzhps/金华排水分级/MapServer/1";
				break;
			case "ysline":
				url = pipeUrl + "arcgis/rest/services/jhzhps/金华排水分级/MapServer/2";
				break;
			case "wsline":
				url = pipeUrl + "arcgis/rest/services/jhzhps/金华排水分级/MapServer/3";
				break;
		}
		L.esri.query({
			url: url
		}).where("OBJECTID=" + objectID).run(function(err, featureCollection) {
			if(featureCollection && featureCollection.features.length == 1) {
				var feature = featureCollection.features[0];
				var latlng;
				identifiedFeature = L.geoJson(feature, {
					style: function() {
						return {
							color: '#F00'
						};
					}
				}).addTo(mapFlood);
				if(feature.geometry.type == "Point") {
					latlng = L.latLng(feature.geometry.coordinates.reverse());
				} else {
					latlng = L.latLng(feature.geometry.coordinates[0].reverse());
				}

				mapFlood.setView(latlng, 18);
				proToTable(feature.properties, latlng);
			}
		});
	}

	exports('overBurdenAnalysis', {})
});