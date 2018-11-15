layui.define([
	'admin',
	'layer',
	'laypage',
	'html5shiv',
	'maputil',
	'expData'
], function(exports) {
	var $ = layui.jquery,
		laypage = layui.laypage,
		layer = layui.layer,
		maputil = layui.maputil,
		expData = layui.expData,
		config = expData.config;
	var resUrl = layui.setter.base + 'style/res';
	var editableLayers = new L.featureGroup();

	$(function() {
		// debugger
		initWindow();
		maputil.initGlobal();
		initMap();
		maputil.initMapControl();
		maputil.initMapEvent();
		initEvent();
		initDrawControl();
		map.invalidateSize(); //重置地图尺寸		
	})

	function initDrawControl() {
		/*Draw配置*/
		var options = {
			position: 'topleft',
			draw: {
				marker: false, // Turns off this drawing tool
				polyline: false,
				polygon: true,
				circle: false,
				rectangle: true
			},
			edit: false
		};
		drawControl = new L.Control.Draw(options);
		map.addControl(drawControl);
		map.addLayer(editableLayers);

		/*绘制完成事件*/
		map.on(L.Draw.Event.CREATED, function(e) {
			console.log("L.Draw.Event.CREATED");
			var type = e.layerType,
				layer = e.layer,
				ring = convertRings(layer._latlngs[0]); //几何要素的path		
			/*横断面分析*/
			VerticalSection(ring);
			editableLayers.addLayer(layer);
		});
		map.on(L.Draw.Event.DRAWSTART, function(e) {
			editableLayers.clearLayers();
		});

		/*转为rings*/
		function convertRings(latlngs) {
			var rings = [];
			$.each(latlngs, function(index, latlng) {
				tempArry = []; //记录点坐标			
				tempArry.push(latlng.lat);
				tempArry.push(latlng.lng);
				rings.push(tempArry);
			});
			rings.push([latlngs[0].lat, latlngs[0].lng]);
			return [rings];
		}

		/*纵断面分析*/
		function VerticalSection(ring) {
			var polygon = L.polygon(ring);
			var queryService = L.esri.query({
				url: mapServer
			});
			var pipelineTypes = [2, 3];
			var featureList = [];

			var count = 0;
			$.each(pipelineTypes, function(index, item) {
				/*空间分析url*/
				queryService.layer(item).intersects(polygon).run(function(error, featrueCollection) {

					if(featrueCollection.features.length > 0) {
						featureList.push.apply(featureList, featrueCollection.features);
					}
					if(++count == pipelineTypes.length) {
						//			debugger
						var analysisFields = [];
						//请求模板
						var htmlUrl = layui.setter.base + 'views/spatialAnalysis/verticalSectionResult.html'
						$.ajax({
							url: htmlUrl,
							type: 'GET',
							dataType: 'html',
							async: false,
							success: function(result) {
								html = result;
							},
							error: function(err) {
								alert('模板请求失败' + err);
							}
						});

						/*横断面分析结果面板*/
						layer.open({
							type: 1,
							title: '纵断面分析结果',
							content: html,
							id: 'verticalSection',
							area: ["700px", "750px"],
							shade: 0,
							shadeClose: false,
							closeBtn: true,
							success: function(layero, index) {
								$('.layui-layer-title ').css('height', '35px'); //弹出层标题栏
								$('.layui-layer-title ').css('line-height', '35px'); //弹出层标题栏
								$('.layui-layer-setwin a').css('background-position', '1px -40px'); // 弹出层关闭按钮
								if(featureList.length > 0) {
									initTable(featureList);
								}
							},
							end: function() {
								/*清楚图层要素*/
								analystHightLightGroup.clearLayers();
							}
						});
					}
				});
			});
		}

		function initTable(result) {
			//表格数据
			var tableData = []; //表格数据
			$.each(result, function(index) {
				var temp = {};
				var item = this;
				/*获取要素数据*/
				temp.tag = item;
				temp.layerId = getLayerId(item.properties["管线性质"]);
				temp.ID = item.properties['OBJECTID']; //
				temp.GXZL = item.properties["管线性质"];
				temp.QDDH = item.properties["起点点号"]; //点号
				temp.ZDDH = item.properties["终点点号"];
				temp.QDGC = item.properties["起点高程"]; //高程
				temp.ZDGC = item.properties["终点高程"]; //
				tableData.push(temp);
			});
			//显示表格
			if(result.length > 0) {
				drawVertical(result[0]); //首次显示第一个要素的横断面
			}
			tableShow(tableData);

		}

		function getLayerId(type) {
			if(type == "污水") {
				return 3;
			} else if(type == "雨水") {
				return 2;
			}
		}

		/*表格显示*/
		function tableShow(tableData) {
			layui.use('table', function() {
				var table = layui.table;
				/*渲染表格*/

				table.render({
					elem: '#analysisResult',
					data: tableData,
					id: 'analysisResult',
					page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
						layout: ['count', 'prev', 'page', 'next', 'skip'] //自定义分页布局
							//,curr: 5 //设定初始在第 5 页							
							,
						groups: 3 //只显示 1 个连续页码							
							,
						first: false //不显示首页							
							,
						last: false //不显示尾页

					},
					cellMinWidth: 50,
					text: {
						none: '没有返回结果哦，请检查配置文件及数据'
					},
					cols: [
						[{
								field: 'ID',
								title: 'OID',
								sort: true,
								width: 76,
								align: 'center'
							}, {
								field: 'GXZL',
								title: '类型',
								sort: false,
								width: 70,
								align: 'center'
							},
							{
								field: 'QDDH',
								title: '起点点号',
								sort: false,
								width: 95,
								align: 'center'
							},
							{
								field: 'ZDDH',
								title: '终点点号',
								sort: false,
								width: 95,
								align: 'center'
							},
							{
								field: 'QDGC',
								title: '起点高程',
								align: 'center',
								sort: true,
								width: 102,
								templet: function(d) {
									return d["QDGC"].toFixed(2);
								}
							},
							{
								field: 'ZDGC',
								title: '终点高程',
								align: 'center',
								sort: true,
								width: 102,
								templet: function(d) {
									return d["ZDGC"].toFixed(2);
								}
							},
							{
								title: '操作',
								minWidth: 80,
								fixed: 'right',
								align: 'center',
								toolbar: '#tableTool'
							}
						]
					],
					even: true
				});

				$('.analysisTool .layui-btn-xs').css('font-size', '10px'); //表格工具栏按钮，定位- 详情
				$('.analysisTool .layui-btn').css('margin-left', '0');
				$(".layui-table").css('width', '100%');

				/*绑定事件*/
				table.on('tool(analysis)', function(obj) {

					var data = obj.data; //获得当前行数据
					var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
					var tr = obj.tr; //获得当前行 tr 的DOM对象
					
					var id = data.ID;
					var layerId = data.layerId;
					//定位
					if(layEvent === 'locate') {
						/*定位*/
						zoomRow(id, layerId);
						//						console.log(data);
						drawVertical(data.tag);
					}
					//详情
					else if(layEvent === 'detail') {

					}
				});

			});
		}

		/*定位*/
		function zoomRow(id, layerId) {

			/*查询字符串*/
			var queryString = config.onlyID + '= ' + id; //OBJECTID
			/*查询URL*/
			var url = mapServer + '/' + layerId;
			/*定义查询对象*/
			var query = L.esri.query({
				url: url
			});
			/*设定查询条件*/
			query.where(queryString);
			/*执行查询*/
			query.run(function(error, featureCollection, response) {

				/*获取路径*/
				var linePath = response.features[0].geometry.paths[0];
				var paths = [];
				/*经纬度转换，[纬度 经度]*/
				$.each(linePath, function() {
					var path = this;
					var temp = [];
					temp[0] = path[1];
					temp[1] = path[0];
					paths.push(temp);
				});
				//画线
				var pLine = L.polygon(paths, {
					color: 'red',
					opacity: 1,
					weight: 3,
					clickable: false
				});
				/*清楚高亮显示*/
				analystHightLightGroup.clearLayers();
				/*高亮显示*/
				analystHightLightGroup.addLayer(pLine);
				//map.setView(paths[0]);
				/*定位*/
				map.fitBounds(pLine.getBounds());

			});
		}

		function drawVertical(feature) {
			var startX = 100;
			var coords = feature.geometry.coordinates;

			var distance = map.distance(coords[0], coords[1]);
			var height = parseFloat(feature.properties["终点高程"]) - parseFloat(feature.properties["起点高程"]);
			var angel = 180 / Math.PI * Math.asin(Math.abs(height) / distance);

			var offsetX = distance * 20;

			var drawInfo = new Array;
			var startPt = {}
			startPt.X = startX;
			startPt.Z = 350 - parseFloat(feature.properties["起点埋深"]) * 20; //方式一，固定地面高度
			//			startPt.Z = 100 + parseFloat(feature.properties["起点高程"]) * 3 ;//方式二，包括地面起伏
			startPt.DH = feature.properties["起点点号"]
			startPt.D = parseFloat(feature.properties["起点埋深"]);
			drawInfo.push(startPt);

			var toPt = {}
			toPt.X = startX + 400;
			toPt.Z = 350 - parseFloat(feature.properties["终点埋深"]) * 20; //方式一，固定地面高度
			//			toPt.Z = 100 + parseFloat(feature.properties["起点高程"]) * 3 ;//方式二，包括地面起伏
			toPt.DH = feature.properties["终点点号"];
			toPt.D = parseFloat(feature.properties["终点埋深"]);

			drawInfo.push(toPt);

			var groundInfo = new Array;
			var groundPt1 = {}
			groundPt1.X = 50;
			groundPt1.Z = 350; //方式一，固定地面高度
			//			groundPt1.Z =  100 + parseFloat(feature.properties["起点高程"]) * 3 + parseFloat(feature.properties["起点埋深"]) * 20;//方式二，包括地面起伏
			groundInfo.push(groundPt1);
			var groundPt2 = {}
			groundPt2.X = 520;
			groundPt2.Z = 350; //方式一，固定地面高度
			//			groundPt2.Z =  100 + parseFloat(feature.properties["终点高程"]) * 3 + parseFloat(feature.properties["终点埋深"]) * 20;//方式二，包括地面起伏
			groundInfo.push(groundPt2);

			canvas = document.getElementById('canvas-container');
			canvas.width = "730"; //注意，不要加 px
			canvas.height = "500";
			var ctx = canvas.getContext('2d');

			ctx.translate(50, 450);
			ctx.rotate(270 * Math.PI / 180);

			drawAxes(ctx);
			drawGround(ctx, groundInfo);
			drawPipeLine(ctx, drawInfo, distance);
			drawGroundToPipe(ctx, groundInfo, drawInfo);
			drawAngel(ctx, groundInfo, drawInfo);
		}

		function drawAngel(ctx, groundInfo, drawInfo) {

		}

		function drawPipeLine(ctx, drawInfo, distance) {
			//起点终点
			$.each(drawInfo, function(index, item) {
				//				drawPoint(ctx, item.Z, item.X, 5, false)
				drawPoint(ctx, 0, item.X, 2, false); //在x轴的投影点	
				ctx.rotate(90 * Math.PI / 180);
				drawText(ctx, item.X - 20, -(item.Z - 30), item.DH, 12); //点号
				drawText(ctx, item.X + 10, -(item.Z + 20), item.D.toFixed(2), 12); //埋深
				ctx.rotate(270 * Math.PI / 180);
			});

			var start = drawInfo[0];
			var to = drawInfo[1];

			//管段			
			ctx.beginPath();
			ctx.setLineDash([]);
			ctx.lineWidth = 10;
			ctx.strokeStyle = 'rgba(210,180,140,1)';
			ctx.moveTo(start.Z, start.X);
			ctx.lineTo(to.Z, to.X);
			ctx.stroke();

			//管段长度文本
			var mid = {};
			mid.Z = (start.Z + to.Z) / 2;
			mid.X = (start.X + to.X) / 2

			ctx.rotate(90 * Math.PI / 180);
			drawText(ctx, mid.X - 20, -(mid.Z + 10), '长度:' + distance.toFixed(2), 12); //长度
			ctx.rotate(270 * Math.PI / 180);
		}

		function drawGround(ctx, groundInfo) {
			//地面端点
			drawPoint(ctx, groundInfo[0].Z, groundInfo[0].X, 1, false);
			drawPoint(ctx, groundInfo[1].Z, groundInfo[1].X, 1, false);
			//地面线
			var start = groundInfo[0];
			var to = groundInfo[1];
			ctx.beginPath();
			ctx.setLineDash([]);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(112,128,144,1)';
			ctx.moveTo(start.Z, start.X);
			ctx.lineTo(to.Z, to.X);
			ctx.stroke();
			//水平虚线，
			ctx.beginPath();
			ctx.setLineDash([3]);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(112,128,144,0.8)';
			ctx.moveTo(start.Z, start.X);
			ctx.lineTo(start.Z, to.X);
			ctx.stroke();

		}

		function drawGroundToPipe(ctx, groundInfo, drawInfo) {
			var start = groundInfo[0];
			var to = drawInfo[0];
			ctx.beginPath();
			ctx.setLineDash([5]);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(112,128,144,1)';
			ctx.moveTo(start.Z, to.X);
			ctx.lineTo(to.Z, to.X);
			ctx.stroke();

			start = groundInfo[1];
			to = drawInfo[1];
			ctx.beginPath();
			ctx.setLineDash([5]);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(112,128,144,1)';
			ctx.moveTo(start.Z, to.X);
			ctx.lineTo(to.Z, to.X);
			ctx.stroke();
		}

		function drawAxes(ctx) {
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'rgba(158,158,255,1)';
			//x
			ctx.moveTo(20, 0);
			ctx.lineTo(400, 0);

			//y
			ctx.moveTo(0, 20);
			ctx.lineTo(0, 600);
			ctx.stroke();

			ctx.rotate(90 * Math.PI / 180);
			drawText(ctx, 600, 20, "距离(米)", 18);
			drawText(ctx, 5, -410, "埋深(米)", 20);
			ctx.rotate(270 * Math.PI / 180);
		}

		function drawText(ctx, x, y, text, size) {
			ctx.font = size + "px Arial";
			ctx.fillStyle = "#080808"
			ctx.fillText(text, x, y);
		}

		function drawPoint(ctx, x, y, r, outline) {
			var rgbColor = "rgba(210,180,140,1)";
			if(outline) {
				ctx.beginPath();
				ctx.arc(x, y, r + 1, 0, 2 * Math.PI); // 绘制圆 参数依次为 圆的横坐标/纵坐标/半径/绘制圆的起始位置/绘制圆的弧度大小
				ctx.fillStyle = "rgba(0,0,0,1)"; // 设置填充颜色
				ctx.fill(); // 填充颜色
				ctx.closePath();
			}
			ctx.beginPath();
			ctx.arc(x, y, r, 0, 2 * Math.PI); // 绘制圆 参数依次为 圆的横坐标/纵坐标/半径/绘制圆的起始位置/绘制圆的弧度大小
			ctx.fillStyle = rgbColor; // 设置填充颜色
			ctx.fill(); // 填充颜色
			ctx.closePath(); // 关闭绘制路径
		}

	}

	function initWindow() {
		// 初始化 map_container div 的大小
		$('#map_container').height($(window).height() - 107);
		// 监听浏览器窗口发生变化时，动态调整div的尺寸
		$(window).resize(function() {
			$('#map_container').height($(window).height() - 107);
		});
	}

	function initMap() {
		//		document.getElementById('map_container').innerHTML = "<div id='mapPanel' style='width: 100%; height: 100%;'></div>";

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
			layers: [ys, ws, analystHightLightGroup]
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

		map.on('click', function() {
			$(".positionLink,.positionRecord").css('display', 'block');
			$(".result").css("display", "none");
		});

		$('#back').click(function() {
			reopenHomepage();
		});

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
			popInfo += `<div class="fl" id="message">管点信息</div><div class="fr"><a href="javascript:;" style="font-size: 10px;">图片查看<img  data="${properties['物探点号']}" src="${resUrl2}/图片.png" alt="图片" onclick="showWellImage(event)" style="margin: -3px 0 0 3px;"></a></div></div><div style="padding:0 20px;"><div class="bcgblue"><div class="title"><span>雨水管点#${properties['OBJECTID']}</span><span id="photocode">井盖照片代码<strong style="font-size:14px;font-weight:normal;margin-left:8px;">${properties['OBJECTID']}</strong></span></div>`;
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

	//生成属性列表
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
		imgSrc = `${imageHref2}${wtdh}.jpg`;
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
			videoSrc1 = `${videoSrc2}${video}`;
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
				}).addTo(mapFlood);
				if(feature.geometry.type == "Point") {
					latlng = L.latLng(feature.geometry.coordinates.reverse());
				} else {
					latlng = L.latLng(feature.geometry.coordinates[0].reverse());
				}

				mapFlood.setView(latlng, 18);
				proToTable(feature.properties, latlng);
			}
		});
	}

	exports('verticalSection', {})
});