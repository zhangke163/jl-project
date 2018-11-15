layui.use(['form','layer','global','laydate'], function(){
  var form = layui.form,
  		$ = layui.$,
  		global = layui.global,
  		laydate = layui.laydate,
  		layer = layui.layer;

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
    // ,range: true
    // ,max: 0
  });
  
  $.get(global.ip.backUrl + 'checkPoint/get?origin=1&used=2', function(data) {
  	data.data.forEach( function(element, index) {
  		var html = `<option value="${element.id}">${element.location}</option>`;
  		$('#location').append(html);
  	});
  	form.render(null, 'search-form');
  })

  
  form.on('select(selectOn)', function(data){

  	// debugger
  	var typeId = data.value;

  	$.get(global.ip.backUrl + 'checkPoint/get?origin=1&id=' + typeId, function(data) {
  		var _type = data.data[0].type;

  		$.get(global.ip.backUrl + 'alarm/getAlarmTypeByCheckPointType?checkpointType=' + _type, function(data) {
  			
  			$('#alarmType').html(`<option value="">请选择报警类型</option>`);
  			data.data.forEach( function(element, index) {
  				var html = `<option value="${element.alarmType}">${element.alarmType}</option>`;
  				$('#alarmType').append(html);
  			});
  			form.render(null, 'search-form');
  		})
  	})
  });

  //监听提交
  form.on('submit(formDemo)', function(data){
    
		var recordTime = $('#test').val();

		var location = $('#location option:selected').val();

		var alarmType = $('#alarmType option:selected').val();

		var dataValue = $('#dataValue').val();

		var status_1 = $('#status option:selected').val();

		var remark = $('#remark').val();

		$.post(global.ip.backUrl + "alarm/create",
    {
      alarmType: alarmType,
      status: status_1,
      dataValue: dataValue,
      checkPointId: location,
      alarmTime: recordTime,
      remark: remark
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