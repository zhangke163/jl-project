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
	proToTable = maputil.proToTable;
	var standardLevel = 14;
	$(function() {
		initWindow();
		maputil.initGlobal();
		yldCurrentIcon = maputil.yld_greenIcon1;
		szCurrentIcon = maputil.sz_greenIcon;
		llCurrentIcon = maputil.ll_greenIcon;
		initMap();		
		maputil.initMapControl();
		maputil.initMapEvent();
		initEvent();
		refreshState();
		maputil.showDataByZoom(map.getZoom());
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
			closePopupOnClick: false,
			boxZoom: true,
			dragging: true,
			minZoom: 12,
			maxZoom: 20,
			maxBounds: bounds,
			layers: [ghserverLayerTDT, jcp, ywj, yldg, bzp, wsca, wsggLayer, markerGroup, popupGroup, analystHightLightGroup]
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
		var trun = 0;
		$(".Legendname").click(function() {
			if(trun) {
				$(".Legendcontent").css("display", "block");
				$(".shrink").css("background", "url('" + resUrl + "/sq1.png') #fff 0 18px no-repeat");
				trun = 0;
			} else {
				$(".Legendcontent").css("display", "none");
				$('.shrink').css("background", "url('" + resUrl + "/zk1.png') #fff 0 18px no-repeat");
				trun = 1;
			}
		})
		$('.shrink').click(function(event) {
			if(trun) {
				$(".Legendcontent").css("display", "block");
				$(this).css("background", "url('" + resUrl + "/sq1.png') #fff 0 18px no-repeat");
				trun = 0;
			} else {
				$(".Legendcontent").css("display", "none");
				$(this).css("background", "url('" + resUrl + "/zk1.png') #fff 0 18px no-repeat");
				trun = 1;
			}
		});

		//图层控制
		var trun1 = 0;
		$(".Legendname1").click(function() {
			if(trun1) {
				$(".Legendcontent1").css("display", "block");
				$(".shrink1").css("background", "url('" + resUrl + "/sq1.png') no-repeat");
				trun1 = 0;
			} else {
				$(".Legendcontent1").css("display", "none");
				$('.shrink1').css("background", "url('" + resUrl + "/zk1.png') no-repeat");
				trun1 = 1;
			}
		})
		$('.shrink1').click(function(event) {
			if(trun1) {
				$(".Legendcontent1").css("display", "block");
				$(this).css("background", "url('" + resUrl + "/sq1.png') no-repeat");
				trun1 = 0;
			} else {
				$(".Legendcontent1").css("display", "none");
				$(this).css("background", "url('" + resUrl + "/zk1.png') no-repeat");
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
						map.removeLayer(yldg);
					} else {
						map.addLayer(yldg);
					}
					break;
				case "路网":
					if(!checked) {
						map.removeLayer(roadLayer);
					} else {
						map.addLayer(roadLayer);
					}
					break;
				case "污水干管":
					if(!checked) {
						map.removeLayer(wsggLayer);
					} else {
						map.addLayer(wsggLayer);
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
				case "街道全景":
					baiduFlag = !baiduFlag;
					if(!checked) {
						map.removeLayer(baiduLayer);
					} else {
						map.addLayer(baiduLayer);
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
			var dataUrl = encodeURI(`${backUrl}search/searchByType?type=${selectedType}&szdl=${road}`);

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
		getList(1, dataUrl, $("#listPanel"), $(".container.paginationWrap"), 'pagination', $("#searchRes"), getTable, 10);
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

	window.clearRecord = function() {
		$(".positionRecord").empty();
		localStorage.setItem('searchHistory', [])
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

	function nullChange(indexs) {
		if(indexs == "Null" || indexs == '' || indexs == null) {
			indexs = '未知';
		}
		return indexs;
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
					zddh = nullChange(zddh);
					gj = nullChange(gj);
					cz = nullChange(cz);
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
					fsw = nullChange(fsw);
					jgcz = nullChange(jgcz);
					wtdh = nullChange(wtdh);
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
		var img = $(`<img src="${imgSrc}" onerror="this.src='${resUrl}/hasNotImg.png'">`);
		img.css('height', '400px').css('width', '600px');
		$("#imgContainer").empty().append(img);

		layer.open({
			type: 1,
			title: false,
			closeBtn: true,
			area: ['600px', '400px'],
			//skin: 'layui-layer-nobg', //没有背景色
			shadeClose: false,
			shade: 0,
			content: $('#imgContainer')
		});
		/*}*/

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
		$("body .left-frame").css("display", "block");

	}
	//setInterval(refreshState, 10000);

	function refreshState() {
		maputil.getCurrentState(yld);
		maputil.getCurrentState(shuizhi);
		maputil.getCurrentState(liuliang);
		maputil.getCurrentData([yld, shuizhi, liuliang]);

	}

	Array.prototype.select = Array.prototype.map || function(selector, context) {
		context = context || window;
		var arr = [];
		var l = this.length;
		for(var i = 0; i < l; i++) {
			var item = selector.call(context, this[i], i, this);
			if(item !== undefined) {
				arr.push(item);
			}
		}
		return arr;
	};

	exports('map', {})
})