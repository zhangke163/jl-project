layui.define(function(exports) {
	layui.use(['layer', 'nicescroll', 'maputil', 'global'], function() {
		var $ = layui.$,
			layer = layui.layer,
			nicescroll = layui.nicescroll,
			maputil = layui.maputil,
			global = layui.global;
		maputil.initGlobal();

		function listScroll() {
			$('.list-body').getNiceScroll().hide();
			$('.list-body').getNiceScroll().show();
			$(".list-body").getNiceScroll().resize();
			$('.list-body').niceScroll({
				cursorcolor: "#BDBDBD", //滚动条的颜色
				cursoropacitymax: 1, //滚动条的透明度，从0-1
				touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
				cursorwidth: "5px", //滚动条的宽度
				cursorborder: "0", // 游标边框css定义
				cursorborderradius: "6px", //以像素为光标边界半径  圆角
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

		var list_length, data_length;
		if(window.localStorage) {
			// alert("浏览器支持localstorage");
			var storage = window.localStorage;
		}

		// function newAlarm() {
		// 	list_length = $('.record-list').length;
		// 	$.get('http://47.101.159.182:8080/jhzhps-back/alarm/getNewAlarm?origin=1', function(data) {
		// 		data_length = data.count;

		// 	  if (data_length > list_length) {
		// 	  	layer.open({
		// 	      type: 1,
		// 	      title: '提示',
		// 	      id:'alarm_list_pop',
		// 	      area: ['300px', 'auto'],
		// 	      resize: false,
		// 	      skin: 'demo-class',
		// 	      content: '有新的报警！<br/>请在右侧悬浮窗查看'
		// 	    });
		// 	  }
		// 	})
		// }

		function refreshState() {
			maputil.getCurrentState(yld);
			maputil.getCurrentState(shuizhi);
			maputil.getCurrentState(liuliang);

			maputil.getCurrentData([yld, shuizhi, liuliang]);
		}

		function getAlarmList() {

			if(storage["_count"] == undefined) {
				storage["_count"] = 0;
			}
			list_length = storage["_count"];
			$.get(global.ip.backUrl + 'alarm/getNewAlarm?origin=1', function(data) {
				if(data.data != null && data.data != '') {
					$('.red-tip').html(data.count);
					$('.list-body').html('');
					data_length = data.count;
					var _href = window.location.hash;
					if(_href == '#/pipe/threeDimensional') {
						if(data_length > list_length) {
							layer.open({
								type: 1,
								title: '提示',
								id: 'alarm_list_pop',
								offset: '5px',
								area: ['300px', 'auto'],
								resize: false,
								skin: 'demo-class',
								content: '有新的报警！请在右侧悬浮窗查看'
							});
						}
					} else {
						if(data_length > list_length) {
							layer.open({
								type: 1,
								title: '提示',
								id: 'alarm_list_pop',
								area: ['300px', 'auto'],
								resize: false,
								skin: 'demo-class',
								content: '有新的报警！<br/>请在右侧悬浮窗查看'
							});
						}
					}
					data.data.forEach(function(element, index) {
						var alarmTime = element.alarmTime;
						var unit = element.unit;
						if(unit == 'm3/s') {
							unit = 'm³/s';
						} else if(unit == null) {
							unit = '';
						}
						var list_html = `<div class="record-list">
				                      <input type="text" value="${element.alarmId}" style="display: none;">
				                      <div class="record-top">
				                        <div class="order-list-num layui-circle">${index + 1}</div>
				                        <div class="order-list-name">${element.location}</div>
				                        <div class="layui-clear"></div>
				                      </div>
				                      <div class="order-bottom">
				                        <div class="order-list-info">
				                          <span class="list-info-name">${element.alarmType}:</span>
				                          <span class="list-info-unit">${element.dataValue}<span>${unit}</span></span>
				                        </div>
				                        <div class="order-list-time">${alarmTime.substring(5, 16)}</div>
				                        <div class="layui-clear"></div>
				                      </div>
				                    </div>`
						$('.list-body').append(list_html);
					})
					//写入数据
					storage.setItem("_count", $('.record-list').length);
				} else {
					$('.red-tip').html('0');
					$('.list-body').html('');
				}
			})
		}

		getAlarmList();

		var win_timer = setInterval(function() {
			getAlarmList();
		}, 1000 * 60 * 5)

		$('#tip').mouseenter(function(event) {
			event.preventDefault();
			$('.alarm-list').stop(true, true).fadeIn(200);
			listScroll();
		});

		$('#tip').mouseleave(function(event) {
			event.preventDefault();
			$('.alarm-list').stop(true, true).fadeOut(200);
		});

		$(document).on('click', '.record-list', function(event) {
			event.preventDefault();
			clearInterval(win_timer);
			var alarmId = $(this).find('input').val();
			layer.open({
				type: 2,
				area: ['400px', '400px'],
				fix: false,
				resize: false,
				shade: 0.4,
				maxmin: false,
				// closeBtn: 0,
				title: '报警信息',
				content: layui.setter.base + 'views/pop/check.html?alarmId=' + alarmId,
				success: function(layero, index) {
					var body = layer.getChildFrame('body', index);
				},
				end: function() {
					//应该给一个刷新一张图页面图标的方法调用
					refreshState();
					getAlarmList();
					win_timer = setInterval(function() {
						// newAlarm();
						getAlarmList();
					}, 1000 * 60 * 5)
				}
			});
		});
	});

	exports('addAlarmList', {})
})