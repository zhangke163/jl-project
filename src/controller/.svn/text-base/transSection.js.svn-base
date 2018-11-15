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
	var drawLayer = null;
	$(function() {
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
				marker: false,
				polyline: true,
				polygon: false,
				circle: false, // Turns off this drawing tool
				rectangle: false
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
				geo = getInputGeo(type, layer),
				geoJson = geo.toGeoJSON() //绘制几何要素
				,
				paths = convertPath(layer._latlngs); //几何要素的path
			geoBounds = geo.getBounds();

			/*横断面分析*/
			TransSection(paths);
			editableLayers.addLayer(layer);
		});
		map.on(L.Draw.Event.DRAWSTART, function(e) {
			editableLayers.clearLayers();
		});

		/*获取几何要素*/
		function getInputGeo(shapeType, drawLayer) {
			var arrlatlng = [];
			if(shapeType === 'polyline') {
				drawLayer._latlngs.forEach(function(item) {
					var temp = [];
					temp[0] = item.lat;
					temp[1] = item.lng;
					arrlatlng.push(temp);
				});

				var polyline = L.polyline(arrlatlng);
				return polyline;
			}
		}

		/*转为rings*/
		function convertPath(latlngs) {
			var path = [];
			$.each(latlngs, function() {
				var latlng = this,
					tempArry = []; //记录点坐标
				tempArry.push(latlng.lng);
				tempArry.push(latlng.lat);
				path.push(tempArry);
			});

			return [path];
		}

		/*横断面分析*/
		function TransSection(paths) {
			var inputPolyline = {};
			inputPolyline.paths = paths;
			inputPolyline = JSON.stringify(inputPolyline);
			//pipelineTypes
			var pipelineTypes = ["1", "2", "3"];
			var analysisFields = [];
			/*空间分析url*/
			var url = "?inputLine=" + inputPolyline + "&pipelineTypes=" + pipelineTypes + "&isJWD=true&f=json";
			var requestUrl = mapServer + "/exts/pipelineSpatialAnalysis/transSection" + url;

			$.ajax({
				url: requestUrl,
				type: 'GET',
				async: false,
				success: function(data) {
					var layer = layui.layer;
					var results = JSON.parse(data); //Arc server返回数据
					var html = ""; //模板html
					var url = layui.setter.base + 'views/spatialAnalysis/transSectionResult.html'; //'./assets/view/OverBurdenDepth.html';
					/*请求渲染模板，弹出层显示*/

					$.ajax({
						url: url,
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
						title: '横断面分析结果',
						content: html,
						id: 'transSection',
						area: ["750px", "700px"],
						shade: 0,
						shadeClose: false,
						closeBtn: true,
						success: function(layero, index) {

							$('.layui-layer-title ').css('height', '35px'); //弹出层标题栏
							$('.layui-layer-title ').css('line-height', '35px'); //弹出层标题栏
							$('.layui-layer-setwin a').css('background-position', '1px -40px'); // 弹出层关闭按钮
							if(results.error == null) {
								TransSectionResult(results);
							}
						},
						end: function() {
							/*清楚图层要素*/
							analystHightLightGroup.clearLayers();
							/*结束功能*/
						}
					});
				},
				error: function(error, XHQ, data) {}
			});

		}
		/*结果计算*/
		function TransSectionResult(resultAll) {
			results = resultAll.result; //server分析结果

			var canvas = document.getElementById('canvas-container');
			canvas.width = "750"; //注意，不要加 px
			canvas.height = "500";
			var ctx = canvas.getContext('2d');

			ctx.translate(50, 450);
			ctx.rotate(270 * Math.PI / 180);

			//构建计算坐标要用的数组
			var drawInfo = new Array;
			var tempX = results[0].crossPtX;
			//交点最低点
			var minCrossPtZ = results[0].crossPtZ;
			//地面点最高点
			var maxGroundPtZ = results[0].crossPtZ + results[0].crossPtBuriedDepth;

			$.each(results, function(index, result) {
				var info = {};
				info.layerId = result.layerInfo.id;
				info.layerName = result.layerInfo.name;
				info.crossPtX = result.crossPtX - tempX;
				info.crossPtZ = result.crossPtZ;
				info.depth = result.crossPtBuriedDepth;
				info.groundPtZ = info.crossPtZ + info.depth;
				drawInfo.push(info);
				if(minCrossPtZ > info.crossPtZ) {
					minCrossPtZ = info.crossPtZ;
				}
				if(maxGroundPtZ < info.crossPtZ + info.depth) {
					maxGroundPtZ = info.crossPtZ + info.depth;
				}
			});

			//计算地面点和交叉点的坐标
			var groundPts = new Array;
			var crossPts = new Array;
			//获取画布的高，转换坐标用
			//var myCanvasHeight=parseInt(domAttr.get("myCanvas","height"));

			//x方向最大差
			var maxCrossPtX = drawInfo[drawInfo.length - 1].crossPtX;
			if(maxCrossPtX == 0)
				maxCrossPtX = 0;
			//z方向最大差
			var h = maxGroundPtZ - minCrossPtZ;

			$.each(drawInfo, function(index, info) {

				var groundPt = {};
				groundPt.X = info.crossPtX / maxCrossPtX * 500 + 50;
				groundPt.Z = (info.groundPtZ - minCrossPtZ) / h * 300 + 50;
				groundPts.push(groundPt);

				var crossPt = {};
				crossPt.X = info.crossPtX / maxCrossPtX * 500 + 50;
				crossPt.Z = (info.crossPtZ - minCrossPtZ) / h * 300 + 50;
				crossPts.push(crossPt);
			});

			var colorAndLayerNameInfos = new Array();
			//每层的颜色
			var i = 0;
			$.each(crossPts, function(index, pt) {
				var info = {};
				var url2 = mapServer + "/" + drawInfo[i].layerId + "?f=json";
				//var url2 = "http://127.0.0.1:6080/arcgis/rest/services/JHPS/Default20180706/MapServer/" + drawInfo[i].layerId + "?f=json";
				i++;
				$.ajax({
					type: "get",
					url: url2,
					async: false,
					success: function(data) {
						var resultJson = JSON.parse(data);
						try {
							color = resultJson.drawingInfo.renderer.defaultSymbol.color;
						} catch(err) {
							color = resultJson.drawingInfo.renderer.symbol.color;
						}
						info.color = color;
						info.layerName = resultJson.name;
						colorAndLayerNameInfos.push(info);
					}
				}, function(error) {
					alert(error);
				});
			});

			//*******开始画图********
			drawAxes(ctx);
			drawGround(ctx, crossPts, groundPts, colorAndLayerNameInfos, drawInfo);
			drawCrossPoint(ctx, crossPts, colorAndLayerNameInfos);
			drawLabel(ctx, crossPts, drawInfo);
			drawLegend(ctx, colorAndLayerNameInfos);

			//初始化表格		
			initTable(results);

		}

		function drawLegend(ctx, colorAndLayerNameInfos) {
			var strContent = "";
			var i = 1;
			$.each(colorAndLayerNameInfos, function(index, info) {
				if(strContent.indexOf(info.layerName) == -1) {
					color = info.color;
					drawPoint(ctx, 400, 200 * i, 5, color, true);
					ctx.rotate(90 * Math.PI / 180);
					drawText(ctx, 200 * i + 10, -392, info.layerName, 20)
					ctx.rotate(270 * Math.PI / 180);
					strContent += info.layerName;
					i++;
				}
			});
		}

		function drawCrossPoint(ctx, crossPts, colorAndLayerNameInfos) {
			$.each(crossPts, function(index, item) {
				var name = results[index].layerInfo.name;
				$.each(colorAndLayerNameInfos, function(idx, info) {
					if(name.indexOf(info.layerName) != -1) {
						color = info.color;
						drawPoint(ctx, item.Z, item.X, 5, color, true)
						drawPoint(ctx, item.Z, 0, 2, color, false); //在y轴的投影点
						drawPoint(ctx, 0, item.X, 2, color, false); //在x轴的投影点		
					}
				});
			});
		}

		function drawGround(ctx, crossPts, groundPts, colorAndLayerNameInfos, drawInfo) {
			$.each(groundPts, function(index, item) {
				var name = results[index].layerInfo.name;
				$.each(colorAndLayerNameInfos, function(idx, info) {
					if(name.indexOf(info.layerName) != -1) {
						color = info.color;

						drawPoint(ctx, item.Z, item.X, 2, color, false); //地面实际点	
						drawGroundLine(ctx, index, groundPts);
						drawGroudToCross(ctx, item, crossPts[index]);

						ctx.rotate(90 * Math.PI / 180);
						drawPointDistance(ctx, index, groundPts, drawInfo); //在x轴的投影点
						ctx.rotate(270 * Math.PI / 180);
					}
				});
			});
		}

		function drawLabel(ctx, crossPts, drawInfo) {
			ctx.rotate(90 * Math.PI / 180);
			$.each(crossPts, function(index, item) {
				drawText(ctx, item.X - 10, -item.Z + 20, drawInfo[index].depth, 12)
			});
			ctx.rotate(270 * Math.PI / 180);
		}

		function drawPointDistance(ctx, index, groundPts, drawInfo) {
			if(index > groundPts.length - 2)
				return;
			var start = groundPts[index];
			var to = groundPts[index + 1];
			var dis = drawInfo[index + 1].crossPtX - drawInfo[index].crossPtX; //点水平距离

			var textX = (start.X + to.X) / 2 - 10;
			drawText(ctx, textX, 15, dis.toFixed(2), 12);
		}

		function drawGroundLine(ctx, index, groundPts) {
			if(index > groundPts.length - 2)
				return;
			var start = groundPts[index];
			var to = groundPts[index + 1];
			ctx.beginPath();
			ctx.setLineDash([]);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(112,128,144,1)';
			ctx.moveTo(start.Z, start.X);
			ctx.lineTo(to.Z, to.X);
			ctx.stroke();
		}

		function drawGroudToCross(ctx, itemGroundPt, itemCrossPt) {
			ctx.beginPath();
			ctx.setLineDash([5]); //虚线
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(105,105,105,1)';

			ctx.moveTo(itemGroundPt.Z, itemGroundPt.X);
			ctx.lineTo(itemCrossPt.Z, itemCrossPt.X);
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

		function drawPoint(ctx, x, y, r, color, outline) {

			var rgbColor = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
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

		function initTable(result) {
			//表格数据

			var tableData = []; //表格数据
			var startPtNum = "起点点号";
			var endPtNum = "终点点号";
			var fMap = {}; //配置文件覆土标准数据

			$.each(result, function(index) {
				debugger
				var temp = {};
				var item = this;
				/*获取要素数据*/
				temp.id = item.pipeLine.attributes['OBJECTID']; //此处有坑，配置文件一定正确
				temp.layerId = item.layerInfo.id;
				temp.GXZL = item.layerInfo.name;
				temp.QDDH = item.pipeLine.attributes["起点点号"]; //起点点号
				temp.ZDDH = item.pipeLine.attributes["终点点号"]; //
				temp.QDMS = item.pipeLine.attributes["起点埋深"]; //埋深
				temp.ZDMS = item.pipeLine.attributes["终点埋深"]; //
				temp.QDGC = item.pipeLine.attributes["起点高程"]; //高程
				temp.ZDGC = item.pipeLine.attributes["终点高程"]; //			
				tableData.push(temp);
			});
			//显示表格
			tableShow(tableData);
		}

		/*表格显示*/
		function tableShow(tableData) {
			layui.use('table', function() {
				var table = layui.table;
				/*渲染表格*/
				table.render({
					elem: '#analysisResult',
					data: tableData,
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
					cellMinWidth: 40,
					text: {
						none: '没有返回结果哦，请检查配置文件及数据'
					},
					cols: [
						[{
								field: 'GXZL',
								title: '类型',
								sort: true,
								align: 'center',
								fixed: 'false'
							},
							{
								field: 'QDDH',
								title: '起点点号',
								sort: true,
								align: 'center',
								fixed: 'false'
							},
							{
								field: 'ZDDH',
								title: '终点点号',
								sort: true,
								align: 'center',
								fixed: 'false'
							}, {
								field: 'QDMS',
								title: '起点埋深',
								align: 'center',
								sort: true,
								fixed: 'false'
							},
							{
								field: 'ZDMS',
								title: '终点埋深',
								align: 'center',
								sort: true,
								fixed: 'false'
							},
							{
								field: 'QDGC',
								title: '起点高程',
								align: 'center',
								sort: true,
								fixed: 'false'
							},
							{
								field: 'ZDGC',
								title: '终点高程',
								align: 'center',
								sort: true,
								fixed: 'false'
							},
							{
								title: '操作',
								width: 80,
								fixed: 'right',
								align: 'center',
								toolbar: '#tableTool'
							}
						]
					],
					even: true,
					id: 'analysisResult'
				});
				$('.analysisTool .layui-btn-xs').css('font-size', '10px'); //表格工具栏按钮，定位- 详情
				$('.analysisTool .layui-btn').css('margin-left', '0');
				/*绑定事件*/
				table.on('tool(analysis)', function(obj) {

					var data = obj.data; //获得当前行数据
					var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
					var tr = obj.tr; //获得当前行 tr 的DOM对象
					var id = data.id;
					var layerId = data.layerId;
					//定位
					if(layEvent === 'locate') {
						/*定位*/
						zoomRow(id, layerId);
					}
					//详情
					else if(layEvent === 'detail') {}
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
				//画一根线
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

	exports('transSection', {})
});