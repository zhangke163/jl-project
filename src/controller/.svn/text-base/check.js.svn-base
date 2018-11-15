layui.use(['layer','global'], function() {
	var layer = layui.layer,
			$ = layui.$,
			global = layui.global;

	//截取地址栏中url的参数值
	function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
      return unescape(r[2]);
    return null;
	}
	var popupId = getQueryString("id");

	if (popupId) {
		$.get(global.ip.backUrl + '/alarm/getById?alarmId=' + popupId, function(data) {
			$('#location').html(data.data.location);
			$('#alarmTime').html(data.data.alarmTime);

			var alarmLevel = data.data.alarmLevel;

			var info_data = $('#info_data');
			if (alarmLevel == '预警') {
				info_data.removeClass('alarm').addClass('early-warning');
			} else {
				info_data.removeClass('early-warning').addClass('alarm');
			}

			var unit = data.data.unit;
			if (unit == 'm3/s') {
				unit = 'm³/s';
			} else if (unit == null) {
				unit = '';
			}

			var info_data_html = '<div class="alarm-info-box">' +
															'<div class="type-name">'+ data.data.alarmType + '</div>' +
															'<div class="type-value">' + data.data.dataValue + '<span class="unit">' + unit + '</span></div>' +
														'</div>';
			info_data.append(info_data_html);

			if (data.data.status == '处理中') {
				$('#status1').addClass('active').siblings().removeClass('active');
			} else if (data.data.status == '已处理') {
				$('#status2').addClass('active').siblings().removeClass('active');
			} else {
				$('#status3').addClass('active').siblings().removeClass('active');
			}

			$('#remark').val(data.data.remark);
		});

		$('.yes').click(function(event) {
			var status = $('.status-info > div.active').html();
			var remark = $('#remark').val();
			var alarmId = popupId;

			$.post(global.ip.backUrl + "alarm/update",
	    {
	      alarmId: alarmId,
	      status: status,
	      remark: remark
	    },
	    function(data,status){
	      console.log(status)
	    });

			//当你在iframe页面关闭自身时
			var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
			parent.layer.close(index); //再执行关闭
		});
	} else {
		var alarmId = getQueryString("alarmId");
		$.get(global.ip.backUrl + 'alarm/getById?alarmId=' + alarmId, function(data) {
			$('#location').html(data.data.location);
			$('#alarmTime').html(data.data.alarmTime);

			var _id = data.data.alarmId;

			var alarmLevel = data.data.alarmLevel;

			var info_data = $('#info_data');
			if (alarmLevel == '预警') {
			  info_data.removeClass('alarm').addClass('early-warning');
			} else {
			  info_data.removeClass('early-warning').addClass('alarm');
			}

			var unit = data.data.unit;
			if (unit == 'm3/s') {
				unit = 'm³/s';
			} else if (unit == null) {
				unit = '';
			}

			var info_data_html = '<div class="alarm-info-box">' +
			                        '<div class="type-name">'+ data.data.alarmType + '</div>' +
			                        '<div class="type-value">' + data.data.dataValue + '<span class="unit">' + unit + '</span></div>' +
			                      '</div>';
			info_data.append(info_data_html);

			if (data.data.status == '处理中') {
			  $('#status1').addClass('active').siblings().removeClass('active');
			} else if (data.data.status == '已处理') {
			  $('#status2').addClass('active').siblings().removeClass('active');
			} else {
			  $('#status3').addClass('active').siblings().removeClass('active');
			}

			$('#remark').val(data.data.remark);

			$('.yes').click(function(event) {
			  var status = $('.status-info > div.active').html();
			  var remark = $('#remark').val();

			  $.post(global.ip.backUrl + "alarm/update",
			  {
			    alarmId: _id,
			    status: status,
			    remark: remark
			  },
			  function(data,status){
			    console.log(status)
			  });

			  //当你在iframe页面关闭自身时
			  var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
			  parent.layer.close(index); //再执行关闭
			});
		})
	}

	$('.cancle').click(function(event) {
		//当你在iframe页面关闭自身时
		var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		parent.layer.close(index); //再执行关闭
	});

	$('.status-btn').click(function(event) {
		$(this).addClass('active').siblings().removeClass('active');
	});
})