layui.define(function(exports) {
	layui.use(['echarts', 'form', 'global'], function() {
		var $ = layui.$,
			echarts = layui.echarts,
			form = layui.form,
			global = layui.global;
		//查询最新水位数据
		$.get(global.ip.backUrl + 'checkPointData/getLastData?type=1', function(data) {

			var data_show = $('.data_show');
			for(var i = 0; i < 3; i++) {
				var unit = data.data[i].unit;
				if(unit == 'm3/s') {
					unit = 'm³/s';
				} else if(unit == null) {
					unit = '';
				}
				var data_show_html = `<div class="data-show-box">
																<div class="box-float float-md">
																	<div class="show-name" title="${data.data[i].location}">${data.data[i].location}</div>
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
		})

		$('.refresh').click(function(event) {
			var data_show = $('.data_show');
			data_show.html('');
			$.get(global.ip.backUrl + 'checkPointData/getLastData?type=1', function(data) {
				for(var i = 0; i < 3; i++) {
					var unit = data.data[i].unit;
					if(unit == 'm3/s') {
						unit = 'm³/s';
					} else if(unit == null) {
						unit = '';
					}
					var data_show_html = `<div class="data-show-box">
																	<div class="box-float float-md">
																		<div class="show-name" title="${data.data[i].location}">${data.data[i].location}</div>
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
			})
		});

		function checkTime(time) { //校验时间,小于10前面加0
			if(time < 10) return "0" + time;
			return time;
		}

		//当从其他页面跳转到此页面时，清除已存在定时器timer
		if(window.timer) {
			window.clearInterval(window.timer)
		}

		window.timer = setInterval(function() {
			var date = new Date();
			//显示时分秒
			$("#time").html(checkTime(date.getHours()) + ":" + checkTime(date.getMinutes()) + ":" + checkTime(date.getSeconds()));
		}, 1000)

		var dataBeast = [],
			xAxisData = [];
		//查询历史水位数据
		option = {
			tooltip: {
				show: true,
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'line', // 默认为直线，可选为：'line' | 'shadow'
					lineStyle: {
						color: '#e0e0e0'
					}
				},
				extraCssText: 'width:160px;height:90px;'
			},
			grid: {
				left: 50,
				right: '18%',
				top: 60,
				bottom: 90,
				// containLabel: true
			},
			dataZoom: [{
					start: 0,
					end: 100,
				},
				{
					type: 'inside'
				}
			],
			xAxis: {
				type: 'category',
				// name: 'shi',
				axisTick: {
					alignWithLabel: true,
					interval: 0
				},
				// nameLocation:'bottom',
				splitLine: {
					show: false
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
				data: []
			},

			yAxis: {
				type: 'value',
				name: 'cm',
				nameLocation: 'end',
				nameGap: 10,
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
					show: false,
					lineStyle: {
						color: ['#D8DBE7'],
						type: 'solid'
					}
				},
			},
			visualMap: {
				top: 60,
				right: 10,
				pieces: [{
					gt: 0,
					lte: 40,
					color: '#096'
				}, {
					gt: 40,
					lte: 80,
					color: '#ffde33'
				}, {
					gt: 80,
					lte: 120,
					color: '#ff9933'
				}, {
					gt: 120,
					lte: 160,
					color: '#cc0033'
				}, {
					gt: 160,
					lte: 200,
					color: '#660099'
				}],
				outOfRange: {
					color: '#999'
				}
			},
			series: [{
				name: '易涝监测点1',
				type: 'line',
				smooth: true,
				lineStyle: {
					normal: {
						type: 'solid'
					}
				},
				markLine: {
					silent: true,
					data: [{
						yAxis: 40
					}, {
						yAxis: 80
					}, {
						yAxis: 120
					}, {
						yAxis: 160
					}, {
						yAxis: 200
					}],
					lineStyle: {
						color: '#c23531'
					}
				},
				data: []
			}]
		};

		//易涝监测点历史水位数据TAB切换的3个图表（易涝点1、易涝点2、易涝点3）Y轴数据
		var dataBeast0 = [],
			dataBeast1 = [],
			dataBeast2 = [];

		//易涝监测点历史水位数据TAB切换的3个图表（易涝点1、易涝点2、易涝点3）X轴数据
		var xAxisData0 = [],
			xAxisData1 = [],
			xAxisData2 = [];

		var echartsApp = [],
			elemDataView = $('#historical_flood').children('div'),
			options = [{
					tooltip: {
						show: true,
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'line', // 默认为直线，可选为：'line' | 'shadow'
							lineStyle: {
								color: '#e0e0e0'
							}
						},
						extraCssText: 'width:160px;height:90px;'
					},
					grid: {
						left: 50,
						right: '12%',
						top: 60,
						bottom: 90,
						// containLabel: true
					},
					dataZoom: [{
							start: 0,
							end: 100,
						},
						{
							type: 'inside'
						}
					],
					xAxis: {
						type: 'category',
						// name: 'shi',
						axisTick: {
							alignWithLabel: true,
							interval: 0
						},
						// nameLocation:'bottom',
						splitLine: {
							show: false
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
						data: []
					},

					yAxis: {
						type: 'value',
						name: 'cm',
						nameLocation: 'end',
						nameGap: 10,
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
							show: false,
							lineStyle: {
								color: ['#D8DBE7'],
								type: 'solid'
							}
						},
					},
					visualMap: {
						top: 60,
						right: 10,
						pieces: [{
							gt: 0,
							lte: 40,
							color: '#096'
						}, {
							gt: 40,
							lte: 80,
							color: '#ffde33'
						}, {
							gt: 80,
							lte: 120,
							color: '#ff9933'
						}, {
							gt: 120,
							lte: 160,
							color: '#cc0033'
						}, {
							gt: 160,
							lte: 200,
							color: '#660099'
						}],
						outOfRange: {
							color: '#999'
						}
					},
					series: [{
						name: '易涝监测点1',
						type: 'line',
						smooth: true,
						lineStyle: {
							normal: {
								type: 'solid'
							}
						},
						markLine: {
							silent: true,
							data: [{
								yAxis: 40
							}, {
								yAxis: 80
							}, {
								yAxis: 120
							}, {
								yAxis: 160
							}, {
								yAxis: 200
							}],
							lineStyle: {
								color: '#c23531'
							}
						},
						data: []
					}]
				},
				{
					tooltip: {
						show: true,
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'line', // 默认为直线，可选为：'line' | 'shadow'
							lineStyle: {
								color: '#e0e0e0'
							}
						},
						extraCssText: 'width:160px;height:90px;'
					},
					grid: {
						left: 50,
						right: '12%',
						top: 60,
						bottom: 90,
						// containLabel: true
					},
					dataZoom: [{
							start: 0,
							end: 100,
						},
						{
							type: 'inside'
						}
					],
					xAxis: {
						type: 'category',
						// name: 'shi',
						axisTick: {
							alignWithLabel: true,
							interval: 0
						},
						// nameLocation:'bottom',
						splitLine: {
							show: false
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
						data: []
					},

					yAxis: {
						type: 'value',
						name: 'cm',
						nameLocation: 'end',
						nameGap: 10,
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
							show: false,
							lineStyle: {
								color: ['#D8DBE7'],
								type: 'solid'
							}
						},
					},
					visualMap: {
						top: 60,
						right: 10,
						pieces: [{
							gt: 0,
							lte: 40,
							color: '#096'
						}, {
							gt: 40,
							lte: 80,
							color: '#ffde33'
						}, {
							gt: 80,
							lte: 120,
							color: '#ff9933'
						}, {
							gt: 120,
							lte: 160,
							color: '#cc0033'
						}, {
							gt: 160,
							lte: 200,
							color: '#660099'
						}],
						outOfRange: {
							color: '#999'
						}
					},
					series: [{
						name: '易涝监测点2',
						type: 'line',
						smooth: true,
						lineStyle: {
							normal: {
								type: 'solid'
							}
						},
						markLine: {
							silent: true,
							data: [{
								yAxis: 40
							}, {
								yAxis: 80
							}, {
								yAxis: 120
							}, {
								yAxis: 160
							}, {
								yAxis: 200
							}],
							lineStyle: {
								color: '#c23531'
							}
						},
						data: []
					}]
				},
				{
					tooltip: {
						show: true,
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'line', // 默认为直线，可选为：'line' | 'shadow'
							lineStyle: {
								color: '#e0e0e0'
							}
						},
						extraCssText: 'width:160px;height:90px;'
					},
					grid: {
						left: 50,
						right: '12%',
						top: 60,
						bottom: 90,
						// containLabel: true
					},
					dataZoom: [{
							start: 0,
							end: 100,
						},
						{
							type: 'inside'
						}
					],
					xAxis: {
						type: 'category',
						// name: 'shi',
						axisTick: {
							alignWithLabel: true,
							interval: 0
						},
						// nameLocation:'bottom',
						splitLine: {
							show: false
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
						data: []
					},

					yAxis: {
						type: 'value',
						name: 'cm',
						nameLocation: 'end',
						nameGap: 10,
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
							show: false,
							lineStyle: {
								color: ['#D8DBE7'],
								type: 'solid'
							}
						},
					},
					visualMap: {
						top: 60,
						right: 10,
						pieces: [{
							gt: 0,
							lte: 40,
							color: '#096'
						}, {
							gt: 40,
							lte: 80,
							color: '#ffde33'
						}, {
							gt: 80,
							lte: 120,
							color: '#ff9933'
						}, {
							gt: 120,
							lte: 160,
							color: '#cc0033'
						}, {
							gt: 160,
							lte: 200,
							color: '#660099'
						}],
						outOfRange: {
							color: '#999'
						}
					},
					series: [{
						name: '易涝监测点3',
						type: 'line',
						smooth: true,
						lineStyle: {
							normal: {
								type: 'solid'
							}
						},
						markLine: {
							silent: true,
							data: [{
								yAxis: 40
							}, {
								yAxis: 80
							}, {
								yAxis: 120
							}, {
								yAxis: 160
							}, {
								yAxis: 200
							}],
							lineStyle: {
								color: '#c23531'
							}
						},
						data: []
					}]
				}
			];

		$.get(global.ip.backUrl + 'checkPoint/get?type=1&origin=1&used=2', function(data) {
			var checkpointId0, checkpointId1, checkpointId2;
			data.data.forEach(function(element, index) {
				// $('.new-tab-title li').eq(index).html(element.location)
				if(element.location == '八一立交') {
					checkpointId0 = element.id;
					// console.log(checkpointId0)
				}
				if(element.location == '环城东路/丰亭路') {
					checkpointId1 = element.id;
					// console.log(checkpointId1)
				}
				if(element.location == '洪源立交') {
					checkpointId2 = element.id;
					// console.log(checkpointId2)
				}
			});
			$.get(encodeURI(global.ip.backUrl + 'checkPointData/queryListForToday?dataType=水位&checkpointId=' + checkpointId0), function(data) {

				if(data.data == '') {
					var flood_history = $('#historical_flood').children('div');
					$(flood_history[0]).css('height', '351px');

					var _data = `<div style="display: table;width: 100%;height: 100%;">
												<div style="display: table-cell;vertical-align: middle;text-align: center;">
													<img src="../src/style/res/noData.png">
												</div>
											</div>`;
					$(flood_history[0]).html(_data);
				} else {
					//生成数组之前先清空数组，避免在每次点击时数组内还有值
					dataBeast.splice(0, dataBeast.length);
					xAxisData.splice(0, xAxisData.length);

					var flood_history = $('#historical_flood').children('div');
					$(flood_history[0]).css('height', '351px');
					var echarts_flood = echarts.init(flood_history[0], layui.echartsTheme);
					echarts_flood.setOption(option);
					window.onresize = echarts_flood.resize;

					data.data.forEach(function(element, index) {
						dataBeast.push((element.dataValue * 100).toFixed(2));
						var recordTime = element.recordTime;
						xAxisData.push(recordTime)
					});

					// console.log(dataBeast)

					echarts_flood.setOption({
						xAxis: {
							data: xAxisData
						},
						series: [{
							data: dataBeast,
						}]
					});
				}
			})

			$('.new-tab-title li').click(function() {
				var _this = $(this),
					_index = _this.index();

				//根据TAB切换的index值确定绘制哪一个图表
				//获取绘制图表的对象

				elemDataView.hide().eq(_index).show();

				if(_index == 0) {
					$.get(encodeURI(global.ip.backUrl + 'checkPointData/queryListForToday?dataType=水位&checkpointId=' + checkpointId0), function(data) {
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
							echartsApp[_index] = echarts.init(elemDataView[_index], layui.echartsTheme);

							echartsApp[_index].setOption(options[_index]);

							window.onresize = echartsApp[_index].resize;

							data.data.forEach(function(element, index) {
								dataBeast0.push((element.dataValue * 100).toFixed(2));
								var recordTime = element.recordTime;
								xAxisData0.push(recordTime)
							});

							echartsApp[_index].setOption({
								xAxis: {
									data: xAxisData0
								},
								series: [{
									data: dataBeast0,
								}]
							});
						}
					})
				} else if(_index == 1) {
					$.get(encodeURI(global.ip.backUrl + 'checkPointData/queryListForToday?dataType=水位&checkpointId=' + checkpointId1), function(data) {
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
							echartsApp[_index] = echarts.init(elemDataView[_index], layui.echartsTheme);

							echartsApp[_index].setOption(options[_index]);

							window.onresize = echartsApp[_index].resize;

							data.data.forEach(function(element, index) {
								dataBeast1.push((element.dataValue * 100).toFixed(2));
								var recordTime = element.recordTime;
								xAxisData1.push(recordTime)
							});

							echartsApp[_index].setOption({
								xAxis: {
									data: xAxisData1
								},
								series: [{
									data: dataBeast1,
								}]
							});
						}
					})
				} else if(_index == 2) {
					$.get(encodeURI(global.ip.backUrl + 'checkPointData/queryListForToday?dataType=水位&checkpointId=' + checkpointId2), function(data) {
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
							echartsApp[_index] = echarts.init(elemDataView[_index], layui.echartsTheme);

							echartsApp[_index].setOption(options[_index]);

							window.onresize = echartsApp[_index].resize;

							data.data.forEach(function(element, index) {
								dataBeast2.push((element.dataValue * 100).toFixed(2));
								var recordTime = element.recordTime;
								xAxisData2.push(recordTime)
							});

							echartsApp[_index].setOption({
								xAxis: {
									data: xAxisData2
								},
								series: [{
									data: dataBeast2,
								}]
							});
						}
					})
				}
			});
		})
	})

	//Demo
	layui.use('form', function() {
		var form = layui.form;
		form.render(null, 'search-form');

		//监听提交
		form.on('submit(formDemo)', function(data) {
			// layer.msg(JSON.stringify(data.field));
			return false;
		});
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

	layui.use(['table', 'form', 'jquery-migrate', 'jqprint', 'global'], function() {
		var $ = layui.$,
			table = layui.table,
			form = layui.form,
			jqprint = layui.jqprint,
			global = layui.global;
		//获取监测点信息
		$.get(global.ip.backUrl + 'checkPoint/get?type=1&used=2', function(value) {
			$.each(value.data, function(index, value) {
				var optHtml = `<option value="${value.id}">${value.name}</option>`;
				$('#monitorPoint').append(optHtml);
				form.render();
			});
		})

		table.render({
			elem: '#data_table',
			url: global.ip.backUrl + 'checkPointData/getList?type=1',
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
		var datas = '',beginTime = '',endTime = '',siteNames = '',sname = '';
		//查询功能
		var active = {
			searchBtn: function() {
				//获取输入框的值
				datas = $('#date');
				beginTime = datas.val().substring(0, 10);
				endTime = datas.val().substring(13);
				siteNames = $('#monitorPoint option:selected');
				sname = siteNames.text();
				if(beginTime || endTime || siteNames.val()) {
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
								'checkPointId': siteNames.val()
							}
						});
						layer.close(index);
					}, 800);
				} else {
					//执行重载
					table.reload('data_table', {
						page: {
							curr: 1 //重新从第 1 页开始
						},
						where: {
							'beginTime': "",
							'endTime': "",
							'checkPointId': ""
						}
					});

				}
			}
		};
		//查询按钮被点击事件
		$('#searchBtn').on('click', function() {
			console.log('被点击');
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
				content: layui.setter.base + 'views/pop/addMonitorData.html?id=flood',
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
			setTimeout(function() {
				table.render({
					elem: '#data_table',
					url: global.ip.backUrl + 'checkPointData/getList?type=1',
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
		});
		//	  打印
		function print() {
			var titleP = `<h2 style='text-align: center;'>易涝点监测列表</h2>`;
			$("#tableP").prepend(titleP);
			$("#tableP").jqprint();
			$("#tableP h2").remove();
		}
		$('#print').click(function() {
			print();
		})
		//最开始导出
		function exports1(type, beginTime, endTime, sname) {
			sname = '全部监测点' ? sname : '';
			let data = (type || beginTime || endTime || sname) ? '?beginTime=' + beginTime + '&endTime=' + endTime + '&name=' + sname + '&type=' + type : '';
			hrefs = encodeURI(global.ip.backUrl + 'checkPointData/exportCheckPointData' + data);
			window.location.href = hrefs;
		}
		$('#export').click(function() {
			exports1('1', beginTime, endTime, sname);
		})
	});

	exports('floodMonitor', {})
})