layui.define([
	'admin',
	'layer',
	'laypage',
	'form',
	'html5shiv',
	'maputil',
	'customUtil',
	'nouislider',
	'leaflet-echarts',
	'echarts.source'
], function(exports) {
	var $ = layui.jquery,
		laypage = layui.laypage,
		layer = layui.layer,
		form = layui.form,
		maputil = layui.maputil,
		customUtil = layui.customUtil;

	var resUrl = layui.setter.base + 'style/res';
	var getList = customUtil.getList,
		pageInit = customUtil.pageInit;
	var overlay;
	var option = {
		color: ['gold', 'aqua', 'lime'],
		tooltip: {
			trigger: 'item',
			formatter: '{b} </br> 当前水深：{c}',
			zlevel: 900, // 一级层叠，频繁变化的tooltip指示器在pc上独立一层
			z: 800, // 二级层叠
			textStyle: {
				color: '#fff'
			}
		},

		dataRange: {
			show: true,
			min: 0,
			max: 50,
			calculable: true,
			//			color: ['#000079', '#0000C6', '#4A4AFF', '#9393FF'], //green-yellow-red
			//			color: ['#ff3333', 'orange', 'yellow', 'lime'],//green-yellow-red
			color: ['#ff3333', 'orange', 'lime'], //green-yellow-red
			textStyle: {
				color: '#000'
			}
		},
		series: [{
				name: 'jh',
				type: 'map',
				roam: true,
				hoverable: false,
				mapType: 'none',
				itemStyle: {
					normal: {
						borderColor: 'rgba(100,149,237,1)',
						borderWidth: 1,
						areaStyle: {
							color: '#1b1b1b'
						}
					}
				},
				data: [],
				geoCoord: {}
			},
			{
				name: 'jh',
				type: 'map',
				mapType: 'none',
				data: [],

				markPoint: {
					symbol: 'emptyCircle',
					symbolSize: function(v) {
						return v * 2
					},
					effect: {
						show: true,
						shadowBlur: 1,
						loop: true,
						period: 15,
						type: 'scale', // 可用为 scale | bounce
						scaleSize: 1, // 放大倍数，以markPoint点size为基准
						bounceDistance: 20 // 跳动距离，单位px
					},
					itemStyle: {
						normal: {
							label: {
								show: false
							}
						},
						emphasis: {
							label: {
								position: 'top'
							}
						}
					},
					data: []
				}
			}
		]
	};

	$(function() {
		form.render();
		initWindow();
		maputil.initGlobal();
		initMap();
		maputil.initMapControl();
		//maputil.initMapEvent();
		initEvent();
		initYLDData();
		initSilder();
		checkSwitchState();
	})

	window.myTimer = undefined;

	function checkSwitchState() {
		if(typeof($('input[type=checkbox]').attr("checked")) == "undefined") {
			if(myTimer) {
				clearInterval(myTimer);
			}
		} else {
			startTimer();
		}
		//监听指定开关
		form.on('switch(switchRealTime)', function(data) {
			if(this.checked) {
				startTimer();
			} else {
				if(myTimer) {
					clearInterval(myTimer);
				}
			}
		});
	}
	function startTimer() {
		myTimer = setInterval(function() {

			var now = new Date();
			today = getFormatDate(now);
			yesterday = getFormatDate(new Date(now.getTime() - 1 * 60 * 60 * 1000)); //间隔一小时
			let rainValue = 0;
			let waterValueJH = 30;
			let waterValueHPQ = 30;
			console.log(now);
			//水位数据
			$.ajax({
				type: "GET",
				//				url: backUrl + "/rain/getWaterInfo",
				url: backUrl + "/rain/getListByType",
				async: false,
				data: {
					stcd: 71345, //金华
					beginTime: yesterday,
					endTime: today,
					type: 2
				},
				success: function(result) {
					//var obj = JSON.parse(result);
					waterValueJH = parseFloat(GetLastValue(result));
				},
			});
			//水位数据
			$.ajax({
				type: "GET",
				url: backUrl + "/rain/getListByType",
				async: false,
				data: {
					stcd: 3134, //河盘桥
					beginTime: yesterday,
					endTime: today,
					type: 2
				},
				success: function(result) {
					//var obj = JSON.parse(result);
					waterValueHPQ = parseFloat(GetLastValue(result));
				},
			});
			//降雨数据
			$.ajax({
				type: "GET",
				url: backUrl + "/rain/getListByType",
				async: false,
				data: {
					stcd: 71345,
					beginTime: yesterday,
					endTime: today,
					type: 1
				},
				success: function(result) {
					//var obj = JSON.parse(result);
					rainValue = parseFloat(GetLastValue(result));

				}
			});
			//更新显示
			$("#txt1").val(rainValue);
			$("#txt2").val(waterValueHPQ);
			$("#txt3").val(waterValueJH);
			updataSlideValue(rainValue, waterValueHPQ, waterValueJH);
			updateEchats(rainValue, waterValueHPQ, waterValueJH);
		}, 1000); //10分钟获取一次数据
	}

	function GetLastValue(obj) {
		//		console.log(obj);
		var arr = obj.data;
		var d = arr[arr.length - 1];
		return d.val;
	}

	function getFormatDate(d) {
		var seperator1 = "-";
		var seperator2 = ":";
		var month = d.getMonth() + 1;
		var strDate = d.getDate();
		if(month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if(strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}

		var currentdate = d.getFullYear() + seperator1 + month + seperator1 + strDate + " " + d.getHours() + seperator2 + d.getMinutes() + seperator2 + d.getSeconds();
		return currentdate;
	}

	function initYLDData() {
		//
		overlay = new L.echartsLayer(map, echarts);
		var chartsContainer = overlay.getEchartsContainer();
		var myChart = overlay.initECharts(chartsContainer);
		window.onresize = myChart.onresize;
		//初始值
		updateEchats(30, 40, 30);
	}

	var arrCoord = {},
		arrData = new Array();

	function updateEchats(rainValue, waterValue1, waterValue2) {

		var rain = parseFloat(rainValue),
			water1 = parseFloat(waterValue1),
			water2 = parseFloat(waterValue2);
		arrData.length = 0;
		arrCoord = {};
		//易涝点模拟数据处理；
		L.geoJSON(geojsonYLD, {
			onEachFeature: function(feature, layer) {
				if(feature.properties.device == 1) {

					var lat = feature.geometry.coordinates[0],
						lng = feature.geometry.coordinates[1],
						k = feature.properties.name,
						paras = feature.properties.paras;
					//					debugger

					var v = paras.a * rain + paras.b * (water1 + water2) - paras.c;
					v = v > 0 ? v.toFixed(2) : 0;
					data = {
						name: k,
						value: v
					};
					arrData.push(data);
					arrCoord[k] = [lat, lng];
				}
			}
		});
		option.series[1].markPoint.data = arrData;
		option.series[0].geoCoord = arrCoord;
		overlay.setOption(option);
	}
	var range1, range2, range3;

	function updataSlideValue(rainValue, waterValue1, waterValue2) {
		range1.noUiSlider.set(rainValue);
		range2.noUiSlider.set(waterValue1);
		range3.noUiSlider.set(waterValue2);
	}

	function initSilder() {
		range1 = $('#range1')[0];
		noUiSlider.create(range1, {
			start: [0],
			step: 0.5,
			connect: [true, false],
			range: {
				'min': [0],
				'max': [300]
			}
		});
		range2 = $('#range2')[0];
		noUiSlider.create(range2, {
			start: [30.5],
			step: 0.02,
			connect: [true, false],
			range: {
				'min': [25],
				'max': [45]
			}
		});
		range3 = $('#range3')[0];
		noUiSlider.create(range3, {
			start: [34],
			step: 0.02,
			connect: [true, false],
			range: {
				'min': [25],
				'max': [45]
			}
		});

		range1.noUiSlider.on('update', function(values, handle, unencoded, isTap, positions) {
			updateEchats(values, range2.noUiSlider.get(), range3.noUiSlider.get());
			$("#txt1").val(values);
		});

		range2.noUiSlider.on('update', function(values, handle, unencoded, isTap, positions) {
			updateEchats(range1.noUiSlider.get(), values, range3.noUiSlider.get());
			$("#txt2").val(values);
		});

		range3.noUiSlider.on('update', function(values, handle, unencoded, isTap, positions) {
			updateEchats(range1.noUiSlider.get(), range2.noUiSlider.get(), values);
			$("#txt3").val(values);
		});

	}

	function initWindow() {
		// 初始化 map_container div 的大小
		$('#map_container').height($(window).height() - 107);
		// 监听浏览器窗口发生变化时，动态调整div的尺寸
		$(window).resize(function() {
			$('#map_container').height($(window).height() - 107);
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
			//layers: [ys, ws, yld, markerGroup, analystHightLightGroup]
			layers: [ys, ws, markerGroup, analystHightLightGroup]
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

	}

	exports('floodSimulator', {})
})