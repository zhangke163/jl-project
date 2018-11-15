layui.define(function(exports) {
	layui.use('echarts', function() {
		var $ = layui.$,
				echarts = layui.echarts;

		function checkTime(time) {//校验时间,小于10前面加0
		    if(time < 10)return "0" + time;
		    return time;
		}

		function checkTime(time) {//校验时间,小于10前面加0
		    if(time < 10)return "0" + time;
		    return time;
		}

		//当从其他页面跳转到此页面时，清除已存在定时器timer
		if(window.timer) {
			window.clearInterval(window.timer)
		}

		window.timer = setInterval(function() {
			var date = new Date();
			//显示时分秒
	    $("#time").html(checkTime(date.getHours()) + ":" + checkTime(date.getMinutes()) + ":" +checkTime(date.getSeconds()));
		}, 1000)


		//绘制报警类型统计图表
		var type_gather = $('#type_gather').children('div');

		$(type_gather[0]).css('height','363px');
		var echarts_type_0 = echarts.init(type_gather[0], layui.echartsTheme);
		//报警类型统计图表
		var options_type = [
				{
				    tooltip: {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} (条)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: 15,
				        top: '10%',
				        itemGap: 20,
				        data: ['厂外液位超标', 'PH值超标', 'COD值超标', '氨氮超标', '总磷超标', '总氮超标']
				    },
				    series: [{
				        name: '报警类型',
				        type: 'pie',
				        radius: ['50%', '70%'],
				        center: ['50%', '50%'],
				        data: [
				            { value: 2, name: '厂外液位超标' },
				            { value: 1, name: 'PH值超标' },
				            { value: 2, name: 'COD值超标' },
				            { value: 2, name: '氨氮超标' },
				            { value: 2, name: '总磷超标' },
				            { value: 2, name: '总氮超标' }
				        ],
				        color: ['#c23531', '#d48265', '#fa9d1b', '#fad453', '#969fb0', '#546570'],
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
				},
				{
				    tooltip: {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} (条)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: 15,
				        top: '10%',
				        itemGap: 20,
				        data: ['厂外液位超标', 'PH值超标', 'COD值超标', '氨氮超标', '总磷超标', '总氮超标']
				    },
				    series: [{
				        name: '报警类型',
				        type: 'pie',
				        radius: ['50%', '70%'],
				        center: ['50%', '50%'],
				        data: [
				            { value: 2, name: '厂外液位超标' },
				            { value: 3, name: 'PH值超标' },
				            { value: 1, name: 'COD值超标' },
				            { value: 4, name: '氨氮超标' },
				            { value: 3, name: '总磷超标' },
				            { value: 1, name: '总氮超标' }
				        ],
				        color: ['#c23531', '#d48265', '#fa9d1b', '#fad453', '#969fb0', '#546570'],
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
				},
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
						top: '10%',
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
						data: ['2018-5-8', '2018-5-9', '2018-5-10', '2018-5-11', '2018-5-12', '2018-5-13', '2018-5-14', '2018-5-15', '2018-5-16'],
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
						name: '次',
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
							end: 70,
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
						name: '报警次数',
						barWidth: '40%',
						data: [2, 3, 1, 2, 1, 4, 2, 1, 1]
					}]
				},
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
						top: '10%',
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
						data: ['2018-5-8', '2018-5-9', '2018-5-10', '2018-5-11', '2018-5-12', '2018-5-13', '2018-5-14', '2018-5-15', '2018-5-16'],
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
						name: '次',
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
							end: 70,
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
						name: '报警次数',
						barWidth: '40%',
						data: [1, 4, 1, 1, 2, 3, 1, 3, 2]
					}]
				}];
		echarts_type_0.setOption(options_type[0]);

		window.onresize = echarts_type_0.resize;


		var echartsApp = [];
				// elemDataView = $('#type_gather').children('div');

		
		// echarts_type.setOption(options_type);
		
		// window.onresize = echarts_type.resize;
		
		$('.type-gather-tab ul li').click(function() {
			var _this = $(this),
					index = _this.index();

			//根据TAB切换的index值确定绘制哪一个图表
			//获取绘制图表的对象
			
			if(window.echartsDemo) {
				window.echartsDemo.clear();
			}
			// $(elemDataView[index]).css('height','363px');
			echartsApp[index] = echarts.init(type_gather[0], layui.echartsTheme);

			window.echartsDemo = echartsApp[index];

			echartsApp[index].setOption(options_type[index]);

			window.onresize = echartsApp[index].resize;
		});
	})

	//Demo
	layui.use('form', function(){
	  var form = layui.form;
	  form.render(null, 'search-form');
	  
	  //监听提交
	  form.on('submit(formDemo)', function(data){
	    layer.msg(JSON.stringify(data.field));
	    return false;
	  });
	});

	layui.use('laydate', function(){
	  var laydate = layui.laydate;
	  
	  //执行一个laydate实例
	  laydate.render({
	    elem: '#test1' //指定元素
	    ,range: true
	  });
	});

	layui.use(['table','global'], function(){
	  var $ = layui.$,
	  		table = layui.table,global = layui.global;
	  
	  table.render({
	    elem: '#test'
	    ,url:global.ip.backUrl + 'alarm/getList'
	    ,page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
	      layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
	      ,first: false //不显示首页
	      ,last: false //不显示尾页
	      ,theme: '#0095ff'
	      
	    }
	    ,cols: [[
	      {field:'alarmId', title: '序号',width:100}
		    ,{field:'alarmTime', title: '时间',width:200}
		    ,{field:'checkPointId', title: '监测点',width:200}
		    ,{field:'alarmType', title: '报警类型',width:200}
		    ,{field:'dataValue', title: '数据值',width:200}
		    ,{field:'name', title: '负责人',width:200}
		    ,{field:'tel', title: '联系电话',width:200}
		    ,{field:'remark', title: '备注',width:200}
		    ,{field:'status', title: '状态',width:200}
	    ]]
	    
	  });

	  //收缩和展开左侧菜单栏，延迟200ms执行重新渲染表格的操作
	  $('#LAY_app_flexible').click(function(event) {
	  	setTimeout(function() {
	  		table.render({
	  		  elem: '#test'
	  		  ,url:global.ip.backUrl + 'alarm/getList'
	  		  ,page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
	  		    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
	  		    ,first: false //不显示首页
	  		    ,last: false //不显示尾页
	  		    ,theme: '#0095ff'
	  		    
	  		  }
	  		  ,cols: [[
			      {field:'alarmId', title: '序号',width:100}
				    ,{field:'alarmTime', title: '时间',width:200}
				    ,{field:'checkPointId', title: '监测点',width:200}
				    ,{field:'alarmType', title: '报警类型',width:200}
				    ,{field:'dataValue', title: '数据值',width:200}
				    ,{field:'name', title: '负责人',width:200}
				    ,{field:'tel', title: '联系电话',width:200}
				    ,{field:'remark', title: '备注',width:200}
				    ,{field:'status', title: '状态',width:200}
			    ]]
	  		  
	  		});
	  	}, 200)
	  });
	});

	exports('alarmRecord_2', {})
})