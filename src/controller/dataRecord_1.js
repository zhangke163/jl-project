layui.define(function(exports) {
	layui.use(['echarts','global'], function() {
		var $ = layui.$,
				echarts = layui.echarts,global=layui.global;

		//绘制监测数据统计图表
		var data_record = $('#data_record').children('.layui-show');

		$(data_record[0]).css('height','412px');
		var echarts_data_0 = echarts.init(data_record[0], layui.echartsTheme);
		window.echartsDemo = echarts_data_0;

		//监测数据统计图表
		var options_data = [
				{
					color: ['#c23531', '#2f4554', '#61a0a8', '#6ea861', '#c37733', '#333ac3', '#a86161', '#61a884', '#8961a8', '#a89d61'],
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
					legend: {
							y: 50,
			        data:['婺剧院北','东阳街梅溪桥北','环城南路东市街','金星街G330','李渔桥下', '双龙南街二环路', '桐溪污水干管', '婺剧院南', '永济桥北桥头', '永济桥南桥头']
			    },
					grid: {
						show: false,
						left: '3%',
						right: '4%',
						bottom: '5%',
						top: 100,
						containLabel: true
					},
					xAxis: {
						show: true,
						boundaryGap: false,

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
								color: '#e0e0e0'
							}
						},
						axisTick: {
							alignWithLabel: true,
							show: false
						},
						data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00'],
						splitLine: {
							show: false,
							lineStyle: {
								color: ['#e0e0e0'],
								type: 'solid'
							}
						},
					},
					yAxis: [{
						type: 'value',
						name: 'cm',
						nameLocation: 'end',
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
								color: '#e0e0e0'
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							lineStyle: {
								color: ['#e0e0e0'],
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
					series: [
					    {
				    		type: 'line',
				    		smooth: false,
				    		name: '婺剧院北',
				    		barWidth: '40%',
				    		data: [10, 201, 151, 64, 30, 27, 130, 40, 30]
					    },
					    {
				    		type: 'line',
				    		smooth: false,
				    		name: '东阳街梅溪桥北',
				    		barWidth: '40%',
				    		data: [10, 21, 51, 164, 33, 56, 30, 140, 130]
					    },
					    {
				    		type: 'line',
				    		smooth: false,
				    		name: '环城南路东市街',
				    		barWidth: '40%',
				    		data: [110, 121, 59, 64, 133, 77, 82, 14, 13]
					    },
					    {
				    		type: 'line',
				    		smooth: false,
				    		name: '金星街G330',
				    		barWidth: '40%',
				    		data: [120, 121, 151, 34, 33, 133, 56, 79, 65]
					    },
					    {
				    		type: 'line',
				    		smooth: false,
				    		name: '李渔桥下',
				    		barWidth: '40%',
				    		data: [12, 23, 39, 130, 129, 120, 76, 88, 56]
					    },
					    {
				    		type: 'line',
				    		smooth: false,
				    		name: '双龙南街二环路',
				    		barWidth: '40%',
				    		data: [109, 100, 90, 80, 89, 109, 120, 45, 40]
					    },
					    {
				    		type: 'line',
				    		smooth: false,
				    		name: '桐溪污水干管',
				    		barWidth: '40%',
				    		data: [130, 121, 133, 89, 87, 67, 57, 40, 35]
					    },
					    {
				    		type: 'line',
				    		smooth: false,
				    		name: '婺剧院南',
				    		barWidth: '40%',
				    		data: [88, 34, 64, 87, 102, 110, 88, 56, 50]
					    },
					    {
				    		type: 'line',
				    		smooth: false,
				    		name: '永济桥北桥头',
				    		barWidth: '40%',
				    		data: [107, 29, 55, 78, 109, 201, 189, 156, 100]
					    },
					    {
				    		type: 'line',
				    		smooth: false,
				    		name: '永济桥南桥头',
				    		barWidth: '40%',
				    		data: [83, 30, 54, 108, 128, 155, 109, 99, 84]
					    },
				    ]
				},
				{
					color: ['#0084b7', '#00d099'],
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
					legend: {
							y: 50,
			        data:['进水口','出水口']
			    },
					grid: {
						show: false,
						left: '3%',
						right: '4%',
						bottom: '5%',
						top: 100,
						containLabel: true
					},
					xAxis: {
						show: true,
						boundaryGap: false,

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
								color: '#e0e0e0'
							}
						},
						axisTick: {
							alignWithLabel: true,
							show: false
						},
						data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00'],
						splitLine: {
							show: false,
							lineStyle: {
								color: ['#e0e0e0'],
								type: 'solid'
							}
						},
					},
					yAxis: [{
						type: 'value',
						min:0,
						max:14,
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
								color: '#e0e0e0'
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							lineStyle: {
								color: ['#e0e0e0'],
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
					series: [
					    {
				    		type: 'line',
				    		// smooth: false,
				    		name: '进水口',
				    		data: [5, 8, 5, 8, 5, 4, 3, 7, 7, 5, 8, 5, 8, 5, 3, 4, 7, 6],
				    		markLine: {
				                silent: true,
				                data: [{
				                    yAxis: 7
				                }],
				                lineStyle: {
				                	color: '#c23531'
				                }
				            }
					    },
					    {
				    		type: 'line',
				    		// smooth: false,
				    		name: '出水口',
				    		data: [5, 7, 5, 6, 8, 5, 7, 6, 6, 7, 8, 6, 6, 5, 7, 6, 7, 8],
				    		markLine: {
				                silent: true,
				                data: [{
				                    yAxis: 7
				                }],
				                lineStyle: {
				                	color: '#c23531'
				                }
				            }
					    },
					]
				},
				{
					tooltip: {
						show: true,
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						y: 50,
				        data:['进水口','出水口']
				    },
					grid: {
						show: false,
						left: '3%',
						right: '4%',
						bottom: '5%',
						top: 100,
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
								color: '#e0e0e0'
							}
						},
						axisTick: {
							alignWithLabel: true,
							show: false
						},
						data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00'],
						splitLine: {
							show: false,
							lineStyle: {
								color: ['#e0e0e0'],
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
								color: '#e0e0e0'
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							lineStyle: {
								color: ['#e0e0e0'],
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
					series: [
					    {
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
				    				color: '#255a7e'
				    			}
				    		},
				    		name: '进水口',
				    		barWidth: '20%',
				    		barGap: 0,
				    		data: [660, 841, 521, 820, 578, 127, 100, 730, 700, 660, 841, 521, 820, 578, 127, 100, 730, 700]
					    },
					    {
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
				    				color: '#007acc'
				    			}
				    		},
				    		name: '出水口',
				    		barWidth: '20%',
				    		barGap: 0,
				    		data: [160, 841, 521, 820, 578, 127, 100, 730, 700, 660, 841, 521, 820, 578, 127, 100, 730, 700]
					    },
					]
				},
				{
					tooltip: {
						show: true,
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						y: 50,
				        data:['进水口','出水口']
				    },
					grid: {
						show: false,
						left: '3%',
						right: '4%',
						bottom: '5%',
						top: 100,
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
								color: '#e0e0e0'
							}
						},
						axisTick: {
							alignWithLabel: true,
							show: false
						},
						data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00'],
						splitLine: {
							show: false,
							lineStyle: {
								color: ['#e0e0e0'],
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
								color: '#e0e0e0'
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							lineStyle: {
								color: ['#e0e0e0'],
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
					series: [
					    {
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
				    				color: '#0084b7'
				    			}
				    		},
				    		name: '进水口',
				    		barWidth: '20%',
				    		barGap: 0,
				    		data: [660, 841, 521, 820, 578, 127, 100, 730, 700, 660, 841, 521, 820, 578, 127, 100, 730, 700]
					    },
					    {
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
				    				color: '#5c9eb8'
				    			}
				    		},
				    		name: '出水口',
				    		barWidth: '20%',
				    		barGap: 0,
				    		data: [160, 841, 521, 820, 578, 127, 100, 730, 700, 660, 841, 521, 820, 578, 127, 100, 730, 700]
					    },
					]
				},
				{
					tooltip: {
						show: true,
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						y: 50,
				        data:['进水口','出水口']
				    },
					grid: {
						show: false,
						left: '3%',
						right: '4%',
						bottom: '5%',
						top: 100,
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
								color: '#e0e0e0'
							}
						},
						axisTick: {
							alignWithLabel: true,
							show: false
						},
						data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00'],
						splitLine: {
							show: false,
							lineStyle: {
								color: ['#e0e0e0'],
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
								color: '#e0e0e0'
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							lineStyle: {
								color: ['#e0e0e0'],
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
					series: [
					    {
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
				    				color: '#009487'
				    			}
				    		},
				    		name: '进水口',
				    		barWidth: '20%',
				    		barGap: 0,
				    		data: [660, 841, 521, 820, 578, 127, 100, 730, 700, 660, 841, 521, 820, 578, 127, 100, 730, 700]
					    },
					    {
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
				    				color: '#6bb2ac'
				    			}
				    		},
				    		name: '出水口',
				    		barWidth: '20%',
				    		barGap: 0,
				    		data: [160, 841, 521, 820, 578, 127, 100, 730, 700, 660, 841, 521, 820, 578, 127, 100, 730, 700]
					    },
					]
				},
				{
					tooltip: {
						show: true,
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						y: 50,
				        data:['进水口','出水口']
				    },
					grid: {
						show: false,
						left: '3%',
						right: '4%',
						bottom: '5%',
						top: 100,
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
								color: '#e0e0e0'
							}
						},
						axisTick: {
							alignWithLabel: true,
							show: false
						},
						data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00'],
						splitLine: {
							show: false,
							lineStyle: {
								color: ['#e0e0e0'],
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
								color: '#e0e0e0'
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							lineStyle: {
								color: ['#e0e0e0'],
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
					series: [
					    {
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
				    				color: '#3f9981'
				    			}
				    		},
				    		name: '进水口',
				    		barWidth: '20%',
				    		barGap: 0,
				    		data: [660, 841, 521, 820, 578, 127, 100, 730, 700, 660, 841, 521, 820, 578, 127, 100, 730, 700]
					    },
					    {
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
				    				color: '#00d099'
				    			}
				    		},
				    		name: '出水口',
				    		barWidth: '20%',
				    		barGap: 0,
				    		data: [160, 841, 521, 820, 578, 127, 100, 730, 700, 660, 841, 521, 820, 578, 127, 100, 730, 700]
					    },
					]
				}];

		echarts_data_0.setOption(options_data[0]);

		window.onresize = echarts_data_0.resize;

		var echartsApp = [];

		$('.sewerage-tab-card > ul li').click(function() {
			var _this = $(this);
			var _index = _this.index();

			//根据TAB切换的index值确定绘制哪一个图表
			//获取绘制图表的对象
			
			if(window.echartsDemo) {
				window.echartsDemo.clear();
			}
			// $(elemDataView[index]).css('height','363px');
			echartsApp[_index] = echarts.init(data_record[0], layui.echartsTheme);

			window.echartsDemo = echartsApp[_index];

			echartsApp[_index].setOption(options_data[_index]);

			window.onresize = echartsApp[_index].resize;
		})
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
	  		table = layui.table,global=layui.global;
	  
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
		    ,{field:'alarmTime', title: '时间'}
		    ,{field:'checkPointId', title: '泵站'}
		    ,{field:'alarmType', title: '数据类型 '}
		    ,{field:'dataValue', title: '数据值'}
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
				    ,{field:'alarmTime', title: '时间'}
				    ,{field:'checkPointId', title: '泵站'}
				    ,{field:'alarmType', title: '数据类型 '}
				    ,{field:'dataValue', title: '数据值'}
	  		  ]]
	  		  
	  		});
	  	}, 200)
	  });
	});

	exports('dataRecord_1', {})
})