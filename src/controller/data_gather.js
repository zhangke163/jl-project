layui.define(function(exports) {
	layui.use(['echarts','global'], function() {
		var $ = layui.$,
			echarts = layui.echarts,global=layui.global;

		//绘制监测点类型统计图表
		var echarts_type = echarts.init(document.getElementById('LAY-index-data'), layui.echartsTheme),
				options_type = {
					//访客浏览器分布
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} (个)"
					},
					legend: {
						orient: 'vertical',
						right: '1%',
						bottom: '20%',
						data: []
					},
					series: [{
						name: '监测点类型',
						type: 'pie',
						radius: ['35%', '75%'],
						center: ['40%', '50%'],
						data: [],
						color: ['#eda958', '#ea5f59', '#0eccba', '#4885ff', '#7650ff', '#ffcb58'],
						label: {

							normal: {
								textStyle: {
									color: 'rgba(255, 255, 255, 0.3)'
								}
							}
						},
						labelLine: {
							normal: {
								show: false,
								lineStyle: {
									color: 'rgba(255, 255, 255, 0.3)'
								}
							}
						},
					}]
				};

		window.onresize = echarts_type.resize;
		echarts_type.setOption(options_type);

		//监测点类型统计
		$.get(global.ip.backUrl + 'checkPoint/countByType?origin=1', function(data) {

			var x_data_type = [],
					data_type = [],
					tmpArray = [],
					data_data = JSON.stringify(data.data).replace(/type/g, "name").replace(/COUNT/g, "value");

			data_type = JSON.parse(data_data);
			// console.log(data)
			
			data.data.forEach( function(element, index) {

				var monitor_gather = $('#monitor_gather');

				var monitor_html = '<div class="card-module new-module">'
													 + '<div class="module-name">' + element.type + '</div>'
													 + '<div class="module-num all-num">' + element.COUNT + '</div>'
													+ '</div>';
				monitor_gather.append(monitor_html);

				x_data_type.push(element.type);
			})

			echarts_type.setOption({
        legend: {
					data: x_data_type
				},
        series: [{
					name: '监测点类型',
					data: data_type,
				}]
	    });
		})

		//最新数据滚动
		// var scroll_box = $('.scroll-box');

		// //当从其他页面跳转到此页面时，清除已存在定时器scroll_timer
		// if(window.scroll_timer) {
		// 	window.clearInterval(window.scroll_timer)
		// }
		// window.scroll_timer = setInterval(function() {
		// 	var scroll_box_div = $('.scroll-box > div');

		// 	var elem = scroll_box_div.eq(0),
		// 		new_class = elem.attr('class');
		// 	this_width = elem.outerWidth();

		// 	elem.animate({
		// 		'margin-left': -this_width
		// 	}, 2000);

		// 	setTimeout(function() {
		// 		var new_elem = '<div ' + 'class="' + new_class + '">' + elem.html() + '</div>';
		// 		elem.remove();
		// 		scroll_box.append(new_elem);
		// 	}, 2000);

		// }, 5000);
		
		//易涝监测点最新数据
		$.get(global.ip.backUrl + 'checkPointData/getLastData?type=1', function(data) {
			// console.log(data.data)
			// data.data.forEach( function(element, index) {
			// 	var flood_new_data = $('#flood_new_data');

			// 	var flood_html = '<div class="card-module">'
			// 										+ '<div class="module-name" title="' + element.location + '">' + element.location + '</div>'
			// 										+ '<div class="module-num all-num">' + element.dataValue.toFixed(2) + '<span class="unit">m</span></div>'
			// 									+ '</div>';
			// 	flood_new_data.append(flood_html);
			// });
			for (var i = 0; i < 3; i++) {
				
				var flood_new_data = $('#flood_new_data');

				var flood_html = `<div class="card-module">
														<div class="module-name" title="${data.data[i].location}">${data.data[i].location}</div>
														<div class="module-num all-num" title="${data.data[i].recordTime}">${data.data[i].dataValue.toFixed(2)}<span class="unit">m</span></div>
													</div>`;
				flood_new_data.append(flood_html);
			}
		});

		//水质监测点最新数据
		$.get(global.ip.backUrl + 'checkPointData/getLastData?type=2', function(data) {
			// console.log(data.data)
			// data.data.forEach( function(element, index) {
			// 	var water_new_data = $('#water_new_data');

			// 	var water_html = `<div class="card-module">
			// 										<div class="module-name">${element.dataType}</div>
			// 										<div class="module-num all-num">${element.dataValue.toFixed(2)}<span class="unit">${element.unit}</span></div>
			// 									</div>`;
			// 	water_new_data.append(water_html);
			// });
			for (var i = 0; i < 4; i++) {
				
				var water_new_data = $('#water_new_data');

				var unit = data.data[i].unit;
				if (unit == 'm3/s') {
					unit = 'm³/s';
				} else if (unit == null) {
					unit = '';
				}

				var water_html = `<div class="card-module">
														<div class="module-name">${data.data[i].dataType}</div>
														<div class="module-num all-num" title="${data.data[i].recordTime}">${data.data[i].dataValue.toFixed(2)}<span class="unit">${unit}</span></div>
													</div>`;
				water_new_data.append(water_html);
			}
		});

		//流量监测点最新数据
		$.get(global.ip.backUrl + 'checkPointData/getLastData?type=3', function(data) {
			// for (var i = 0; i < 2; i++) {
				var flow_new_data = $('#flow_new_data');

				var flow_html = `<div class="card-module">
													<div class="module-name">${data.data[0].dataType}</div>
													<div class="module-num all-num" title="${data.data[0].recordTime}">${data.data[0].dataValue.toFixed(2)}<span class="unit">m³/s</span></div>
												</div>`;
				flow_new_data.append(flow_html);
			// }
		});

		function checkTime(time) { //校验时间,小于10前面加0
			if(time < 10) return "0" + time;
			return time;
		}

		//当从其他页面跳转到此页面时，清除已存在定时器timer
		if(window.timer) {
			window.clearInterval(window.timer)
		}
		//显示时分秒
		window.timer = setInterval(function() {
			var date = new Date();
			$("#time").html(checkTime(date.getHours()) + ":" + checkTime(date.getMinutes()) + ":" + checkTime(date.getSeconds()));
		}, 1000)

		var echartsApp = [],
			elemDataView = $('#LAY-index-dataview').children('div'),
			elemDataViewDiv0 = $('#LAY-index-dataview').children('div').eq(0).children('div'),
			elemDataViewDiv1 = $('#LAY-index-dataview').children('div').eq(1).children('div'),
			options = [];

		//监测数据统计-水质监测点今日数据-tab切换模块接口数据
		$.get(global.ip.backUrl + 'checkPointData/informationByType?type=2', function(data) {
			$('#new_tab_title li').click(function() {
				var _this = $(this),
					_index = _this.index();
				elemDataViewDiv1.hide().eq(_index).show();

				//根据TAB切换的index值确定绘制哪一个图表
				//获取绘制图表的对象
				// echartsApp[index] = echarts.init(elemDataView[1], layui.echartsTheme);
				// echartsApp[index].setOption(options[index]);
				// window.onresize = echartsApp[index].resize;

				if (_index == 0) {
					if (data.data.list != '今日无数据') {
						//公用的Y轴数据
						var dataBeast = [];
						//公用的X轴数据
						var xAxisData = [];

						data.data.list.forEach( function(element, index) {
							if (element.dataType == 'COD') {
								dataBeast.push(element.dataValue);
								var recordTime = element.recordTime;
								var newTime = recordTime.slice(11);
								xAxisData.push(newTime);
							}
						});

						//柱状的宽度
						var endPercent = (7 / xAxisData.length) * 100;

						options[0] = 
						{
							tooltip: {
								show: true,
								trigger: 'axis',
								axisPointer: { // 坐标轴指示器，坐标轴触发有效
									type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
								}
							},
							grid: {
								show: false,
								left: '3%',
								right: '4%',
								bottom: '5%',
								top: 120,
								containLabel: true
							},
							xAxis: {
								show: true,

								axisLabel: {
									interval: 0,
									// rotate:20,
									// margin: 20,
									textStyle: {
										color: '#323232',
										align: 'center'

									},
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisTick: {
									alignWithLabel: true,
									show: false
								},
								data: xAxisData,
								splitLine: {
									show: true,
									lineStyle: {
										color: ['#D8DBE7'],
										type: 'solid'
									}
								},
							},
							yAxis: [{
								type: 'value',
								name: 'mg/L',
								nameLocation: 'start',
								nameGap: 20,
								nameTextStyle: {
									color: '#BCBCBC',
									fontSize: 12
								},
								axisLabel: {
									textStyle: {
										color: '#323232',
									},
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisTick: {
									show: false
								},
								splitLine: {
									lineStyle: {
										color: ['#D8DBE7'],
										type: 'solid'
									}
								},
							}],
							// dataZoom: [ 
							//     { type: "inside"}
							// ],

							dataZoom: [ //给x轴设置滚动条
								{
									start: 0, //默认为0
									end: endPercent,
									type: 'slider',
									show: false,
								},
								//下面这个属性是里面拖到
								{
									type: 'inside',
									show: true,
									xAxisIndex: [0],
									start: 0, //默认为1
									end: 50
								}
							],
							series: [{
								type: 'bar',
								label: {
									normal: {
										show: false,
										position: 'top',
										textStyle: {
											fontSize: 12,
											color: '#0099FF'
										}
									}
								},
								itemStyle: {
									normal: {
										color: '#60BFFF'
									}
								},
								name: 'COD',
								barWidth: '40%',
								data: dataBeast
							}]
						}

						echartsApp[0] = echarts.init(elemDataViewDiv1[0], layui.echartsTheme);
						window.onresize = echartsApp[0].resize;
						echartsApp[0].setOption(options[0]);
						
					} else {
						var _data = `<div style="display: table;width: 100%;height: 100%;">
													<div style="display: table-cell;vertical-align: middle;text-align: center;">
														<img src="../src/style/res/noData.png">
													</div>
												</div>`;
						$(elemDataViewDiv1[0]).html(_data);
					}
				} else if (_index == 1) {
					if (data.data.list != '今日无数据') {
						//公用的Y轴数据
						var dataBeast = [];
						//公用的X轴数据
						var xAxisData = [];

						data.data.list.forEach( function(element, index) {
							if (element.dataType == 'PH') {
								dataBeast.push(element.dataValue);
								var recordTime = element.recordTime;
								var newTime = recordTime.slice(11);
								xAxisData.push(newTime);
							}
						});

						//柱状的宽度
						var endPercent = (7 / xAxisData.length) * 100;

						options[1] = 
						{
							tooltip: {
								show: true,
								trigger: 'axis',
								axisPointer: { // 坐标轴指示器，坐标轴触发有效
									type: 'line', // 默认为直线，可选为：'line' | 'shadow'
									lineStyle: {
										color: '#e0e0e0'
									}
								}
							},
							grid: {
								show: false,
								left: '3%',
								right: '4%',
								bottom: '5%',
								top: 120,
								containLabel: true
							},
							xAxis: {
								show: true,

								axisLabel: {
									interval: 0,
									// rotate:20,
									// margin: 20,
									textStyle: {
										color: '#323232',
										align: 'center'

									},
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisTick: {
									alignWithLabel: true,
									show: false
								},
								data: xAxisData,
								splitLine: {
									show: true,
									lineStyle: {
										color: ['#D8DBE7'],
										type: 'solid'
									}
								},
							},
							yAxis: [{
								type: 'value',
								name: '',
								nameLocation: 'start',
								nameGap: 20,
								nameTextStyle: {
									color: '#BCBCBC',
									fontSize: 12
								},
								axisLabel: {
									textStyle: {
										color: '#323232',
									},
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisTick: {
									show: false
								},
								splitLine: {
									lineStyle: {
										color: ['#D8DBE7'],
										type: 'solid'
									}
								},
							}],
							// dataZoom: [ 
							//     { type: "inside"}
							// ],

							dataZoom: [ //给x轴设置滚动条
								{
									start: 0, //默认为0
									end: endPercent,
									type: 'slider',
									show: false,
								},
								//下面这个属性是里面拖到
								{
									type: 'inside',
									show: true,
									xAxisIndex: [0],
									start: 0, //默认为1
									end: 50
								}
							],
							series: [{
								type: 'line',
								label: {
									normal: {
										show: false,
										position: 'top',
										textStyle: {
											fontSize: 12,
											color: '#0099FF'
										}
									}
								},
								itemStyle: {
									normal: {
										color: '#60BFFF'
									}
								},
								name: 'PH值',
								barWidth: '40%',
								data: dataBeast
							}]
						}

						echartsApp[1] = echarts.init(elemDataViewDiv1[1], layui.echartsTheme);
						window.onresize = echartsApp[1].resize;
						echartsApp[1].setOption(options[1]);
					} else {
						var _data = `<div style="display: table;width: 100%;height: 100%;">
													<div style="display: table-cell;vertical-align: middle;text-align: center;">
														<img src="../src/style/res/noData.png">
													</div>
												</div>`;
						$(elemDataViewDiv1[1]).html(_data);
					}
				} else if (_index == 2) {
					if (data.data.list != '今日无数据') {
						//公用的Y轴数据
						var dataBeast = [];
						//公用的X轴数据
						var xAxisData = [];

						data.data.list.forEach( function(element, index) {
							if (element.dataType == '氨氮') {
								dataBeast.push(element.dataValue);
								var recordTime = element.recordTime;
								var newTime = recordTime.slice(11);
								xAxisData.push(newTime);
							}
						});

						//柱状的宽度
						var endPercent = (7 / xAxisData.length) * 100;

						options[2] = 
						{
							tooltip: {
								show: true,
								trigger: 'axis',
								axisPointer: { // 坐标轴指示器，坐标轴触发有效
									type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
								}
							},
							grid: {
								show: false,
								left: '3%',
								right: '4%',
								bottom: '5%',
								top: 120,
								containLabel: true
							},
							xAxis: {
								show: true,

								axisLabel: {
									interval: 0,
									// rotate:20,
									// margin: 20,
									textStyle: {
										color: '#323232',
										align: 'center'

									},
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisTick: {
									alignWithLabel: true,
									show: false
								},
								data: xAxisData,
								splitLine: {
									show: true,
									lineStyle: {
										color: ['#D8DBE7'],
										type: 'solid'
									}
								},
							},
							yAxis: [{
								type: 'value',
								name: 'mg/L',
								nameLocation: 'start',
								nameGap: 20,
								nameTextStyle: {
									color: '#BCBCBC',
									fontSize: 12
								},
								axisLabel: {
									textStyle: {
										color: '#323232',
									},
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisTick: {
									show: false
								},
								splitLine: {
									lineStyle: {
										color: ['#D8DBE7'],
										type: 'solid'
									}
								},
							}],
							// dataZoom: [ 
							//     { type: "inside"}
							// ],

							dataZoom: [ //给x轴设置滚动条
								{
									start: 0, //默认为0
									end: endPercent,
									type: 'slider',
									show: false,
								},
								//下面这个属性是里面拖到
								{
									type: 'inside',
									show: true,
									xAxisIndex: [0],
									start: 0, //默认为1
									end: 50
								}
							],
							series: [{
								type: 'bar',
								label: {
									normal: {
										show: false,
										position: 'top',
										textStyle: {
											fontSize: 12,
											color: '#0099FF'
										}
									}
								},
								itemStyle: {
									normal: {
										color: '#60BFFF'
									}
								},
								name: '氨氮',
								barWidth: '40%',
								data: dataBeast
							}]
						}

						echartsApp[2] = echarts.init(elemDataViewDiv1[2], layui.echartsTheme);
						window.onresize = echartsApp[2].resize;
						echartsApp[2].setOption(options[2]);
						
					} else {
						var _data = `<div style="display: table;width: 100%;height: 100%;">
													<div style="display: table-cell;vertical-align: middle;text-align: center;">
														<img src="../src/style/res/noData.png">
													</div>
												</div>`;
												
						$(elemDataViewDiv1[2]).html(_data);
					}
				} else if (_index == 3) {
					if (data.data.list != '今日无数据') {
						//公用的Y轴数据
						var dataBeast = [];
						//公用的X轴数据
						var xAxisData = [];

						data.data.list.forEach( function(element, index) {
							if (element.dataType == '总磷') {
								dataBeast.push(element.dataValue);
								var recordTime = element.recordTime;
								var newTime = recordTime.slice(11);
								xAxisData.push(newTime);
							}
						});

						//柱状的宽度
						var endPercent = (7 / xAxisData.length) * 100;

						options[3] = 
						{
							tooltip: {
								show: true,
								trigger: 'axis',
								axisPointer: { // 坐标轴指示器，坐标轴触发有效
									type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
								}
							},
							grid: {
								show: false,
								left: '3%',
								right: '4%',
								bottom: '5%',
								top: 120,
								containLabel: true
							},
							xAxis: {
								show: true,

								axisLabel: {
									interval: 0,
									// rotate:20,
									// margin: 20,
									textStyle: {
										color: '#323232',
										align: 'center'

									},
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisTick: {
									alignWithLabel: true,
									show: false
								},
								data: xAxisData,
								splitLine: {
									show: true,
									lineStyle: {
										color: ['#D8DBE7'],
										type: 'solid'
									}
								},
							},
							yAxis: [{
								type: 'value',
								name: 'mg/L',
								nameLocation: 'start',
								nameGap: 20,
								nameTextStyle: {
									color: '#BCBCBC',
									fontSize: 12
								},
								axisLabel: {
									textStyle: {
										color: '#323232',
									},
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisTick: {
									show: false
								},
								splitLine: {
									lineStyle: {
										color: ['#D8DBE7'],
										type: 'solid'
									}
								},
							}],
							// dataZoom: [ 
							//     { type: "inside"}
							// ],

							dataZoom: [ //给x轴设置滚动条
								{
									start: 0, //默认为0
									end: endPercent,
									type: 'slider',
									show: false,
								},
								//下面这个属性是里面拖到
								{
									type: 'inside',
									show: true,
									xAxisIndex: [0],
									start: 0, //默认为1
									end: 50
								}
							],
							series: [{
								type: 'bar',
								label: {
									normal: {
										show: false,
										position: 'top',
										textStyle: {
											fontSize: 12,
											color: '#0099FF'
										}
									}
								},
								itemStyle: {
									normal: {
										color: '#60BFFF'
									}
								},
								name: '总磷',
								barWidth: '40%',
								data: dataBeast
							}]
						}

						echartsApp[3] = echarts.init(elemDataViewDiv1[3], layui.echartsTheme);
						window.onresize = echartsApp[3].resize;
						echartsApp[3].setOption(options[3]);
						
					} else {
						var _data = `<div style="display: table;width: 100%;height: 100%;">
													<div style="display: table-cell;vertical-align: middle;text-align: center;">
														<img src="../src/style/res/noData.png">
													</div>
												</div>`;
						$(elemDataViewDiv1[3]).html(_data);
					}
				}
			});
		})

		//监测数据统计-易涝点水位今日数据-tab切换模块接口数据
		$.get(global.ip.backUrl + 'checkPointData/informationByType?type=1', function(data) {
			$('#new_tab_title_1 li').click(function() {
				var _this = $(this),
					_index = _this.index();
				elemDataViewDiv0.hide().eq(_index).show();

				if (_index == 0) {
					if (data.data.list1) {
						//公用的Y轴数据
						var dataBeast = [];
						//公用的X轴数据
						var xAxisData = [];

						data.data.list1.forEach( function(element, index) {
							dataBeast.push(element.dataValue);
							var recordTime = element.recordTime;
							var newTime = recordTime.slice(11);
							xAxisData.push(newTime);
						});

						options[0] = 
						{
							tooltip: {
								trigger: 'axis',
								axisPointer: {
									lineStyle: {
										color: '#ddd'
									}
								},
								padding: [5, 10]
							},
							backgroundColor: '#ffffff',
							grid: {
								show: false,
								backgroundColor: '#ffffff',
								left: '3%',
								right: '4%',
								bottom: '5%',
								top: 120,
								containLabel: true
							},
							xAxis: {
								type: 'category',
								data: xAxisData,
								boundaryGap: false,
								axisTick: {
									show: false
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisLabel: {
									margin: 10,
									textStyle: {
										fontSize: 12,
										color: '#323232'
									}
								},
								splitLine: {
									show: true,
									lineStyle: {
										color: ['#efefef'],
										type: 'solid'
									}
								},
							},
							yAxis: {
								type: 'value',
								name: 'm',
								nameLocation: 'end',
								nameGap: 10,
								nameTextStyle: {
									color: '#BCBCBC',
									fontSize: 12
								},
								splitLine: {
									lineStyle: {
										color: ['#efefef'],
										type: 'solid'
									}
								},
								axisTick: {
									show: false,
									inside: true,
									lineStyle: {
										color: '#7B88B5'
									}
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisLabel: {
									margin: 10,
									textStyle: {
										fontSize: 12,
										color: '#323232'
									}
								},
								splitArea: {
									show: true,
									// color: ['#ffffff','#e3e3e3']
								}
							},
					    dataZoom: [ //给x轴设置滚动条
								{
									start: 0, //默认为0
									end: 100,
									type: 'slider',
									show: false,
								},
								//下面这个属性是里面拖到
								{
									type: 'inside',
									show: true,
									xAxisIndex: [0],
									start: 0, //默认为1
									end: 50
								}
							],
							series: [{
								name: '易涝点1',
								type: 'line',
								smooth: true,
								showSymbol: true,
								// symbol: 'circle',
								symbolSize: 6,
								data: dataBeast,
								areaStyle: {
									normal: {
										color: 'rgba(182, 162, 222,1)'
									}
								},
								itemStyle: {
									normal: {
										color: '#b6a2de'
									}
								},
								lineStyle: {
									normal: {
										width: 2
									}
								}
							}]
						}

						echartsApp[0] = echarts.init(elemDataViewDiv0[0], layui.echartsTheme);
						window.onresize = echartsApp[0].resize;
						echartsApp[0].setOption(options[0]);
						
					} else {

						var _data = `<div style="display: table;width: 100%;height: 100%;">
													<div style="display: table-cell;vertical-align: middle;text-align: center;">
														<img src="../src/style/res/noData.png">
													</div>
												</div>`;
						$(elemDataViewDiv0[0]).html(_data);
					}
				} else if (_index == 1) {
					if (data.data.list2) {
						//公用的Y轴数据
						var dataBeast = [];
						//公用的X轴数据
						var xAxisData = [];

						data.data.list2.forEach( function(element, index) {
							dataBeast.push(element.dataValue);
							var recordTime = element.recordTime;
							var newTime = recordTime.slice(11);
							xAxisData.push(newTime);
						});

						options[1] = 
						{
							tooltip: {
								trigger: 'axis',
								axisPointer: {
									lineStyle: {
										color: '#ddd'
									}
								},
								padding: [5, 10]
							},
							backgroundColor: '#ffffff',
							grid: {
								show: false,
								backgroundColor: '#ffffff',
								left: '3%',
								right: '4%',
								bottom: '5%',
								top: 120,
								containLabel: true
							},
							xAxis: {
								type: 'category',
								data: xAxisData,
								boundaryGap: false,
								axisTick: {
									show: false
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisLabel: {
									margin: 10,
									textStyle: {
										fontSize: 12,
										color: '#323232'
									}
								},
								splitLine: {
									show: true,
									lineStyle: {
										color: ['#efefef'],
										type: 'solid'
									}
								},
							},
							yAxis: {
								type: 'value',
								name: 'm',
								nameLocation: 'end',
								nameGap: 10,
								nameTextStyle: {
									color: '#BCBCBC',
									fontSize: 12
								},
								splitLine: {
									lineStyle: {
										color: ['#efefef'],
										type: 'solid'
									}
								},
								axisTick: {
									show: false,
									inside: true,
									lineStyle: {
										color: '#7B88B5'
									}
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisLabel: {
									margin: 10,
									textStyle: {
										fontSize: 12,
										color: '#323232'
									}
								},
								splitArea: {
									show: true,
									// color: ['#ffffff','#e3e3e3']
								}
							},
							dataZoom: [ //给x轴设置滚动条
								{
									start: 0, //默认为0
									end: 100,
									type: 'slider',
									show: false,
								},
								//下面这个属性是里面拖到
								{
									type: 'inside',
									show: true,
									xAxisIndex: [0],
									start: 0, //默认为1
									end: 50
								}
							],
							series: [{
								name: '易涝点2',
								type: 'line',
								smooth: true,
								showSymbol: true,
								// symbol: 'circle',
								symbolSize: 6,
								data: dataBeast,
								areaStyle: {
									normal: {
										color: 'rgba(46, 199, 201,0.7)'
									}
								},
								itemStyle: {
									normal: {
										color: '#2ec7c9'
									}
								},
								lineStyle: {
									normal: {
										width: 2
									}
								}
							}]
						}

						echartsApp[1] = echarts.init(elemDataViewDiv0[1], layui.echartsTheme);
						window.onresize = echartsApp[1].resize;
						echartsApp[1].setOption(options[1]);
						
					} else {

						var _data = `<div style="display: table;width: 100%;height: 100%;">
													<div style="display: table-cell;vertical-align: middle;text-align: center;">
														<img src="../src/style/res/noData.png">
													</div>
												</div>`;
						$(elemDataViewDiv0[1]).html(_data);
					}
				} else if (_index == 2) {
					if (data.data.list3) {
						//公用的Y轴数据
						var dataBeast = [];
						//公用的X轴数据
						var xAxisData = [];

						data.data.list3.forEach( function(element, index) {
							dataBeast.push(element.dataValue);
							var recordTime = element.recordTime;
							var newTime = recordTime.slice(11);
							xAxisData.push(newTime);
						});

						options[2] = 
						{
							tooltip: {
								trigger: 'axis',
								axisPointer: {
									lineStyle: {
										color: '#ddd'
									}
								},
								padding: [5, 10]
							},
							backgroundColor: '#ffffff',
							grid: {
								show: false,
								backgroundColor: '#ffffff',
								left: '3%',
								right: '4%',
								bottom: '5%',
								top: 120,
								containLabel: true
							},
							xAxis: {
								type: 'category',
								data: xAxisData,
								boundaryGap: false,
								axisTick: {
									show: false
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisLabel: {
									margin: 10,
									textStyle: {
										fontSize: 12,
										color: '#323232'
									}
								},
								splitLine: {
									show: true,
									lineStyle: {
										color: ['#efefef'],
										type: 'solid'
									}
								},
							},
							yAxis: {
								type: 'value',
								name: 'm',
								nameLocation: 'end',
								nameGap: 10,
								nameTextStyle: {
									color: '#BCBCBC',
									fontSize: 12
								},
								splitLine: {
									lineStyle: {
										color: ['#efefef'],
										type: 'solid'
									}
								},
								axisTick: {
									show: false,
									inside: true,
									lineStyle: {
										color: '#7B88B5'
									}
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisLabel: {
									margin: 10,
									textStyle: {
										fontSize: 12,
										color: '#323232'
									}
								},
								splitArea: {
									show: true,
									// color: ['#ffffff','#e3e3e3']
								}
							},
							dataZoom: [ //给x轴设置滚动条
								{
									start: 0, //默认为0
									end: 100,
									type: 'slider',
									show: false,
								},
								//下面这个属性是里面拖到
								{
									type: 'inside',
									show: true,
									xAxisIndex: [0],
									start: 0, //默认为1
									end: 50
								}
							],
							series: [{
								name: '易涝点3',
								type: 'line',
								smooth: true,
								showSymbol: true,
								// symbol: 'circle',
								symbolSize: 6,
								data: dataBeast,
								areaStyle: {
									normal: {
										color: 'rgba(90, 177, 239,0.7)'
									}
								},
								itemStyle: {
									normal: {
										color: '#5ab1ef'
									}
								},
								lineStyle: {
									normal: {
										width: 2
									}
								}
							}]
						}

						echartsApp[2] = echarts.init(elemDataViewDiv0[2], layui.echartsTheme);
						window.onresize = echartsApp[2].resize;
						echartsApp[2].setOption(options[2]);
						
					} else {

						var _data = `<div style="display: table;width: 100%;height: 100%;">
													<div style="display: table-cell;vertical-align: middle;text-align: center;">
														<img src="../src/style/res/noData.png">
													</div>
												</div>`;
						$(elemDataViewDiv0[2]).html(_data);
					}
				}
			})
		})

		//报警情况
		$.get(global.ip.backUrl + 'alarm/countByStatus?origin=1', function(data) {
			// console.log(data.count)
			$('#alarm_total').html(data.count);
			data.data.forEach( function(element, index) {
				// console.log(element.STATUS)

				if (element.STATUS == "已忽略") {
					$('#alarm_not_do').html(element.COUNT);
				} else if (element.STATUS == "已处理") {
					$('#alarm_finish').html(element.COUNT);
				} else if (element.STATUS == "处理中") {
					$('#alarm_doing').html(element.COUNT);
				}
			});
		});

		
	});

	//区块轮播切换
	layui.use(['admin', 'carousel'], function() {
		var $ = layui.$,
			admin = layui.admin,
			carousel = layui.carousel,
			element = layui.element,
			device = layui.device();

		//轮播切换
		$('.layadmin-carousel').each(function() {
			var othis = $(this);
			carousel.render({
				elem: this,
				width: '100%',
				arrow: 'none',
				interval: othis.data('interval'),
				autoplay: othis.data('autoplay') === true,
				trigger: (device.ios || device.android) ? 'click' : 'hover',
				anim: othis.data('anim')
			});
		});

		element.render('progress');

	});

	//数据概览
	layui.use(['carousel', 'echarts','global'], function() {
		// debugger
		var $ = layui.$,
			carousel = layui.carousel,
			echarts = layui.echarts,global = layui.global;


		var echartsApp = [],
			options = [],
		elemDataView = $('#LAY-index-dataview').children('div'),
		elemDataViewDiv0 = $('#LAY-index-dataview').children('div').eq(0).children('div'),
		elemDataViewDiv1 = $('#LAY-index-dataview').children('div').eq(1).children('div'),
		renderDataView = function(index) {
			// echartsApp[index] = echarts.init(elemDataView[index], layui.echartsTheme, );

			// window.onresize = echartsApp[index].resize;
			// echartsApp[index].setOption(options[index]);
			if (index == 0) {
				//轮播模块易涝点水位今日数据
				$.get(global.ip.backUrl + 'checkPointData/informationByType?type=1', function(data) {
					// console.log(data.data.list)

					var bigest = $('#bigest');
					bigest.html('');
					data.data.bigest.forEach( function(element, index) {
						var bigest_html = `<div class="card-module new-module">
																<div> 
																	<div class="module-name">${element.location}</div> 
																	<div class="module-num unfinish" title="${element.day}">${element.dataValue.toFixed(2)}<span class="unit">m</span></div>
																</div>
															</div>`;
						bigest.append(bigest_html);
					});
					
					var avg = $('#avg');
					avg.html('');
					if (data.data.avg != '今日无数据') {
						data.data.avg.forEach( function(element, index) {
							

							var avg_html = '<div class="card-module new-module">' + 
															'<div>' + 
																'<div class="module-name">' + element.location + '</div>' + 
																'<div class="module-num all-num">' + element.dataValue.toFixed(2) + '<span class="unit">m</span></div>' + 
															'</div>' +
														'</div>';
							avg.append(avg_html);
						});
					} else {
						for (var i = 0; i < 3; i++) {
							// var avg = $('#avg');

							var avg_html = `<div class="card-module new-module">
																<div>
																	<div class="module-name">无易涝点数据</div>
																	<div class="module-num all-num"><span class="unit">无</span></div>
																</div>
															</div>`;
							avg.append(avg_html);
						}
					}

					elemDataViewDiv0.hide().eq(0).show();
					if (data.data.list1) {
						var dataBeast = [];
						//公用的X轴数据
						var xAxisData = [];

						data.data.list1.forEach( function(element, index) {
							dataBeast.push(element.dataValue);
							var recordTime = element.recordTime;
							var newTime = recordTime.slice(11);
							xAxisData.push(newTime);
						});

						options[0] =
						{
							tooltip: {
								trigger: 'axis',
								axisPointer: {
									lineStyle: {
										color: '#ddd'
									}
								},
								padding: [5, 10]
							},
							backgroundColor: '#ffffff',
							legend: {
								x: 'center',
								y: 50,
								align: 'right',
								textStyle: {
									color: '#868686',
									fontSize: 12
								},
								data: ['易涝点1', '易涝点2', '易涝点3']
							},
							grid: {
								show: false,
								backgroundColor: '#ffffff',
								left: '3%',
								right: '4%',
								bottom: '5%',
								top: 120,
								containLabel: true
							},
							xAxis: {
								type: 'category',
								data: xAxisData,
								boundaryGap: false,
								axisTick: {
									show: false
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisLabel: {
									margin: 10,
									textStyle: {
										fontSize: 12,
										color: '#323232'
									}
								},
								splitLine: {
									show: true,
									lineStyle: {
										color: ['#efefef'],
										type: 'solid'
									}
								},
							},
							yAxis: {
								type: 'value',
								name: 'm',
								nameLocation: 'end',
								nameGap: 10,
								nameTextStyle: {
									color: '#BCBCBC',
									fontSize: 12
								},
								splitLine: {
									lineStyle: {
										color: ['#efefef'],
										type: 'solid'
									}
								},
								axisTick: {
									show: false,
									inside: true,
									lineStyle: {
										color: '#7B88B5'
									}
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisLabel: {
									margin: 10,
									textStyle: {
										fontSize: 12,
										color: '#323232'
									}
								},
								splitArea: {
									show: true,
									// color: ['#ffffff','#e3e3e3']
								}
							},
							dataZoom: [ //给x轴设置滚动条
								{
									start: 0, //默认为0
									end: 100,
									type: 'slider',
									show: false,
								},
								//下面这个属性是里面拖到
								{
									type: 'inside',
									show: true,
									xAxisIndex: [0],
									start: 0, //默认为1
									end: 50
								}
							],
							series: [{
								name: '易涝点1',
								type: 'line',
								smooth: true,
								showSymbol: true,
								// symbol: 'circle',
								symbolSize: 6,
								data: dataBeast,
								areaStyle: {
									normal: {
										color: 'rgba(182, 162, 222,1)'
									}
								},
								itemStyle: {
									normal: {
										color: '#b6a2de'
									}
								},
								lineStyle: {
									normal: {
										width: 2
									}
								}
							}]
						}

						echartsApp[0] = echarts.init(elemDataViewDiv0[0], layui.echartsTheme);

						window.onresize = echartsApp[0].resize;
						echartsApp[0].setOption(options[0]);
					} else {

						var _data = `<div style="display: table;width: 100%;height: 100%;">
													<div style="display: table-cell;vertical-align: middle;text-align: center;">
														<img src="../src/style/res/noData.png">
													</div>
												</div>`;
						$(elemDataViewDiv0[0]).html(_data);
					}
					
				});
			} else if (index == 1) {
				//轮播模块水质监测点今日数据
				$.get(global.ip.backUrl + 'checkPointData/informationByType?type=2', function(data) {
					// console.log(data.data.list)

					elemDataViewDiv1.hide().eq(0).show();
					if (data.data.list != '今日无数据') {
						//公用的Y轴数据
						var dataBeast = [];
						//公用的X轴数据
						var xAxisData = [];

						data.data.list.forEach( function(element, index) {
							if (element.dataType == 'COD') {
								dataBeast.push(element.dataValue);
								var recordTime = element.recordTime;
								var newTime = recordTime.slice(11);
								xAxisData.push(newTime);
							}
						});

						//柱状的宽度
						var endPercent = (7 / xAxisData.length) * 100;

						options[1] =
						{
							tooltip: {
								show: true,
								trigger: 'axis',
								axisPointer: { // 坐标轴指示器，坐标轴触发有效
									type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
								}
							},
							grid: {
								show: false,
								left: '3%',
								right: '4%',
								bottom: '5%',
								top: 120,
								containLabel: true
							},
							xAxis: {
								show: true,

								axisLabel: {
									interval: 0,
									// rotate:20,
									// margin: 20,
									textStyle: {
										color: '#323232',
										align: 'center'

									},
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisTick: {
									alignWithLabel: true,
									show: false
								},
								data: xAxisData,
								splitLine: {
									show: true,
									lineStyle: {
										color: ['#D8DBE7'],
										type: 'solid'
									}
								},
							},
							yAxis: [{
								type: 'value',
								name: 'mg/L',
								nameLocation: 'start',
								nameGap: 20,
								nameTextStyle: {
									color: '#BCBCBC',
									fontSize: 12
								},
								axisLabel: {
									textStyle: {
										color: '#323232',
									},
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisTick: {
									show: false
								},
								splitLine: {
									lineStyle: {
										color: ['#D8DBE7'],
										type: 'solid'
									}
								},
							}],
							// dataZoom: [ 
							//     { type: "inside"}
							// ],

							dataZoom: [ //给x轴设置滚动条
								{
									start: 0, //默认为0
									end: endPercent,
									type: 'slider',
									show: false,
								},
								//下面这个属性是里面拖到
								{
									type: 'inside',
									show: true,
									xAxisIndex: [0],
									start: 0, //默认为1
									end: 50
								}
							],
							series: [{
								type: 'bar',
								label: {
									normal: {
										show: false,
										position: 'top',
										textStyle: {
											fontSize: 12,
											color: '#0099FF'
										}
									}
								},
								itemStyle: {
									normal: {
										color: '#60BFFF'
									}
								},
								name: 'COD',
								barWidth: '40%',
								data: dataBeast
							}]
						}

						echartsApp[1] = echarts.init(elemDataViewDiv1[0], layui.echartsTheme);

						window.onresize = echartsApp[1].resize;
						echartsApp[1].setOption(options[1]);
					} else {

						var _data = `<div style="display: table;width: 100%;height: 100%;">
													<div style="display: table-cell;vertical-align: middle;text-align: center;">
														<img src="../src/style/res/noData.png">
													</div>
												</div>`;
						$(elemDataViewDiv1[0]).html(_data);
					}


					var bigest = $('#bigest_1');
					bigest.html('');
					data.data.bigest.forEach( function(element, index) {
						

						var bigest_html = `<div class="card-module new-module">
																<div> 
																	<div class="module-name">${element.dataType}</div>
																	<div class="module-num unfinish" title="${element.day}">${element.dataValue.toFixed(2)}<span class="unit">mg/L</span></div>
																</div>
															</div>`;

						// var bigest_html_1 = '<div class="card-module new-module">' + 
						// 										'<div>' + 
						// 											'<div class="module-name">' + element.dataType + '</div>' + 
						// 											'<div class="module-num unfinish">' + element.dataValue + '<span class="unit"></span></div>' + 
						// 										'</div>' +
						// 									'</div>';

						
						if (element.dataType == 'PH') {
							bigest.append('');
						} else {
							bigest.append(bigest_html);
						}
					});
					
					var avg = $('#avg_1');
					avg.html('');
					if (data.data.avg != '今日无数据') {
						data.data.avg.forEach( function(element, index) {
							

							var avg_html = `<div class="card-module set-col-3">
															<div>
																<div class="module-name">${element.dataType}</div>
																<div class="module-num all-num">${element.dataValue.toFixed(2)}<span class="unit">${element.unit}</span></div>
															</div>
														</div>`;
							
							avg.append(avg_html);
						});
					} else {
						for (var i = 0; i < 3; i++) {
							// var avg = $('#avg');

							var avg_html = `<div class="card-module new-module">
																<div>
																	<div class="module-name">无水质数据</div>
																	<div class="module-num all-num"><span class="unit">无</span></div>
																</div>
															</div>`;
							avg.append(avg_html);
						}
					}
				});
			} else if (index == 2) {
				//轮播模块流量监测点今日数据
				$.get(global.ip.backUrl + 'checkPointData/informationByType?type=3', function(data) {
					// console.log(data.data.list)

					if (data.data.list != '今日无数据') {
						//公用的Y轴数据
						var dataBeast = [];
						//公用的X轴数据
						var xAxisData = [];
						// var data_index = [];

						data.data.list.forEach( function(element, index) {
							// xAxisData.push(element.recordTime);
							var recordTime = element.recordTime;
							var newTime = recordTime.slice(11);
							xAxisData.push(newTime);
							dataBeast.push(element.dataValue);
						});

						options[2] =
						{
							tooltip: {
								trigger: 'axis',
								axisPointer: {
									lineStyle: {
										color: '#ddd'
									}
								},
								padding: [5, 10]
							},
							backgroundColor: '#ffffff',
							legend: {
								x: 'center',
								y: 50,
								align: 'right',
								textStyle: {
									color: '#868686',
									fontSize: 12
								},
								data: ['流量']
							},
							grid: {
								show: false,
								backgroundColor: '#ffffff',
								left: '3%',
								right: '4%',
								bottom: '5%',
								top: 120,
								containLabel: true
							},
							xAxis: {
								type: 'category',
								data: xAxisData,
								boundaryGap: false,
								axisTick: {
									show: false
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisLabel: {
									margin: 10,
									textStyle: {
										fontSize: 12,
										color: '#323232'
									}
								},
								splitLine: {
									show: true,
									lineStyle: {
										color: ['#efefef'],
										type: 'solid'
									}
								},
							},
							yAxis: {
								type: 'value',
								name: 'm³/s',
								nameLocation: 'end',
								nameGap: 10,
								nameTextStyle: {
									color: '#BCBCBC',
									fontSize: 12
								},
								splitLine: {
									lineStyle: {
										color: ['#efefef'],
										type: 'solid'
									}
								},
								axisTick: {
									show: false,
									inside: true,
									lineStyle: {
										color: '#7B88B5'
									}
								},
								axisLine: {
									lineStyle: {
										color: '#0095ff'
									}
								},
								axisLabel: {
									margin: 10,
									textStyle: {
										fontSize: 12,
										color: '#323232'
									}
								},
								splitArea: {
									show: true,
									// color: ['#ffffff','#e3e3e3']
								}
							},
							dataZoom: [ //给x轴设置滚动条
								{
									start: 0, //默认为0
									end: 100,
									type: 'slider',
									show: false,
								},
								//下面这个属性是里面拖到
								{
									type: 'inside',
									show: true,
									xAxisIndex: [0],
									start: 0, //默认为1
									end: 50
								}
							],
							series: [{
								name: '流量',
								type: 'line',
								smooth: true,
								showSymbol: true,
								// symbol: 'circle',
								symbolSize: 6,
								data: dataBeast,
								areaStyle: {
									normal: {
										color: 'rgba(27, 178, 216,1)'
									}
								},
								itemStyle: {
									normal: {
										color: '#1bb2d8'
									}
								},
								lineStyle: {
									normal: {
										width: 2
									}
								}
							}]
						}

						echartsApp[2] = echarts.init(elemDataView[2], layui.echartsTheme);

						window.onresize = echartsApp[2].resize;
						echartsApp[2].setOption(options[2]);
					} else {

						var _data = `<div style="display: table;width: 100%;height: 100%;">
													<div style="display: table-cell;vertical-align: middle;text-align: center;">
														<img src="../src/style/res/noData.png">
													</div>
												</div>`;
						$(elemDataView[2]).html(_data);
					}


					var bigest = $('#bigest_2');
					bigest.html('');
					data.data.histrcalAvg.forEach( function(element, index) {
						var bigestAvg_html = `<div class="card-module set-col-6">
																		<div>
																			<div class="module-name">最高均值</div>
																			<div class="module-num unfinish" title="${element.day}">${element.dataValue.toFixed(2)}<span class="unit">m³/s</span></div>
																		</div>
																	</div>`;
						
						bigest.append(bigestAvg_html);

						if (data.data.histrcalBigest != null) {
							var bigest_html = `<div class="card-module set-col-6">
																	<div>
																		<div class="module-name">最高峰值</div>
																		<div class="module-num unfinish" title="${data.data.histrcalBigest.recordTime}">${data.data.histrcalBigest.dataValue.toFixed(2)}<span class="unit">m³/s</span></div>
																	</div>
																</div>`;
							
							bigest.append(bigest_html);
						} else {
							var bigest_html = '<div class="card-module set-col-6">' + 
																	'<div>' + 
																		'<div class="module-name">最高峰值</div>' + 
																		'<div class="module-num unfinish"><span class="unit">无</span></div>' + 
																	'</div>' +
																'</div>';
							
							bigest.append(bigest_html);
						}
						
						
					});
					
					var avg = $('#avg_2');
					avg.html('');
					if (data.data.todayAvg != '今日无数据') {
						data.data.todayAvg.forEach( function(element, index) {
							var avg_html = '<div class="card-module set-col-6">' + 
															'<div>' + 
																'<div class="module-name">流量均值</div>' + 
																'<div class="module-num all-num">' + element.dataValue.toFixed(2) + '<span class="unit">m³/s</span></div>' + 
															'</div>' +
														'</div>';
							avg.append(avg_html);
							if (data.data.todayBigest == '今日无数据') {
								var avg_html_null = `<div class="card-module set-col-6">
																			<div>
																				<div class="module-name">流量峰值</div>
																				<div class="module-num all-num"><span class="unit">无</span></div>
																			</div>
																		</div>`;
								avg.append(avg_html_null);
							} else {
								var avg_html_null = `<div class="card-module set-col-6">
																			<div>
																				<div class="module-name">流量峰值</div>
																				<div class="module-num all-num" title="${data.data.todayBigest.recordTime}">${data.data.todayBigest.dataValue.toFixed(2)}<span class="unit">m³/s</span></div>
																			</div>
																		</div>`;
								avg.append(avg_html_null);
							}
						});
					} else {
						var avg_html = `<div class="card-module set-col-6">
															<div>
																<div class="module-name">流量均值</div>
																<div class="module-num all-num"><span class="unit">无</span></div>
															</div>
														</div>`;
						avg.append(avg_html);
						if (data.data.todayBigest == '今日无数据') {
							var avg_html_null = `<div class="card-module set-col-6">
																		<div>
																			<div class="module-name">流量峰值</div>
																			<div class="module-num all-num"><span class="unit">无</span></div>
																		</div>
																	</div>`;
							avg.append(avg_html_null);
						} else {
							var avg_html_null = `<div class="card-module set-col-6">
																		<div>
																			<div class="module-name">流量峰值</div>
																			<div class="module-num all-num" title="${data.data.todayBigest.recordTime}">${data.data.todayBigest.dataValue.toFixed(2)}<span class="unit">m³/s</span></div>
																		</div>
																	</div>`;
							avg.append(avg_html_null);
						}
					}

				});
			}
		};



		//没找到DOM，终止执行
		if(!elemDataView[0]) return;

		$(elemDataView[0]).css('height', '428px');
		renderDataView(0);

		//监听数据概览轮播
		var carouselIndex = 0;
		carousel.on('change(LAY-index-dataview)', function(obj) {
			// console.log(obj.index);
			renderDataView(carouselIndex = obj.index);

			var index = obj.index;
			$('#carousel_next').find('.layadmin-new-data').hide().eq(index).show();
			$('#nav_tab > div').hide().eq(index).show();
			if (index == 0) {
				$('#new_tab_title_1 li').eq(0).trigger('click');
			} else if(index == 1) {
				$('#new_tab_title li').eq(0).trigger('click');
			}

		});

		//监听侧边伸缩
		layui.admin.on('side', function() {
			setTimeout(function() {
				//窗口变化时会影响tab切换下的图表加载，所以此处暂时先注释
				// renderDataView(carouselIndex);
			}, 300);
		});

		//监听路由
		layui.admin.on('hash(tab)', function() {
			layui.router().path.join('') || renderDataView(carouselIndex);
		});

	});

	exports('data_gather', {})
});