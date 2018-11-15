layui.define([
	'admin',
	'layer',
	'html5shiv',
	'maputil',
	'wicket',
	'wicket-leaflet',
	'leaflet-touch-helper',
	'laypage',
	'customUtil'
], function(exports) {
	var $ = layui.jquery,
		laypage = layui.laypage,
		layer = layui.layer,
		maputil = layui.maputil,
		customUtil = layui.customUtil;
	//自定义首页、尾页、上一页、下一页文本
	laypage.render({
		elem: 'demo3',
		count: 100,
		first: '首页',
		last: '尾页',
		prev: '<em><</em>',
		next: '<em>></em>'
	});
	var drawLayer = null;
	var popup = null;
	var pageInit = customUtil.pageInit;
	var routeLayer = new L.featureGroup(),
		popup = null,
		pathOptions = {
			color: '#F00',
			weight: 2,
			opacity: 1,
			clickable: true
		};
	$(function() {
		initWindow();
		maputil.initGlobal();
		initMap();
		maputil.initMapControl();
		//maputil.initMapEvent();
		initMapControl();
		initRoute();

	})

	$('#routeQuery').on('click', function() {
		var name = $.trim($(".searchInput")[0].value);
		let dataUrl = `${backUrl}checkLines/getList?name=${name}`;
		excuteAjax(dataUrl);
	});

	function excuteAjax(dataUrl) {
		var pageSize = 10;
		$.ajax({
			url: dataUrl,
			success: function(result) {
				var total = result.count; //记录总数
				totalLeft = total;
				if(total) {
					var data = getTable(result, 1, pageSize);
					$("#routeResult").empty().html(data);
					if(total > 10) {
						//初始化一个分页控件
						pageInit(total, 4, 1, 'demo3', dataUrl, $("#routeResult"), getTable);
						$('#demo3').css('display', 'block');
					} else {
						$('#demo3').css("display", "none");
					}
				} else {
					$("#routeResult").empty();
				}
			}
		});
	}

	function initRoute() {
		let dataUrl = backUrl + 'checkLines/getList?limit=-1';
		$.ajax({
			url: dataUrl,
			success: function(res) {
				routeLayer.clearLayers();
				var data = res.data || [];

				var wktObj = new Wkt.Wkt();
				if(data.length > 0) {
					data.forEach(function(item) {
						pathOptions.name = item.name;
						pathOptions.id = item.id;
						var path = item.line;
						var feature = L.polyline(eval("(" + path + ")"), pathOptions).on('click', function(e) {
							console.log(e);
							var content = `
							<div>
								<div class="popupContent">
									<p class="addAddress-p layui-hide">请输入路线名称</p>
									<form>
										<div class="addAddress-box">
											<input type="text" id="name" class="addAddress" value="${e.target.options.name}" disabled="disabled">
											<i id="editBtn"><img src="../src//style/res/edit_1.png" class="editBtn"></i>
										</div>										
										<div>
											<input type="button" class="btn-delete" value='删除' onclick="deleteRoute(${e.target.options.id})">
											<input type="button" class="btn-cancel layui-hide" value="取消" onclick='cancelSave("${e.target.options.name}")'>
											<input type="button" class="btn-save layui-hide" value='保存' onclick='updateRoute(${e.target.options.id})'>
											<div class="layui-clear"></div>
										</div>
									</form>
								</div>
							</div>
						`;
							L.popup().setContent(content).setLatLng(e.latlng).openOn(map)
						}).addTo(routeLayer);
						L.path.touchHelper(feature, {
							extraWeight: 15
						}).addTo(routeLayer);
					})
				}

			}
		})
		excuteAjax(`${backUrl}checkLines/getList`);

		$(document).on('click', '#editBtn', function() {
			var _this = $(this);
			_this.addClass('layui-hide').prev().removeAttr('disabled').parents('form').prev().removeClass('layui-hide');
			_this.parent().next().children('.btn-delete').addClass('layui-hide').next().removeClass('layui-hide').next().removeClass('layui-hide');
		});
	}

	function initWindow() {
		$('#siteMap').height($(window).height() - 219);
		$('#route_left').height($(window).height() - 219);
		// 监听浏览器窗口发生变化时，动态调整div的尺寸
		$(window).resize(function() {
			$('#siteMap').height($(window).height() - 219);
			$('#route_left').height($(window).height() - 219);
			map.invalidateSize(); //重置地图尺寸
		});
		// 初始化 panorama_container div 的大小
		$('#panorama_container').height($(window).height() - 219);
		// 监听浏览器窗口发生变化时，动态调整div的尺寸
		$(window).resize(function() {
			$('#panorama_container').height($(window).height() - 219);
			map.invalidateSize(); //重置地图尺寸
		});
	}

	function initMap() {
		map = L.map('siteMap', {
			crs: crs,
			zoomControl: false,
			attributionControl: false,
			doubleClickZoom: false,
			boxZoom: true,
			dragging: true,
			minZoom: 12,
			maxZoom: 20,
			maxBounds: bounds,
			layers: [ys, ws, jcp, bzp, wsca]
		}).setView([29.08948, 119.65279], 13);

		map.addLayer(vector);
		map.addLayer(routeLayer);
	};

	function initMapControl() {
		if(!drawControl) {
			var drawControl = new L.Control.Draw({
				position: 'topleft',
				draw: {
					polyline: true,
					polygon: false,
					circle: false,
					marker: false,
					rectangle: false
				},
				edit: {
					featureGroup: routeLayer,
					edit: false,
					remove: false
				}
			});
		}
		map.addControl(drawControl);

		map.on('draw:created', function(e) {
			shapeType = e.layerType;
			drawLayer = e.layer;
			routeLayer.addLayer(drawLayer);

			var content = `
				<div>
					<div class="popupContent">
						<p class="addAddress-p">请输入地点名称</p>
						<form>
							<div class="addAddress-box">
								<input type="text" id="name" class="addAddress">
							</div>
							<div>
								<input type="button" class="btn-cancel" value="取消" onclick='cancelSave()'>
								<input type="button" class="btn-save" value='保存' onclick='saveRoute()'>
								<div class="layui-clear"></div>
							</div>
						</form>
					</div>
				</div>
			`;
			popup = L.popup({
				keepInView: true,
				closeButton: false,
				closeOnClick: false
			}).setContent(content).setLatLng(drawLayer._latlngs[0]).openOn(map);
			maputil.initMapEvent();
		});

		map.on('draw:drawstart', function(e) {
			map.off('click');
		});
	};

	function getTable(result, pageIndex, pageSize) {
		var data = "";
		if(result != "" && result != null) {
			//获取json数据			
			$.each(result.data, function(idx, item) {
				let orderNum = (pageIndex - 1) * pageSize + idx + 1;
				let name = item.name;
				let id = item.id;
				let path = item.line;
				data += `<div class="site-item" onclick='zoomTo("${path}","${name}","${id}")'>
										<div class="item-left">
											<span>${orderNum}</span>
										</div>
										<div class="item-right">
											<div class="site-name">路线: ${name}</div>
											<div class="site-id">ID: ${id}</div>
										</div>
										<div class="layui-clear"></div>
									</div>`;
			});
		}
		data = data === "" ? "<div class='nolist'>暂无数据</div>" : data;
		return data;
	};

	window.zoomTo = function(path, name, id) {
		var feature = L.polyline(eval("(" + path + ")"), pathOptions);
		map.fitBounds(feature.getBounds());

		var content = `
				<div>
					<div class="popupContent">
						<p class="addAddress-p layui-hide">请输入路线名称</p>
						<form>
							<div class="addAddress-box">
								<input type="text" id="name" class="addAddress" value="${name}" disabled="disabled">
								<i id="editBtn"><img src="../src//style/res/edit_1.png" class="editBtn"></i>
							</div>							
							<div>
								<input type="button" class="btn-delete" value='删除' onclick='deleteRoute(${id})'>
								<input type="button" class="btn-cancel layui-hide" value="取消" onclick='cancelSave("${name}")'>
								<input type="button" class="btn-save layui-hide" value='保存' onclick='update(${id})'>
								<div class="layui-clear"></div>
							</div>
						</form>
					</div>
				</div>
			`;

		
		var coord = L.latLng(feature.getBounds().getCenter());
		var arrPt = feature.getLatLngs();
		if(arrPt.length > 2) {
			coord = arrPt[Math.floor(arrPt.length / 2)];
		}
		L.popup().setContent(content).setLatLng(coord).openOn(map);
	};
	
	window.showWellImage = function(e) {
		e.stopPropagation();
		//取到物探编号
		var wtdh = $(e.target).attr('data');
		imgSrc = `${imageHref}${wtdh}.jpg`;
		var img = $(`<img src="${imgSrc}">`);
		img.css('height', '400px').css('width', '600px');
		$("#imgContainer").empty().append(img);

		layer.open({
			type: 1,
			title: false,
			closeBtn: true,
			area: ['600px', '400px'],
			skin: 'layui-layer-nobg', //没有背景色
			shadeClose: false,
			shade: 0,
			content: $('#imgContainer')
		});
	}

	window.showWellVideo = function(e) {
		e.stopPropagation();
		var video = 'test.mp4',
			videoSrc1 = `${videoSrc}${video}`;
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

	window.saveRoute = function(e) {
		var line = lineToWKT1(drawLayer);
		var name = $('#name').val();
		$.ajax({
			url: backUrl + 'checkLines/insert',
			type: 'post',
			data: {
				line: line,
				name: name
			},
			success: function(res) {
				initRoute();
				map.closePopup(popup);
				alert('保存成功')
			}
		});
	};
	window.cancelSave = function() {
		routeLayer.removeLayer(drawLayer);
		map.closePopup(popup);
	};
	window.cancelSave = function(text) {
		$('#editBtn').parent().next().children('.btn-delete').removeClass('layui-hide').next().addClass('layui-hide').next().addClass('layui-hide');
		$('#editBtn').removeClass('layui-hide').prev().attr('disabled', 'disabled').parents('form').prev().addClass('layui-hide');
		$('#name').val(text);

		routeLayer.removeLayer(drawLayer);
		map.closePopup(popup);
	};

	window.deleteRoute = function(routeId) {
		let state = 1;
		layer.confirm(
			'确认删除路线 [' + routeId + ']？', {
				title: '提示',
				btn: ['确认', '取消'] //按钮
			},
			function(index) {
				layer.close(index);
				$.ajax({
					url: backUrl + 'checkLines/del?checkLinesId=' + routeId,
					type: 'get',
					success: function(res) {
						if(res.count == 1) {
							initRoute();
							map.closePopup(popup)
						}
					}
				});
				if(state) {
					layer.msg('路线[' + routeId + ']删除成功！', {
						time: 1000
					});
				} else {
					layer.msg('路线[' + routeId + ']删除失败！', {
						time: 1000
					});
				}
			},
			function() {
				return true;
			});
	};

	window.updateRoute = function(routeId) {
		var name = $('#name').val();
		$.ajax({
			url: backUrl + 'checkLines/update?checkLinesId=' + routeId,
			type: 'post',
			data: {
				id: routeId,
				name: name
			},
			success: function(res) {
				alert('更新成功');
				$('#editBtn').parent().next().children('.btn-delete').removeClass('layui-hide').next().addClass('layui-hide').next().addClass('layui-hide');
				$('#editBtn').removeClass('layui-hide').prev().attr('disabled', 'disabled').parents('form').prev().addClass('layui-hide');
				$('#name').val(name);
				initRoute();
			}
		});
	};

	function lineToWKT(feature) {
		var latlngs = feature._latlngs;
		var wkt = 'LINESTRING(';
		latlngs.forEach(function(item) {
			wkt += item.lng + ' ' + item.lat + ','
		})
		wkt = wkt.substr(0, wkt.length - 1);
		wkt += ')';
		return wkt;
	};

	function lineToWKT1(feature) {
		console.log(feature);
		var latlngs = feature._latlngs;
		var path = '[';
		latlngs.forEach(function(item) {
			path += '[' + item.lat + ',' + item.lng + '],'
		})
		path = path.substr(0, path.length - 1);
		path += ']';
		return path;
	};

	function renderWKT(wktObj, wktpath, pathOptions) {
		wktObj.read(wktpath);
		var feature = wktObj.toObject();
		feature.setStyle(pathOptions);
		return feature;
	};

	function renderLine(path, pathOptions) {
		return poly;
	};
	exports('routeManage', {})
})