layui.use(['layer', 'form', 'global'], function() {
	var $ = layui.$,
		layer = layui.layer,
		form = layui.form,
		global = layui.global;
	//地图变量
	var popup = null;
	var featureLayer = new L.featureGroup();
	var pathOptions = {
		color: '#F00',
		weight: 2,
		opacity: 1,
		clickable: true
	};

	$.ajaxSetup({
		cache: false
	});
	//滚动条
	function scroll(dom) {
		dom.niceScroll({
			cursorcolor: "#ccc", //滚动条的颜色
			cursoropacitymax: 1, //滚动条的透明度，从0-1
			touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
			cursorwidth: "5px", //滚动条的宽度
			cursorborder: "0", // 游标边框css定义
			cursorborderradius: "5px", //以像素为光标边界半径  圆角
			//autohidemode最好设置为true，这样切换的时候会自动隐藏滚动条
			autohidemode: true, //是否隐藏滚动条  true的时候默认不显示滚动条，当鼠标经过的时候显示滚动条
			zindex: "auto", //给滚动条设置z-index值
			railpadding: {
				top: 0,
				right: 0,
				left: 0,
				bottom: 0
			} //滚动条的位置
		});
	}
	scroll($('#img-left-box'));
	scroll($('.sh-advice'));
	scroll($('#right-box'));
	//		判断是否为null
	function nullChange(indexs) {
		if(indexs === "Null" || indexs === '' || indexs === null) {
			indexs = '无';
		}
		return indexs;
	}
	/*传参*/
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null)
			return unescape(r[2]);
		return null;
	}
	//获取当前点击行的id
	var taskId = GetQueryString('id');
	//获取请求头的token
	var token = $.parseJSON(localStorage.layuiAdmin).access_token;
	initMap();
	//获取任务养护前的基本信息
	$.ajax({
		url: global.ip.backUrl + 'task/getById',
		type: 'GET',
		data: {
			'taskId': taskId
		},
		dataType: 'json',
		success: function(data) {
			//这里获取到数据执行显示
			$('.one-top-left span').html(data.data[0].taskId);
			$('.one-top-right').html(data.data[0].reportTime);
			if(data.data[0].type === 1) {
				$('.two-top-left span').html('管线养护');
			} else if(data.data[0].type === 2) {
				$('.two-top-left span').html('道路养护');
			} else {
				$('.two-top-left span').html('其他');
			}
			var status = data.data[0].status;
			if(status === 1) {
				$('.two-top-right').html('新任务');
			} else if(status === 2) {
				$('.two-top-right').html('处理中');
			}else if(status === 3) {
				$('.two-top-right').html('养护完成');
			}else if(status === 4) {
				$('.two-top-right').html('监理核查中');
			}else if(status === 5) {
				$('.two-top-right').html('监理审核通过');
			}else if(status === 6) {
				$('.two-top-right').html('监理审核不通过');
			}else if(status === 7) {
				$('.two-top-right').html('科室审核通过');
			}else{
				$('.two-top-right').html('科室审核不通过');
			}
			data.data[0].detail = nullChange(data.data[0].detail);
			$('.three-top span').html(data.data[0].detail);
			$(".three-top span").attr("title", data.data[0].detail);
			$('.four-top-left span').html(data.data[0].userName);
			$('.four-top-right span').html(data.data[0].mobile);
			if(data.data[0].siteType == '1') {
				$('.map-location-box b').html('地点');
			} else if(data.data[0].siteType == '2') {
				$('.map-location-box b').html('路线');
			}
			$('.map-location-box span').html(data.data[0].siteName);
			//处理后台传入的养护前图片
			if(data.data[0].beforePicUrl !== null) {
				var beforeImgUrl = data.data[0].beforePicUrl;
				if(beforeImgUrl !== null) {
					var arrBeforeImg = beforeImgUrl.split(",");
				}
				var baseImgUrl = global.ip.baseImgUrl; //测试服务器端口
				var locationUrl = window.location.host;
				var testUrl = locationUrl == baseImgUrl ? locationUrl : baseImgUrl;
				// //循环图片展示
				var beforeImgs = ``;
				$.each(arrBeforeImg, function(index, value) {
					var bImg = testUrl + 'jhzhpsPic/' + value;
					beforeImgs += `<div class="detail-img left">
												<img data-original="${bImg}" src="${bImg}">
											</div>`;

					checkPicurl(bImg);
				});
				$('#img-left-box').empty().append(beforeImgs);
				$("#img-left-box").viewer('update');
			} else {
				var imgs = `<img src='../../style/res/no-before.png'  style='margin-top:25px;margin-left:25px;'/>`;
				$('#img-left-box').append(imgs);
			}
			//获取地图数据
			showData(data.data[0].siteType, data.data[0].siteId);
		},
		error: function(data) {
			console.log('失败');
		}
	});
	//判断图片宽高比
	function checkPicurl(url) {
		var img = new Image();
		img.src = url;
		img.onerror = function() {
			alert(name + " 图片加载失败，请检查url是否正确");
			return false;
		};
		if(img.complete) {
			if(img.width < img.height) {
				$('.detail-img img').css('width', '70px');
			} else {
				$('.detail-img img').css('height', '70px');
			}
		} else {
			img.onload = function() {
				if(img.width < img.height) {
					$('.detail-img img').css('width', '70px');
				} else {
					$('.detail-img img').css('height', '70px');
				}
				img.onload = null; //避免重复加载
			}
		}
	}
	//获取养护后信息
	$.ajax({ //获取请求头的所有信息
		url: global.ip.backUrl + 'user/checkLoginInfo',
		type: 'GET',
		data: {
			'access_token': token
		},
		dataType: 'json',
		success: function(data) {
			var username = data.data.username;
			var mobile = data.data.mobile;

			$.ajax({ //获取右侧栏的所有信息
				url: global.ip.backUrl + 'task/record/queryByTaskId',
				type: 'GET',
				data: {
					'taskId': taskId
				},
				dataType: 'json',
				success: function(data) {
					if(data.data.length == 0) {
						var emptyHtml = `<div class="yh-info" >
															<div class="title-box">	
																<div class="line-box"></div>
																<b>养护信息</b>
															</div>
															<div class="img-box" style='height:180px;text-align:center;'>
																<img src="../../style/res/no-yh.png">
															</div>
														</div>
														<div class="sh-info">
															<div class="title-box">	
																<div class="line-box"></div>
																<b>审核意见</b>
															</div>
															<div class="sh-detail" style='height:180px;text-align:center;margin-top:22px;'>
																<img src="../../style/res/no-record.png">
															</div>
														</div>`;
						$('#right-box').append(emptyHtml);
					} else {
						//这里获取到数据执行显示
						$.each(data.data, function(index, value) {
							if(value.type == 1) { //养护信息
								var yhHtml = `
									<div class="sh-info">
										<div class="title-box">
											<div class="line-box"></div>
											<b>养护信息</b>
										</div>
										<div class="sh-detail">
											<div class="yhms-box">
												<div class="flod-box">
													<div class="flod-title left">养护描述</div>
													<div class="flod-cons right">${(value.detail===null)?'暂无相关描述':value.detail}</div>
												</div>
												<div class="flod-box img-box">
													<div class="flod-title left">照片信息</div>
													<div class="flod-cons right" id='yh-img-info'>
													</div>
												</div>
												<div class="bot-cons">
													<div class="left">养护员:<span>${(value.userName===null)?'暂无养护员信息':value.userName}</span></div>
													<div class="bot-tel left">联系电话:<span>${(value.mobile===null)?'暂无电话信息':value.mobile}</span></div>
													<div class="bot-date right">${value.recordTime}</div>
												</div>
											</div>
										</div>
									</div>
									`;
								$('#right-box').append(yhHtml);
								//									图片显示
								var afterPicUrl = value.afterPicUrl;
								if(afterPicUrl !== null) {
									var arrAfterImg = afterPicUrl.split(",");
									var baseImgUrl = global.ip.baseImgUrl; //测试服务器端口
									var locationUrl = window.location.host;
									var testUrl = locationUrl == baseImgUrl ? locationUrl : baseImgUrl;
									// //循环图片展示
									$.each(arrAfterImg, function(index, value) {
										var bImg = testUrl + 'jhzhpsPic/' + value;
										console.log(bImg);
										var afterImgs = `<img src="${bImg}" alt="" />`;
										$('#yh-img-info').append(afterImgs);
										$("#yh-img-info").viewer('update');
										checkPicurl(bImg);
									});
									scroll($('#yh-img-info'));
								} else {
									var tipsHtml = `<span style='padding-left:5px;'>暂无相关照片</span>`;
									$('#yh-img-info').html(tipsHtml);
								}
							} else if(value.type == 2) { //科室审核
								var ksHtml = `
										<div class="sh-info">
											<div class="title-box">
												<div class="line-box"></div>
												<b>科室审核</b>
											</div>
											<div class="sh-detail">
												<div class="yhms-box">
													<div class="flod-box">
														<div class="flod-title left">审核结果</div>
														<div class="flod-cons right">${(value.status==='1')?'审核通过':'审核不通过'}</div>
													</div>
													<div class="flod-box">
														<div class="flod-title left">审核意见</div>
														<div class="flod-cons right">${value.detail}</div>
													</div>
													<div class="bot-cons">
														<div class="left">养护员:<span>${(value.userName===null)?'暂无养护员信息':value.userName}</span></div>
														<div class="bot-tel left">联系电话:<span>${(value.mobile===null)?'暂无电话信息':value.mobile}</span></div>
														<div class="bot-date right">${value.recordTime}</div>
													</div>
												</div>
											</div>
										</div>
										`;
								$('#right-box').append(ksHtml);

							} else { //监理核查
								var jlHtml = `
										<div class="sh-info">
											<div class="title-box">
												<div class="line-box"></div>
												<b>监理核查</b>
											</div>
											<div class="sh-detail">
												<div class="yhms-box">
													<div class="flod-box">
														<div class="flod-title left">监理结果</div>
														<div class="flod-cons right">${(value.status==='1')?'审核通过':'审核不通过'}</div>
													</div>
													<div class="flod-box">
														<div class="flod-title left">施工评价</div>
														<div class="flod-cons right">${(value.detail===null)?'暂无施工评价':value.detail}</div>
													</div>
													<div class="flod-box">
														<div class="flod-title left">工程量</div>
														<div class="flod-cons right">${(value.quantity===null)?'暂无工程量信息':value.quantity}</div>
													</div>
													<div class="flod-box img-box">
														<div class="flod-title left">照片信息</div>
														<div class="flod-cons right" id="jl-img-info">
														</div>
													</div>
													<div class="bot-cons">
														<div class="left">养护员:<span>${(value.userName===null)?'暂无养护员信息':value.userName}</span></div>
														<div class="bot-tel left">联系电话:<span>${(value.mobile===null)?'暂无电话信息':value.mobile}</span></div>
														<div class="bot-date right">${value.recordTime}</div>
													</div>
												</div>
											</div>
										</div>
										`;
								$('#right-box').append(jlHtml);
								//									图片显示
								var afterPicUrl = value.afterPicUrl;
								if(afterPicUrl !== null) {
									var arrAfterImg = afterPicUrl.split(",");
									var baseImgUrl = global.ip.baseImgUrl; //测试服务器端口
									var locationUrl = window.location.host;
									var testUrl = locationUrl == baseImgUrl ? locationUrl : baseImgUrl;
									// //循环图片展示
									$.each(arrAfterImg, function(index, value) {
										var bImg = testUrl + 'jhzhpsPic/' + value;
										console.log(bImg);
										var afterImgs = `<img src="${bImg}" alt="" />`;
										$('#jl-img-info').append(afterImgs);
										$("#jl-img-info").viewer('update');
										checkPicurl(bImg);
									});
									scroll($('#jl-img-info'));
								} else {
									var tipsHtml = `<span style='padding-left:5px;'>暂无相关照片</span>`;
									$('#jl-img-info').html(tipsHtml);
								}
							}
						})
					}
					var moreimgs = `<img src='../../style/res/moreimg.png' style='margin-top:5px;'/>`;
					$('#right-box').append(moreimgs);

				},
				error: function(data) {
					//console.log('失败');
				}
			});

		},
		error: function(data) {
			//console.log('失败');
		}
	});
	form.on('submit(sh-form)', function(data) {
		shForm();
		return false;
	});

	function shForm() {
		var shVal = $('#sh-val option:selected');
		var shAdv = $('#sh-adv').val();
		$.ajax({
			url: global.ip.backUrl + 'task/checkById',
			type: 'POST',
			data: {
				'taskId': taskId,
				'status': shVal.val(),
				'detail': shAdv
			},
			dataType: 'json',
			success: function(data) {
				//这里获取到数据执行显示
				console.log(shVal.val());
				if(shVal.val() == 7) {
					layer.msg('审核通过！', {
						icon: 1,
						time: 2000 //2秒关闭（如果不配置，默认是3秒）
					}, function() {
						var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
						parent.layer.close(index); //再执行关闭   
					})
				} else if(shVal.val() == 8) {
					layer.msg('已标记为不通过！', {
						icon: 5,
						time: 2000 //2秒关闭（如果不配置，默认是3秒）
					}, function() {
						var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
						parent.layer.close(index); //再执行关闭   
					});
				}

			},
			error: function(data) {

			}
		});
		parent.layui.table.reload('test');
		parent.layui.table.reload('data_table');
	}

	function initMap() {
		map = null;
		//地图服务
		var normalmUrl = global.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/JHJT/MapServer';
		var normalaUrl = global.ip.arcServerUrl + 'arcgis/rest/services/jhzhps/JHJTBZ/MapServer';
		normalm = L.esri.tiledMapLayer({
			url: normalmUrl,
			maxZoom: 20
		});
		normala = L.esri.tiledMapLayer({
			url: normalaUrl,
			maxZoom: 20
		});
		vector = L.layerGroup([normalm, normala]);
		//金华切片服务	
		var crs = new L.Proj.CRS("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs", {
			resolutions: [
				1.40625,
				0.703125,
				0.3515625,
				0.17578125,
				0.087890625,
				0.0439453125,
				0.02197265625,
				0.010986328125,
				0.0054931640625,
				0.00274658203125,
				0.001373291015625,
				6.866455078125E-4,
				3.4332275390625E-4,
				1.71661376953125E-4,
				8.58306884765625E-5,
				4.291534423828125E-5,
				2.1457672119140625E-5,
				1.0728836059570312E-5,
				5.364418029785156E-6,
				2.682209064925356E-6,
				1.3411045324626732E-6
			],
			origin: [-179.9999, 90.00016],
			bounds: L.bounds([117.75370429660006, 26.99449191557761, ], [123.63262097540007, 32.2668788575695])
		})
		map = L.map('mapcontainer', {
			crs: crs,
			zoomControl: false,
			attributionControl: false,
			doubleClickZoom: false,
			boxZoom: true,
			dragging: true,
			minZoom: 12,
			maxZoom: 20,
			//maxBounds: bounds,
			layers: [featureLayer]
		}).setView([29.08948, 119.65279], 13);
		map.addLayer(vector);
	}

	function exuteAjax(dataUrl, id) {
		var res = null;
		$.ajax({
			url: dataUrl,
			async: false,
			data: {
				id: id
			},
			success: function(result) {
				var total = result.count; //记录总数
				totalLeft = total;
				if(total) {
					res = result;
				}
			}
		});
		return res;
	}

	function showData(type, targetID) {
		featureLayer.clearLayers();
		map.closePopup(popup);
		if(type == 2) { //线路
			console.log("路线" + targetID)
			var result = exuteAjax(global.ip.backUrl + 'checkLines/getList', targetID);
			if(result && result.count > 0) {
				var item = result.data[0];
				let path = item.line;
				let name = item.name;
				let id = item.id;
				var feature = L.polyline(eval("(" + path + ")"), pathOptions).on('click', function(e) {
					var content = `<div> ${name}  #${id} </div>`;
					L.popup().setContent(content).setLatLng(e.latlng).openOn(map)
				}).addTo(featureLayer);
				map.fitBounds(feature.getBounds());
			}
		} else if(type == 1) { //地点
			console.log("地点" + targetID)
			var result = exuteAjax(global.ip.backUrl + 'location/getList', targetID);
			if(result && result.count > 0) {
				var item = result.data[0];
				let lat = item.latitude,
					lng = item.longitude;
				L.marker([lat, lng], {
					name: item.name,
					id: item.id
				}).on('click', function(e) {
					var content = `<div> ${item.name}  #${ item.id} </div>`
					L.popup().setContent(content).setLatLng(e.latlng).openOn(map)
				}).addTo(featureLayer);
				map.setView(L.latLng(lat, lng), 13);
			}
		}
	}

})