layui.define([
	'admin',
	'layer',
	'laypage',
	'html5shiv',
	'global',
	'maputil',
	'customUtil'
], function(exports) {
	var $ = layui.jquery,
		laypage = layui.laypage,
		layer = layui.layer,
		maputil = layui.maputil,
		customUtil = layui.customUtil,
		global = layui.global;
	var resUrl = layui.setter.base + 'style/res';
	var getList = customUtil.getList,
		pageInit = customUtil.pageInit;
		
	$(function() {
		initWindow();
		maputil.initGlobal();
		initMap();
		maputil.showDataByZoom(map.getZoom())
		maputil.initMapControl();
		maputil.initMapEvent();
		initEvent();
		refreshIcon(yld);
		refreshIcon(shuizhi);
		refreshIcon(liuliang);
	})

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
			layers: [ys, ws, jcp, ywj, yld, bzp, wsca, markerGroup, analystHightLightGroup]
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

		//图例控制
		var trun = 1;
		$(".Legendname").click(function() {
			if(trun) {
				$(".Legendcontent").css("display", "block");
				$(".shrink").css("background", "url('" + resUrl + "/收起.png') no-repeat");
				trun = 0;
			} else {
				$(".Legendcontent").css("display", "none");
				$('.shrink').css("background", "url('" + resUrl + "/展开.png') no-repeat");
				trun = 1;
			}
		})
		$('.shrink').click(function(event) {
			if(trun) {
				$(".Legendcontent").css("display", "block");
				$(this).css("background", "url('" + resUrl + "/收起.png') no-repeat");
				trun = 0;
			} else {
				$(".Legendcontent").css("display", "none");
				$(this).css("background", "url('" + resUrl + "/展开.png') no-repeat");
				trun = 1;
			}
		});

		//图层控制
		var trun1 = 1;
		$(".Legendname1").click(function() {
			if(trun1) {
				$(".Legendcontent1").css("display", "block");
				$(".shrink1").css("background", "url('" + resUrl + "/收起.png') no-repeat");
				trun1 = 0;
			} else {
				$(".Legendcontent1").css("display", "none");
				$('.shrink1').css("background", "url('" + resUrl + "/展开.png') no-repeat");
				trun1 = 1;
			}
		})
		$('.shrink1').click(function(event) {
			if(trun1) {
				$(".Legendcontent1").css("display", "block");
				$(this).css("background", "url('" + resUrl + "/收起.png') no-repeat");
				trun1 = 0;
			} else {
				$(".Legendcontent1").css("display", "none");
				$(this).css("background", "url('" + resUrl + "/展开.png') no-repeat");
				trun1 = 1;
			}
		});

		$('.Legendcontent1 input:checkbox').on('click', function(e) {
			var el = e.target;
			var checked = el.checked;
			var value = el.value;
			switch(value) {
				case "雨水管线":
					if(!checked) {
						map.removeLayer(ys);
					} else {
						map.addLayer(ys);
					}
					break;
				case "污水管线":
					if(!checked) {
						map.removeLayer(ws);
					} else {
						map.addLayer(ws);
					}
					break;
				case "液位计":
					if(!checked) {
						map.removeLayer(ywj);
					} else {
						map.addLayer(ywj);
					}
					break;
				case "监测点":
					if(!checked) {
						map.removeLayer(jcp);
					} else {
						map.addLayer(jcp);
					}
					break;
				case "泵站":
					if(!checked) {
						map.removeLayer(bzp);
					} else {
						map.addLayer(bzp);
					}
					break;
				case "污水处理厂":
					if(!checked) {
						map.removeLayer(wsca);
					} else {
						map.addLayer(wsca);
					}
					break;
				case "易涝点":
					if(!checked) {
						map.removeLayer(yld);
					} else {
						map.addLayer(yld);
					}
					break;
				case "影像图":
					if(!checked) {
						map.removeLayer(raster);
						map.addLayer(vector);
					} else {
						map.addLayer(raster);
						map.removeLayer(vector);
					}
					break;
			}
		});

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
			} else {

			}
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

		map.on('click', function() {
			$(".positionLink,.positionRecord").css('display', 'none');
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

		getSearchHistory();
	}

	window.searchByHistory = function(road) {
		$(".searchInput")[0].value = road;
		$(".result").css("display", "block");
		$(".positionLink").css("display", "none");
		$(".positionRecord").css("display", "none");
		searchByRoad(road);
	}

	window.searchByRoad = function(road) {

		if(localStorage.getItem('searchHistory') != "") {
			var list = JSON.parse(localStorage.getItem('searchHistory')) || [];
			if(list.indexOf(road) != -1) {
				list.splice(list.indexOf(road), 1);
			}
			list.unshift(road);
			var last5 = list.slice(0, 5);
			localStorage.setItem('searchHistory', JSON.stringify(list))
			var searchHistory = "";
			last5.forEach(function(item) {
				searchHistory += `<li>
					<a href='javascript:;' onclick="searchByHistory('${item}')"><img src='${resUrl}/历史.png'>${item}</a>
				</li>`
			});
			searchHistory += `<li style="float: right;"  onclick="clearRecord()">
					<a href="javascript:;" style="text-align:right;padding-right:10px;" class="clearRecord">清空历史记录</a>
				</li>`;
			$(".positionRecord").empty().append(searchHistory);
		} else {
			localStorage.setItem('searchHistory', JSON.stringify([road]));
			$(".positionRecord").empty().append(`<li onclick="searchByHistory('${road}')">
					<a href='javascript:;' ><img src='${resUrl}/历史.png'>${road}</a>
				</li><li style="float: right;">
					<a onclick="clearRecord()" href="javascript:;" style="text-align:right;padding-right:10px;" class="clearRecord">清空历史记录</a>
				</li>`);
		}

		let dataUrl = encodeURI(`${backUrl}search/searchByType?type=${selectedType}&szdl=${road}`);
		getList(1, dataUrl, $("#listPanel"), $(".container.paginationWrap"), 'pagination', $("#searchRes"), getTable,10);
	}

	function getSearchHistory() {
		var list = JSON.parse(localStorage.getItem('searchHistory')) || [];
		var last5 = list.slice(0, 5);
		localStorage.setItem('searchHistory', JSON.stringify(list))
		var searchHistory = "";
		last5.forEach(function(item) {
			searchHistory += `<li onclick="searchByRoad('${item}')">
					<a href='javascript:;' ><img src='${resUrl}/历史.png'>${item}</a>
				</li>`
		});
		searchHistory += `<li style="float: right;">
					<a onclick="clearRecord()" href="javascript:;" style="text-align:right;padding-right:10px;" class="clearRecord">清空历史记录</a>
				</li>`;
		$(".positionRecord").empty().append(searchHistory);
	}

	function clearRecord() {
		$(".positionRecord").empty();
		localStorage.setItem('searchHistory', [])
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
			popInfo += `<div class="fl" id="message">管点信息</div><div class="fr"><a href="javascript:;" style="font-size: 10px;">图片查看<img  data="${properties['物探点号']}" src="${resUrl}/图片.png" alt="图片" onclick="showWellImage(event)" style="margin: -3px 0 0 3px;"></a></div></div><div style="padding:0 20px;"><div class="bcgblue"><div class="title"><span>雨水管点#${properties['OBJECTID']}</span><span id="photocode">井盖照片代码<strong style="font-size:14px;font-weight:normal;margin-left:8px;">${properties['OBJECTID']}</strong></span></div>`;
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
		$("body .left-frame").css("min-height", "44px");
	}

	function reopenHomepage() {
		$("#map_container").css("display", "block");
		$("#panorama_container").css("display", "none");
		$(".right-Modular").css("display", "block");
		$(".right-user").css("display", "block");
		$(".Controllayer").css("display", "block");
		$(".Legend").css("display", "block");
		$(".left-frame>.i-input").css("display", "block");
		$("body .left-frame").css("min-height", "87px");
	}
	//生成左侧河段列表
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

	window.showWellImage = function(e) {
		e.stopPropagation();
		//取到物探编号
		var wtdh = $(e.target).attr('data');
		imgSrc = `${imageHref}${wtdh}.jpg`;
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
			videoSrc1 = `${videoSrc}${video}`;
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
				}).addTo(map);
				if(feature.geometry.type == "Point") {
					latlng = L.latLng(feature.geometry.coordinates.reverse());
				} else {
					latlng = L.latLng(feature.geometry.coordinates[0].reverse());
				}

				map.setView(latlng, 18);
				proToTable(feature.properties, latlng);
			}
		});
	}

	function reopenHomepage() {
		$("#map_container").css("display", "block");
		$("#panorama_container").css("display", "none");
		$(".right-Modular").css("display", "block");
		$(".right-user").css("display", "block");
		$(".Controllayer").css("display", "block");
		$(".Legend").css("display", "block");
		$(".left-frame>.i-input").css("display", "block");
		$("body .left-frame").css("min-height", "87px");
	}
	
	function refreshIcon(MarkLayer){
		var arr=[];
		for(var p in MarkLayer._layers){
			arr.push(p);
		}
		setInterval(function(){
			$.ajax({
			url:backUrl + "alarm/judgeStatus",
			success:function(res){
				var data = res.data;
				data.forEach(function(item){	
					arr.forEach(function(p){
						var layer = MarkLayer._layers[p];
						if(layer.feature.properties.id == item.CHECK_POINT_ID){
							if(item.COUNT>0){
								if(layer.feature.properties.type==1){
									global.yldCurrentIcon=yld_redIcon1;
									layer.setIcon(yld_redIcon1);
								}
								if(layer.feature.properties.type==2){
									global.szCurrentIcon=sz_redIcon;
									layer.setIcon(sz_redIcon);
								}
								if(layer.feature.properties.type==3){
									global.llCurrentIcon=ll_redIcon;
									layer.setIcon(ll_redIcon);
								}
							}else{
								if(layer.feature.properties.type==1){
									global.yldCurrentIcon=yld_greenIcon1;
									layer.setIcon(yld_greenIcon1);
								}
								if(layer.feature.properties.type==2){
									global.szCurrentIcon=sz_greenIcon;
									layer.setIcon(sz_greenIcon);
								}
								if(layer.feature.properties.type==3){
									global.llCurrentIcon=ll_greenIcon;
									layer.setIcon(ll_greenIcon);
								}
							}
						}
					})
				})
			}
		});
		},5000);
		
	}

	exports('appMap', {})
})