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

		//绘制报警类型统计图表
		var echarts_type = echarts.init(document.getElementById('type_gather'), layui.echartsTheme),
			options_type = {
				//报警类型统计图表
				title: {
					text: '所有报警记录分类统计',
					x: 'center',
					y: 20,
					textStyle: {
						fontSize: 18,
						color: '#323232'
					}
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} (条)",
					extraCssText: 'width:150px;height:80px;',
				},
				legend: {
					orient: 'vertical',
					left: 15,
					top: '10%',
					itemGap: 20,
					data: []
				},
				series: [{
					name: '报警类型',
					type: 'pie',
					radius: ['50%', '70%'],
					center: ['50%', '50%'],
					data: [],
					color: ['#e87f39', '#4a6565', '#44403f', '#a22313', '#cdb061', '#ffca58', '#ffa300'],
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
		echarts_type.setOption(options_type);

		window.onresize = echarts_type.resize;

		$.get(global.ip.backUrl + 'alarm/countByType?origin=1', function(data) {

			var x_data_type = [],
				data_type = [],
				data_data = JSON.stringify(data.data).replace(/ALARM_TYPE/g, "name").replace(/COUNT/g, "value");

			data_type = JSON.parse(data_data);

			data.data.forEach(function(element, index) {

				x_data_type.push(element.ALARM_TYPE);
			})

			echarts_type.setOption({
				legend: {
					data: x_data_type
				},
				series: [{
					name: '报警类型',
					data: data_type,
				}]
			});
		})

		$.get(global.ip.backUrl + 'alarm/newestAlarm?origin=1', function(data) {
			$('#data_show').html('');
			data.data.forEach(function(element, index) {
				var overstep = (element.dataValue - element.alarmValue).toFixed(2);
				var unit = element.unit
				if(unit == 'm3/s') {
					unit = 'm³/s';
				} else if(unit == null) {
					unit = '';
				}
				var data_show = `<div class="data-show-box">
						          			<div class="box-float float-md">
						          				<div class="show-name">${element.alarmType}</div>
						          				<div class="show-order">${element.location}</div>
						          			</div>
						          			<div class="box-float float-md offset-left">
						          				<div>
						          					<span class="module-num dangerous">${element.dataValue}</span>
						          					<span class="unit">${unit}</span>
						          				</div>
						          				<div class="dangerous-info">较警报值超${Math.abs(overstep)}</div>
						          			</div>
						          			<div class="box-float float-sm">
						          				<div class="time-record">${element.alarmTime}</div>
						          			</div>
						          			<div class="layui-clear"></div>
						          		</div>`

				$('#data_show').append(data_show);
			});
		})

		$('#refresh').click(function(event) {
			$('#data_show').html('');

			$.get(global.ip.backUrl + 'alarm/newestAlarm?origin=1', function(data) {
				data.data.forEach(function(element, index) {
					var overstep = (element.dataValue - element.alarmValue).toFixed(2);
					var unit = element.unit
					if(unit == 'm3/s') {
						unit = 'm³/s';
					} else if(unit == null) {
						unit = '';
					}
					var data_show = `<div class="data-show-box">
							          			<div class="box-float float-md">
							          				<div class="show-name">${element.alarmType}</div>
							          				<div class="show-order">${element.location}</div>
							          			</div>
							          			<div class="box-float float-md offset-left">
							          				<div>
							          					<span class="module-num dangerous">${element.dataValue}</span>
							          					<span class="unit">${unit}</span>
							          				</div>
							          				<div class="dangerous-info">较警报值超${Math.abs(overstep)}</div>
							          			</div>
							          			<div class="box-float float-sm">
							          				<div class="time-record">${element.alarmTime}</div>
							          			</div>
							          			<div class="layui-clear"></div>
							          		</div>`

					$('#data_show').append(data_show);
				});
			})
		});
	})

	//Demo
	layui.use(['form', 'global'], function() {
		var $ = layui.$,
			form = layui.form,
			global = layui.global;

		form.render(null, 'search-form');

		$.get(global.ip.backUrl + 'checkPoint/get?origin=1&used=2', function(data) {
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
			elem: '#test1' //指定元素
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
			elem: '#test',
			url: global.ip.backUrl + 'alarm/getList?origin=1',
			initSort: {
				field: 'alarmId',
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
					field: 'alarmId',
					title: '序号',
					width: 100
				}, {
					field: 'alarmTime',
					title: '时间',
					width: 200
				}, {
					field: 'location',
					title: '监测点',
					width: 300
				}, {
					field: 'alarmType',
					title: '报警类型',
					width: 200
				}, {
					field: 'dataValue',
					title: '数据值',
					width: 200
				}, {
					field: 'alarmLevel',
					title: '级别',
					width: 200
				}, {
					field: 'alarmValue',
					title: '报警值',
					width: 200
				}, {
					field: 'remark',
					title: '备注',
					width: '17%'
				}, {
					field: 'status',
					title: '处理状态',
					width: 200
				}, {
					title: '操作',
					align: 'center',
					toolbar: '#table_btn',
					width: 178,
					fixed: 'right'
				}]
			]

		});

		//监听工具条
		table.on('tool(data_table)', function(obj) {
			var data = obj.data;
			if(obj.event === 'check') {
				var rowId = data.alarmId;
				layer.open({
					type: 2,
					area: ['400px', '400px'],
					fix: false,
					resize: false,
					shade: 0.4,
					maxmin: false,
					title: '报警信息',
					content: layui.setter.base + 'views/pop/check.html?id=' + rowId,
					end: function() {
						$.ajax({
							url: global.ip.backUrl + "alarm/getById?alarmId=" + rowId,
							success: function(data) {
								var status = data.data.status;
								// console.log(status)
								var remark = data.data.remark;
								// console.log(remark)
								obj.update({
									status: status,
									remark: remark
								});
							}
						});
					}
				});
			}
		});
		var beginTime = '',
			endTime = '',
			los = '',
			alarms = '';
		var active = {
			alarmSearchBtn: function() {
				//获取输入框的值
				var locations = $('#location option:selected');
				var alarmType = $('#alarmType option:selected');
				var name = $('#name option:selected');

				var timeVal = $('#test1').val();
				beginTime = timeVal.substring(0, 10);
				endTime = timeVal.substring(13);
				los = locations.val();
				alarms = alarmType.val();
				if(beginTime || endTime || locations.val() || alarmType.val() || name.val()) {
					var index = layer.msg('查询中，请稍候...', {
						icon: 16,
						time: false,
						shade: 0
					});
					setTimeout(function() {
						table.reload('test', {
							where: {
								'beginTime': beginTime,
								'endTime': endTime,
								'alarmType': alarmType.val(),
								'responsiblePerson': name.val(),
								'checkPointId': locations.val()
							}
						});
						layer.close(index);
					}, 800);

				} else {
					//执行重载
					table.reload('test', {
						where: {
							'beginTime': "",
							'endTime': "",
							'alarmType': "",
							'responsiblePerson': "",
							'checkPointId': ""
						},
						page: {
							curr: 1 //重新从第 1 页开始
						}
					});
				}
			}
		};

		//搜索按钮被点击事件
		$('.new-form-item .new-layui-btn').on('click', function() {
			console.log('搜索按钮被点击');
			var type = $(this).data('type');
			active[type] ? active[type].call(this) : '';
		});
		$('#add').click(function(event) {
			layer.open({
				type: 2,
				area: ['790px', '465px'],
				fix: false,
				resize: false,
				shade: 0.4,
				maxmin: false,
				title: '添加报警数据',
				content: layui.setter.base + 'views/pop/addAlarmData.html',
				end: function() {
					//执行重载
					table.reload('test', {
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
					elem: '#test',
					url: global.ip.backUrl + 'alarm/getList?origin=1',
					initSort: {
						field: 'alarmId',
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
								field: 'alarmId',
								title: '序号',
								width: 100
							}, {
								field: 'alarmTime',
								title: '时间',
								width: 200
							}, {
								field: 'location',
								title: '监测点',
								width: 300
							}, {
								field: 'alarmType',
								title: '报警类型',
								width: 200
							}, {
								field: 'dataValue',
								title: '数据值',
								width: 200
							}, {
								field: 'alarmLevel',
								title: '级别',
								width: 200
							}, {
								field: 'alarmValue',
								title: '报警值',
								width: 200
							}
							// ,{field:'name', title: '负责人',width: 200}
							// ,{field:'tel', title: '联系电话',width: 230}
							, {
								field: 'remark',
								title: '备注',
								width: '17%'
							}, {
								field: 'status',
								title: '处理状态',
								width: 200
							}, {
								title: '操作',
								align: 'center',
								toolbar: '#table_btn',
								width: 178,
								fixed: 'right'
							}
						]
					]

				});
			}, 350)
		});

		//打印
		function print() {
			var titleP = `<h2 style='text-align: center;'>报警记录列表</h2>`;
			$("#tableP").prepend(titleP);
			$("#tableP").jqprint();
			$("#tableP h2").remove();
		}
		$('#print').click(function() {
			print();
		})

		//最开始导出
		function exports1(beginTime, endTime, sname, tatus) {
			tatus = '全部报警类型' ? tatus : '';
			let data = (beginTime || endTime || sname || tatus) ? '?beginTime=' + beginTime + '&endTime=' + endTime + '&checkPointId=' + sname + '&alarmType=' + tatus : '';
			hrefs = encodeURI(global.ip.backUrl + 'alarm/exportAlarm' + data);
			window.location.href = hrefs;
		}
		$('#export').click(function() {
			exports1(beginTime, endTime, los, alarms);
		})
	});

	exports('alarmRecord', {})
})