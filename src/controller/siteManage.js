layui.define([
	'admin',
	'layer',
	'html5shiv',
	'maputil',
	'wicket',
	'wicket-leaflet',
	'laypage',
	'customUtil'
], function(exports) {
	var $ = layui.jquery,
		laypage = layui.laypage,
		layer = layui.layer,
		maputil = layui.maputil,
		customUtil = layui.customUtil;
	var drawLayer = null;
	var popup = null;
	var siteLayer = new L.featureGroup();
	var pageInit = customUtil.pageInit;
	$(function() {
		initWindow();
		maputil.initGlobal();
		initMap();
		maputil.initMapControl();
		//maputil.initMapEvent();
		initMapControl();
		initPoint();
	})

	$('#querySite').on('click', function() {
		var name = $.trim($(".searchInput")[0].value);
		let dataUrl = `${backUrl}location/getList?name=${name}`;
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
					$("#siteResult").empty().html(data);
					if(total > 10) {
						//初始化一个分页控件
						pageInit(total, 4, 1, 'demo3', dataUrl, $("#siteResult"), getTable);
						$('#demo3').css('display', 'block');
					} else {
						$('#demo3').css("display", "none");
					}
				} else {
					$("#siteResult").empty();
				}
			}
		});
	}

	function initPoint() {
		siteLayer.clearLayers();
		$.ajax({
			url: backUrl + 'location/getList.json?limit=-1',
			success: function(res) {
				var data = res.data || [];
				if(data.length > 0) {
					data.forEach(function(item) {
						var lat = item.latitude,
							lng = item.longitude;
						var temp = L.marker([lat, lng], {
							name: item.name,
							id: item.id
						}).addTo(siteLayer);
					})
				}
			}
		});
		excuteAjax(`${backUrl}location/getList.json`);
	}

	function initWindow() {
		$('#siteMap').height($(window).height() - 219);
		$('#site_left').height($(window).height() - 219);
		// 监听浏览器窗口发生变化时，动态调整div的尺寸
		$(window).resize(function() {
			$('#siteMap').height($(window).height() - 219);
			$('#site_left').height($(window).height() - 219);
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
		// debugger
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
		map.addLayer(siteLayer);
	}

	function initMapControl() {
		if(!drawControl) {
			var drawControl = new L.Control.Draw({
				position: 'topleft',
				draw: {
					polyline: false,
					polygon: false,
					circle: false,
					marker: true,
					rectangle: false
				},
				edit: {
					featureGroup: siteLayer,
					edit: false,
					remove: false
				}
			});
		}

		map.addControl(drawControl);

		map.on('draw:created', function(e) {
			// debugger
			shapeType = e.layerType;
			drawLayer = e.layer;
			siteLayer.addLayer(drawLayer);

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
								<input type="button" class="btn-save" value='保存' onclick='save()'>
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
			}).setContent(content).setLatLng(drawLayer._latlng).openOn(map)
			maputil.initMapEvent();
		});

		siteLayer.on('click', function(e) {
			console.log(e);
			var content = `
				<div>
					<div class="popupContent">
						<p class="addAddress-p layui-hide">请输入地点名称</p>
						<form>
							<div class="addAddress-box">
								<input type="text" id="name" class="addAddress" value="${e.layer.options['name']}" disabled="disabled">
								<i id="editBtn"><img src="../src//style/res/edit_1.png" class="editBtn"></i>
							</div>							
							<div>
								<input type="button" class="btn-delete" value='删除' onclick='deleteLocation(${e.layer.options['id']})'>
								<input type="button" class="btn-cancel layui-hide" value="取消" onclick='cancelSave("${e.layer.options['name']}")'>
								<input type="button" class="btn-save layui-hide" value='保存' onclick='update(${e.layer.options['id']})'>
								<div class="layui-clear"></div>
							</div>
						</form>
					</div>
				</div>
			`;
			L.popup({
				offset: L.point(10,  10),
			}).setContent(content).setLatLng(e.latlng).openOn(map);
		})

		map.on('draw:drawstart', function(e) {
			map.off('click');
		});

		$(document).on('click', '#editBtn', function() {
			var _this = $(this);
			_this.addClass('layui-hide').prev().removeAttr('disabled').parents('form').prev().removeClass('layui-hide');
			_this.parent().next().children('.btn-delete').addClass('layui-hide').next().removeClass('layui-hide').next().removeClass('layui-hide');
		});
	}
	
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
	

	function getTable(result, pageIndex, pageSize) {
		var data = "";
		if(result != "" && result != null) {
			//获取json数据			
			$.each(result.data, function(idx, item) {
				let orderNum = (pageIndex - 1) * pageSize + idx + 1;
				let name = item.name;
				let latitude = item.latitude;
				let longitude = item.longitude;
				let id = item.id;
				data += `<div class="site-item" data="${id}" onclick="zoomTo('${latitude}','${longitude}','${name}','${id}')">
										<div class="item-left">
											<span>${orderNum}</span>
										</div>
										<div class="item-right">
											<div class="site-name">地点: ${name}</div>
											<div class="site-id">ID: ${id}</div>
										</div>
										<div class="layui-clear"></div>
									</div>`;
			});
		}
		data = data === "" ? "<div class='nolist'>暂无数据</div>" : data;
		return data;
	}

	window.zoomTo = function(lat, lon, name, id) {
		map.setView(L.latLng(lat, lon), 16);
		var content = `
				<div>
					<div class="popupContent">
						<p class="addAddress-p layui-hide">请输入地点名称</p>
						<form>
							<div class="addAddress-box">
								<input type="text" id="name" class="addAddress" value="${name}" disabled="disabled">
								<i id="editBtn"><img src="../src//style/res/edit_1.png" class="editBtn"></i>
							</div>							
							<div>
								<input type="button" class="btn-delete" value='删除' onclick='deleteLocation(${id})'>
								<input type="button" class="btn-cancel layui-hide" value="取消" onclick='cancelSave("${name}")'>
								<input type="button" class="btn-save layui-hide" value='保存' onclick='update(${id})'>
								<div class="layui-clear"></div>
							</div>
						</form>
					</div>
				</div>
			`;
		L.popup().setContent(content).setLatLng(L.latLng(lat, lon)).openOn(map);
	}

	window.save = () => {
		var latlng = drawLayer._latlng;
		var wkt = `POINT(${latlng.lng} ${latlng.lat})`;
		var name = $('#name').val();
		$.ajax({
			url: backUrl + 'location/insert',
			type: 'post',
			data: {
				name: name,
				longitude: latlng.lng,
				latitude: latlng.lat
			},
			success: function(res) {
				initPoint();
				map.closePopup(popup);
				alert('ok')
			}
		});
	}

	window.update = (index) => {
		var name = $('#name').val();
		$.ajax({
			url: backUrl + 'location/update',
			type: 'post',
			data: {
				id: index,
				name: name
			},
			success: function(res) {
				$('#editBtn').parent().next().children('.btn-delete').removeClass('layui-hide').next().addClass('layui-hide').next().addClass('layui-hide');
				$('#editBtn').removeClass('layui-hide').prev().attr('disabled', 'disabled').parents('form').prev().addClass('layui-hide');
				$('#name').val(name);
				initPoint();
				alert('ok');
			}
		});
	}

	window.cancelSave = function() {
		siteLayer.removeLayer(drawLayer);
		map.closePopup(popup);
	}

	window.cancelSave = function(text) {
		$('#editBtn').parent().next().children('.btn-delete').removeClass('layui-hide').next().addClass('layui-hide').next().addClass('layui-hide');
		$('#editBtn').removeClass('layui-hide').prev().attr('disabled', 'disabled').parents('form').prev().addClass('layui-hide');
		$('#name').val(text);
		siteLayer.removeLayer(drawLayer);
		map.closePopup(popup);
	}

	window.deleteLocation = function(locationId) {
		let state = 1;
		layer.confirm(
			'确认删除地点 [' + locationId + ']？', {
				title: '提示',
				btn: ['确认', '取消'] //按钮
			},
			function(index) {
				layer.close(index);
				$.ajax({
					url: backUrl + 'location/del?locationId=' + locationId,
					type: 'get',
					success: function(res) {
						if(res.count == 1) {
							initPoint();
							map.closePopup(popup);
							state = 1;
						} else {
							state = 0;
						}
					}
				});
				if(state) {
					layer.msg('地点[' + locationId + ']删除成功！');
				} else {
					layer.msg('地点[' + locationId + ']删除失败！');
				}
			},
			function() {
				return true;
			});
	}

	exports('siteManage', {})
})