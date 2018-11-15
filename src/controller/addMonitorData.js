layui.use(['form','layer','global','laydate'], function(){
  var form = layui.form,
  		$ = layui.$,
  		global = layui.global,
  		layer = layui.layer,
  		laydate = layui.laydate;

  form.render(null, 'search-form');

  $('.cancle').click(function(event) {
  	//当你在iframe页面关闭自身时
  	var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
  	parent.layer.close(index); //再执行关闭
  });

  //执行一个laydate实例
  laydate.render({
    elem: '#test' //指定元素
    ,type: 'datetime'
  });

	//截取地址栏中url的参数值
	function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
      return unescape(r[2]);
    return null;
	}
	var popupId = getQueryString("id");

	var option_html_1 = '<option value="">请选择数据类型</option>'
										+ '<option value="水位">水位</option>';

	var option_html_2 = '<option value="">请选择数据类型</option>'
										+ '<option value="COD">COD</option>'
										+ '<option value="PH">PH</option>'
										+ '<option value="氨氮">氨氮</option>'
										+ '<option value="总氮">总氮</option>'
										+ '<option value="总磷">总磷</option>';
							        
	var option_html_3 = '<option value="">请选择数据类型</option>'
					        	+ '<option value="流量">流量</option>';

	var dataType = $('#dataType');

	if (popupId == 'flood') {
		$.get(global.ip.backUrl + 'checkPoint/get?type=1', function(data) {
			data.data.forEach( function(element, index) {
				var html = '<option value="' + element.id + '">' + element.location + '</option>';
				$('#location').append(html);
			});
			form.render(null, 'search-form');
		})

		dataType.html('');
		dataType.append(option_html_1);

	} else if (popupId == 'water') {
		$.get(global.ip.backUrl + 'checkPoint/get?type=2', function(data) {
			data.data.forEach( function(element, index) {
				var html = '<option value="' + element.id + '">' + element.location + '</option>';
				$('#location').append(html);
			});
			form.render(null, 'search-form');
		})

		dataType.html('');
		dataType.append(option_html_2);

	} else {
		$.get(global.ip.backUrl + 'checkPoint/get?type=3', function(data) {
			data.data.forEach( function(element, index) {
				var html = '<option value="' + element.id + '">' + element.location + '</option>';
				$('#location').append(html);
			});
			form.render(null, 'search-form');
		})

		dataType.html('');
		dataType.append(option_html_3);

	}

  //监听提交
  form.on('submit(formDemo)', function(data){
  	var recordTime = $('#test').val();

  	var location = $('#location option:selected').val();

  	var dataType = $('#dataType option:selected').val();

  	var dataValue = $('#dataValue').val();

		$.post(global.ip.backUrl + "checkPointData/create",
    {
      checkPointId: location,
      dataType: dataType,
      dataValue: dataValue,
      recordTime: recordTime
    },
    function(data,status){
      console.log(status)
    });

  	//当你在iframe页面关闭自身时
		var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		parent.layer.close(index); //再执行关闭

    return false;
  });
});