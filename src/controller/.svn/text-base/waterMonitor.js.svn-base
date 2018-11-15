layui.define(function(exports) {
	layui.use(['echarts', 'global'], function() {
		var $ = layui.$,
			echarts = layui.echarts,
			global = layui.global;

		function checkTime(time) { //校验时间,小于10前面加0
			if(time < 10) return "0" + time;
			return time;
		}

		var timer = setInterval(function() {
			var date = new Date();
			//显示时分秒
			$("#time").html(checkTime(date.getHours()) + ":" + checkTime(date.getMinutes()) + ":" + checkTime(date.getSeconds()));
		}, 1000)

		//最新水质数据
		$.get(global.ip.backUrl + 'checkPointData/getLastData?type=2', function(data) {
			// console.log(data.data)
			// data.data.forEach( function(element, index) {

			// });
			var data_show = $('.data_show');
			for(var i = 0; i < 4; i++) {
				var unit = data.data[i].unit;
				if(unit == 'm3/s') {
					unit = 'm³/s';
				} else if(unit == null) {
					unit = '';
				}

				var data_show_html = `<div class="data-show-box">
																<div class="box-float float-md">
																	<div class="show-name">${data.data[i].dataType}</div>
																	<div class="show-time">${data.data[i].recordTime}</div>
																</div>
																<div class="box-float float-md offset-left">
																	<div>
																		<span class="module-num data-value">${data.data[i].dataValue}</span>
																		<span class="unit">${unit}</span>
																	</div>
																</div>
																<div class="layui-clear"></div>
															</div>`;
				data_show.append(data_show_html);
			}
		});

		//最新水质数据
		$('.refresh').click(function(event) {
			var data_show = $('.data_show');
			data_show.html('');
			$.get(global.ip.backUrl + 'checkPointData/getLastData?type=2', function(data) {
				for(var i = 0; i < 4; i++) {
					var unit = data.data[i].unit;
					if(unit == 'm3/s') {
						unit = 'm³/s';
					} else if(unit == null) {
						unit = '';
					}

					var data_show_html = `<div class="data-show-box">
																	<div class="box-float float-md">
																		<div class="show-name">${data.data[i].dataType}</div>
																		<div class="show-time">${data.data[i].recordTime}</div>
																	</div>
																	<div class="box-float float-md offset-left">
																		<div>
																			<span class="module-num data-value">${data.data[i].dataValue}</span>
																			<span class="unit">${unit}</span>
																		</div>
																	</div>
																	<div class="layui-clear"></div>
																</div>`;
					data_show.append(data_show_html);
				}
			});
		});

		$.get(global.ip.backUrl + 'checkPoint/get?type=2&origin=1', function(data) {
			var checkpointId;
			checkpointId = data.data[0].id;
			// console.log(checkpointId)

			$.get(global.ip.backUrl + 'checkPointData/queryListForToday?dataType=COD&checkpointId=' + checkpointId, function(data) {
				//页面初次加载时COD的Y轴数据
				var dataBeast = [];
				//页面初次加载时COD的X轴数据
				var xAxisData = [];

				if(data.data == '') {
					var data_history = $('#historical_data').children('div');
					$(data_history[0]).css('height', '453px');

					var _data = `<div style="display: table;width: 100%;height: 100%;">
												<div style="display: table-cell;vertical-align: middle;text-align: center;">
													<img src="../src/style/res/noData.png">
												</div>
											</div>`;
					$(data_history[0]).html(_data);
				} else {
					data.data.forEach(function(element, index) {
						dataBeast.push(element.dataValue);
						// console.log(element.dataValue)
						var recordTime = element.recordTime.substring(11);
						// console.log(recordTime)
						xAxisData.push(recordTime)
					});

					//柱状的宽度
					var endPercent = (9 / xAxisData.length) * 100;
					console.log(xAxisData)
					console.log(endPercent)

					var data_history = $('#historical_data').children('div');
					$(data_history[0]).css('height', '453px');
					var echarts_history = echarts.init(data_history[0], layui.echartsTheme);

					var option = {
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
							bottom: '15%',
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
								show: false,
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
								show: true,
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
					};
					echarts_history.setOption(option);

					window.onresize = echarts_history.resize;
				}

			});
		});

		//水质监测点历史水质数据TAB切换的四个图表（COD、ph、氨氮、总磷）Y轴数据
		var dataBeast0 = [],
			dataBeast1 = [],
			dataBeast2 = [],
			dataBeast3 = [];

		//水质监测点历史水质数据TAB切换的四个图表（COD、ph、氨氮、总磷）X轴数据
		var xAxisData0 = [],
			xAxisData1 = [],
			xAxisData2 = [],
			xAxisData3 = [];

		var echartsApp = [],
			elemDataView = $('#historical_data').children('div'),
			options = [
				//水质监测点历史水质数据（COD）
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
						bottom: '15%',
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
						data: [],
						splitLine: {
							show: false,
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
							end: [],
							type: 'slider',
							show: true,
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
						data: []
					}]
				},

				//水质监测点历史水质数据（PH）
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
						bottom: '15%',
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
						data: [],
						splitLine: {
							show: false,
							lineStyle: {
								color: ['#D8DBE7'],
								type: 'solid'
							}
						},
					},
					yAxis: [{
						type: 'value',
						min: 0,
						max: 14,
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
							end: [],
							type: 'slider',
							show: true,
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
						data: [],
						markLine: {
							silent: true,
							data: [{
								yAxis: 7
							}],
							lineStyle: {
								color: '#c23531'
							}
						}
					}]
				},

				//水质监测点历史水质数据（氨氮）
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
						bottom: '15%',
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
						data: [],
						splitLine: {
							show: false,
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
							end: [],
							type: 'slider',
							show: true,
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
						data: []
					}]
				},

				//水质监测点历史水质数据（总磷）
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
						bottom: '15%',
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
						data: [],
						splitLine: {
							show: false,
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
							end: [],
							type: 'slider',
							show: true,
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
						data: []
					}]
				}
			];

		$('.new-tab-title li').click(function() {
			var _this = $(this),
				_index = _this.index();

			//根据TAB切换的index值确定绘制哪一个图表
			//获取绘制图表的对象

			elemDataView.hide().eq(_index).show();

			$.get(global.ip.backUrl + 'checkPoint/get?type=2&origin=1', function(data) {
				var checkpointId;
				checkpointId = data.data[0].id;

				if(_index == 0) {
					$.get(global.ip.backUrl + 'checkPointData/queryListForToday?dataType=COD&checkpointId=' + checkpointId, function(data) {
						//生成数组之前先清空数组，避免在每次点击时数组内还有值
						dataBeast0.splice(0, dataBeast0.length);
						xAxisData0.splice(0, xAxisData0.length);

						if(data.data == '') {
							var _data = `<div style="display: table;width: 100%;height: 100%;">
														<div style="display: table-cell;vertical-align: middle;text-align: center;">
															<img src="../src/style/res/noData.png">
														</div>
													</div>`;
							$(elemDataView[_index]).html(_data);
						} else {
							data.data.forEach(function(element, index) {
								dataBeast0.push(element.dataValue);
								var recordTime = element.recordTime.substring(11);
								xAxisData0.push(recordTime)
							});
							var endPercent0 = (9 / xAxisData0.length) * 100;

							echartsApp[_index] = echarts.init(elemDataView[_index], layui.echartsTheme);

							echartsApp[_index].setOption(options[_index]);

							window.onresize = echartsApp[_index].resize;

							echartsApp[_index].setOption({
								xAxis: {
									data: xAxisData0
								},
								dataZoom: [{
									end: endPercent0,
								}],
								series: [{
									data: dataBeast0,
								}]
							});
						}
					})
				} else if(_index == 1) {
					$.get(global.ip.backUrl + 'checkPointData/queryListForToday?dataType=PH&checkpointId=' + checkpointId, function(data) {
						//生成数组之前先清空数组，避免在每次点击时数组内还有值
						dataBeast1.splice(0, dataBeast1.length);
						xAxisData1.splice(0, xAxisData1.length);

						if(data.data == '') {
							var _data = `<div style="display: table;width: 100%;height: 100%;">
														<div style="display: table-cell;vertical-align: middle;text-align: center;">
															<img src="../src/style/res/noData.png">
														</div>
													</div>`;
							$(elemDataView[_index]).html(_data);
						} else {
							data.data.forEach(function(element, index) {
								dataBeast1.push(element.dataValue);
								var recordTime = element.recordTime.substring(11);
								xAxisData1.push(recordTime)
							});
							var endPercent1 = (9 / xAxisData1.length) * 100;

							echartsApp[_index] = echarts.init(elemDataView[_index], layui.echartsTheme);

							echartsApp[_index].setOption(options[_index]);

							window.onresize = echartsApp[_index].resize;

							echartsApp[_index].setOption({
								xAxis: {
									data: xAxisData1
								},
								dataZoom: [{
									end: endPercent1,
								}],
								series: [{
									data: dataBeast1,
								}]
							});
						}
					})
				} else if(_index == 2) {
					$.get(encodeURI(global.ip.backUrl + 'checkPointData/queryListForToday?dataType=氨氮&checkpointId=' + checkpointId), function(data) {
						//生成数组之前先清空数组，避免在每次点击时数组内还有值
						dataBeast2.splice(0, dataBeast2.length);
						xAxisData2.splice(0, xAxisData2.length);

						if(data.data == '') {
							var _data = `<div style="display: table;width: 100%;height: 100%;">
														<div style="display: table-cell;vertical-align: middle;text-align: center;">
															<img src="../src/style/res/noData.png">
														</div>
													</div>`;
							$(elemDataView[_index]).html(_data);
						} else {
							data.data.forEach(function(element, index) {
								dataBeast2.push(element.dataValue);
								var recordTime = element.recordTime.substring(11);
								xAxisData2.push(recordTime)
							});
							var endPercent2 = (9 / xAxisData2.length) * 100;

							echartsApp[_index] = echarts.init(elemDataView[_index], layui.echartsTheme);

							echartsApp[_index].setOption(options[_index]);

							window.onresize = echartsApp[_index].resize;

							echartsApp[_index].setOption({
								xAxis: {
									data: xAxisData2
								},
								dataZoom: [{
									end: endPercent2,
								}],
								series: [{
									data: dataBeast2,
								}]
							});
						}
					})
				} else if(_index == 3) {
					$.get(encodeURI(global.ip.backUrl + 'checkPointData/queryListForToday?dataType=总磷&checkpointId=' + checkpointId), function(data) {
						//生成数组之前先清空数组，避免在每次点击时数组内还有值
						dataBeast3.splice(0, dataBeast3.length);
						xAxisData3.splice(0, xAxisData3.length);

						if(data.data == '') {
							var _data = `<div style="display: table;width: 100%;height: 100%;">
														<div style="display: table-cell;vertical-align: middle;text-align: center;">
															<img src="../src/style/res/noData.png">
														</div>
													</div>`;
							$(elemDataView[_index]).html(_data);
						} else {
							data.data.forEach(function(element, index) {
								dataBeast3.push(element.dataValue);
								var recordTime = element.recordTime.substring(11);
								xAxisData3.push(recordTime)
							});
							var endPercent3 = (9 / xAxisData3.length) * 100;

							echartsApp[_index] = echarts.init(elemDataView[_index], layui.echartsTheme);

							echartsApp[_index].setOption(options[_index]);

							window.onresize = echartsApp[_index].resize;

							echartsApp[_index].setOption({
								xAxis: {
									data: xAxisData3
								},
								dataZoom: [{
									end: endPercent3,
								}],
								series: [{
									data: dataBeast3,
								}]
							});
						}
					})
				}
			})
		});
	})

	//Demo
	layui.use(['form', 'global'], function() {
		var form = layui.form,
			$ = layui.$,
			global = layui.global;
		form.render(null, 'search-form');

		//监听提交
		form.on('submit(formDemo)', function(data) {
			// layer.msg(JSON.stringify(data.field));
			return false;
		});

		$.get(global.ip.backUrl + 'checkPoint/get?type=2&used=2', function(data) {
			data.data.forEach(function(element, index) {
				var html = `<option value="${element.id}">${element.name}</option>`;
				$('#location').append(html);
			});
			form.render(null, 'search-form');
		})
	});

	layui.use('laydate', function() {
		var laydate = layui.laydate;

		//执行一个laydate实例
		laydate.render({
			elem: '#date' //指定元素
				,
			range: true
		});
	});

	layui.use(['table', 'jquery-migrate', 'jqprint', 'global'], function() {
		var $ = layui.$,
			table = layui.table,
			jqprint = layui.jqprint,
			global = layui.global;
		table.render({
			elem: '#data_table',
			url: global.ip.backUrl + 'checkPointData/getList?type=2',
			initSort: {
				field: 'checkPointRecordId',
				type: 'asc'
			},
			page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
				layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
					,
				first: false //不显示首页
					,
				last: false //不显示尾页
					,
				theme: '#0095ff'

			},
			cols: [
				[{
					field: 'checkPointRecordId',
					title: '序号',
					width: 100
				}, {
					field: 'recordTime',
					title: '时间'
				}, {
					field: 'name',
					title: '监测点'
				}, {
					field: 'dataType',
					title: '数据类型'
				}, {
					field: 'dataValue',
					title: '数据值'
				}]
			]

		});
		var locations = '',dataType = '',timeVal = '',beginTime = '',endTime = '',datasT = '',locs = '';
		var active = {
			dataSearchBtn: function() {
				//获取输入框的值
				locations = $('#location option:selected');
				dataType = $('#dataType option:selected');

				timeVal = $('#date').val();
				beginTime = timeVal.substring(0, 10);
				endTime = timeVal.substring(13);
				datasT = dataType.val();
				locs = locations.text();
				console.log(888);
				console.log(datasT);
				if(beginTime || endTime || locations.val() || dataType.val()) {
					// debugger
					var index = layer.msg('查询中，请稍候...', {
						icon: 16,
						time: false,
						shade: 0
					});
					setTimeout(function() {
						table.reload('data_table', {
							where: {
								'beginTime': beginTime,
								'endTime': endTime,
								'dataType': dataType.val(),
								'checkPointId': locations.val()
							}
						});
						layer.close(index);
					}, 800);
					//  导出
					//					$('#export').click(function(){
					//					    	exports1('2',beginTime,endTime,locs,datasT);
					//				   })
				} else {
					//执行重载
					table.reload('data_table', {
						where: {
							'beginTime': "",
							'endTime': "",
							'dataType': "",
							'checkPointId': ""
						},
						page: {
							curr: 1 //重新从第 1 页开始
						}
					});
				}
			}
		};

		// var searchBtn = false;
		//搜索按钮被点击事件
		$('.new-form-item .new-layui-btn').on('click', function() {
			console.log('搜索按钮被点击');
			// searchBtn = true;
			// form.render(null, 'search-form');
			var type = $(this).data('type');
			active[type] ? active[type].call(this) : '';
		});

		$('#add').click(function(event) {
			layer.open({
				type: 2,
				area: ['500px', '465px'],
				fix: false,
				resize: false,
				shade: 0.4,
				maxmin: false,
				title: '添加监测数据',
				content: layui.setter.base + 'views/pop/addMonitorData.html?id=water',
				end: function() {
					table.reload('data_table', {
						page: {
							curr: 1 //重新从第 1 页开始
						}
					});
				}
			});
		});

		//收缩和展开左侧菜单栏，延迟200ms执行重新渲染表格的操作
		$('#LAY_app_flexible').click(function(event) {

			// if (searchBtn == false) {
			setTimeout(function() {
				table.render({
					elem: '#data_table',
					url: global.ip.backUrl + 'checkPointData/getList?type=2',
					page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
						layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
							,
						first: false //不显示首页
							,
						last: false //不显示尾页
							,
						theme: '#0095ff'

					},
					cols: [
						[{
							field: 'checkPointRecordId',
							title: '序号',
							width: 100
						}, {
							field: 'recordTime',
							title: '时间'
						}, {
							field: 'name',
							title: '监测点'
						}, {
							field: 'dataType',
							title: '数据类型'
						}, {
							field: 'dataValue',
							title: '数据值'
						}]
					]

				});
			}, 200)
			// }
		});
		//	  打印
		function print() {
			var titleP = `<h2 style='text-align: center;'>水质监测列表</h2>`;
			$("#tableP").prepend(titleP);
			$("#tableP").jqprint();
			$("#tableP h2").remove();
		}
		$('#print').click(function() {
			print();
		})
		//最开始导出
		function exports1(type, beginTime, endTime, sname, dataType) {
			sname = '全部监测点' ? '' : sname;
			dataType = '全部监测指标' ? dataType : '';
			let data = (type || beginTime || endTime || sname || dataType) ? '?beginTime=' + beginTime + '&endTime=' + endTime + '&name=' + sname + '&dataType=' + dataType + '&type=' + type : '';
			hrefs = encodeURI(global.ip.backUrl + 'checkPointData/exportCheckPointData' + data);
			window.location.href = hrefs;
			console.log(hrefs);
		}
		$('#export').click(function() {
			exports1('2', beginTime, endTime, locs, datasT);
		})
	});

	exports('waterMonitor', {})
})