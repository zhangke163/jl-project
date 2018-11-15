layui.define(function(exports) {
	layui.use(['echarts', 'global'], function() {
		var $ = layui.$,
			echarts = layui.echarts,
			global = layui.global;

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
		//查询最新流量数据
		$.get(global.ip.backUrl + 'checkPointData/getLastData?type=3', function(data) {

			var data_show = $('.data_show');
			data.data.forEach(function(element, index) {
				// var data_show_html = `<div class="data-show-box">
				// 												<div class="box-float float-md">
				// 													<div class="show-name">${element.location}</div>
				// 													<div class="show-time">${element.recordTime.substring(11)}</div>
				// 												</div>
				// 												<div class="box-float float-md offset-left">
				// 													<div>
				// 														<span class="module-num data-value">${element.dataValue}</span>
				// 														<span class="unit">${element.unit}</span>
				// 													</div>
				// 												</div>
				// 												<div class="layui-clear"></div>
				// 											</div>`;
				// data_show.append(data_show_html);
				var unit = element.unit;
				if(unit == 'm3/s') {
					unit = 'm³/s';
				} else if(unit == null) {
					unit = '';
				}

				var data_show_box = data_show.children('.data-show-box').eq(index);
				if(data_show_box) {
					data_show_box.find('.show-name').html(element.location);
					data_show_box.find('.show-time').html(element.recordTime);
					data_show_box.find('.module-num').html(element.dataValue);
					data_show_box.find('.unit').html(unit);
				}
			});
		})

		$('.refresh').click(function(event) {
			var data_show = $('.data_show');
			// data_show.html('');
			$.get(global.ip.backUrl + 'checkPointData/getLastData?type=3', function(data) {
				data.data.forEach(function(element, index) {
					var unit = element.unit;
					if(unit == 'm3/s') {
						unit = 'm³/s';
					} else if(unit == null) {
						unit = '';
					}
					var data_show_box = data_show.children('.data-show-box').eq(index);
					if(data_show_box) {
						data_show_box.find('.show-name').html(element.location);
						data_show_box.find('.show-time').html(element.recordTime);
						data_show_box.find('.module-num').html(element.dataValue);
						data_show_box.find('.unit').html(unit);
					}
				});
			})
		});

		//查询历史流量数据
		$.get(global.ip.backUrl + 'checkPoint/get?type=3&origin=1', function(data) {
			var checkpointId;
			checkpointId = data.data[0].id;
			// console.log(checkpointId)

			$.get(encodeURI(global.ip.backUrl + 'checkPointData/queryListForToday?dataType=流量&checkpointId=' + checkpointId), function(data) {
				if(data.data == '') {
					var flow_history = $('#historical_flow');
					$(flow_history[0]).css('height', '453px');

					var _data = `<div style="display: table;width: 100%;height: 100%;">
												<div style="display: table-cell;vertical-align: middle;text-align: center;">
													<img src="../src/style/res/noData.png">
												</div>
											</div>`;
					$(flow_history[0]).html(_data);
				} else {
					var timeData = [],
						valArry = [];

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
							extraCssText: 'width:160px;height:60px;',
							position: function(p) { //其中p为当前鼠标的位置
								return [p[0] + 10, p[1] - 10];
							},
						},
						legend: {
							data: ['流量'],
							x: 'left'
						},
						dataZoom: [{
							show: true,
							realtime: true,
							start: 0
						}, ],
						grid: [{
							left: 50,
							right: 20,
							bottom: 80
						}],
						xAxis: [{
							type: 'category',
							boundaryGap: false,
							axisLabel: {
								textStyle: {
									color: '#323232',
								},
							},
							axisLine: {
								lineStyle: {
									color: '#0095ff'
								},
								onZero: true
							},
							data: []
						}, ],
						yAxis: [{
							name: '流量(m³/s)',
							type: 'value',
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
							splitLine: {
								show: false
							}
						}, ],
						series: [{
							name: '流量',
							type: 'line',
							symbolSize: 8,
							hoverAnimation: false,
							data: []
						}]
					};

					var flow_history = $('#historical_flow');
					$(flow_history[0]).css('height', '453px');
					var echarts_flow = echarts.init(flow_history[0], layui.echartsTheme);

					echarts_flow.setOption(option);

					window.onresize = echarts_flow.resize;

					// console.log(data.data)
					data.data.forEach(function(element, index) {
						var _time = element.recordTime.substring(5, 16);
						timeData.push(_time);
						// var _val = (element.dataValue * 100).toFixed(2);
						var _val = element.dataValue.toFixed(2);
						valArry.push(_val);
					});

					echarts_flow.setOption({
						xAxis: [{
							data: timeData
						}],
						series: [{
							data: valArry,
						}]
					});
				}
			})
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
		$.get(global.ip.backUrl + 'checkPoint/get?type=3&used=2', function(value) {
			$.each(value.data, function(index, value) {
				var optHtml = `<option value="${value.id}">${value.name}</option>`;
				$('#monitorPoint').append(optHtml);
				form.render();
			});
		})
		table.render({
			elem: '#data_table',
			url: global.ip.backUrl + 'checkPointData/getList?type=3',
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
				// debugger
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
				content: layui.setter.base + 'views/pop/addMonitorData.html',
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
					url: global.ip.backUrl + 'checkPointData/getList?type=3',
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
			var titleP = `<h2 style='text-align: center;'>流量监测列表</h2>`;
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
			exports1('3', beginTime, endTime, sname);
		})
	});

	exports('flowMonitor', {})
})