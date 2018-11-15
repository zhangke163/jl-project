layui.define(function(exports) {
	layui.use(['echarts','global'], function() {
		var $ = layui.$,
				echarts = layui.echarts,global = layui.global;

		function checkTime(time) {//校验时间,小于10前面加0
		    if(time < 10)return "0" + time;
		    return time;
		}

		function checkTime(time) {//校验时间,小于10前面加0
		    if(time < 10)return "0" + time;
		    return time;
		}

		//当从其他页面跳转到此页面时，清除已存在定时器timer
		if(window.timer) {
			window.clearInterval(window.timer)
		}

		window.timer = setInterval(function() {
			var date = new Date();
			//显示时分秒
	    $("#time").html(checkTime(date.getHours()) + ":" + checkTime(date.getMinutes()) + ":" +checkTime(date.getSeconds()));
		}, 1000)

		//绘制报警类型统计图表
		var echarts_type = echarts.init(document.getElementById('type_gather'), layui.echartsTheme),
		    options_type = {
		    //报警类型统计图表
		    title: {
		    	text: '所有报警记录分类统计',
		    	x: 'center',
		    	y: 20,
		    	textStyle: {
		    		fontSize: 18,
		    		color: '#323232'
		    	}
		    },
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} (条)",
		        extraCssText:'width:150px;height:80px;',
		    },
		    legend: {
		        orient: 'vertical',
		        left: 15,
		        top: '10%',
		        itemGap: 20,
		        data: ['厂外液位超标', 'PH值超标', 'COD值超标', '氨氮超标', '总磷超标', '总氮超标']
		    },
		    series: [{
		        name: '报警类型',
		        type: 'pie',
		        radius: ['50%', '70%'],
		        center: ['50%', '50%'],
		        data: [
		            { value: 2, name: '厂外液位超标' },
		            { value: 1, name: 'PH值超标' },
		            { value: 2, name: 'COD值超标' },
		            { value: 2, name: '氨氮超标' },
		            { value: 2, name: '总磷超标' },
		            { value: 2, name: '总氮超标' }
		        ],
		        color: ['#c23531', '#d48265', '#fa9d1b', '#fad453', '#969fb0', '#546570'],
		        label: {
		                        
		            normal: {
		                textStyle: {
		                    color: 'rgba(255, 255, 255, 0.3)'
		                }
		            }
		        },
		        labelLine: {
		            normal: {
		                show: false,
		                lineStyle: {
		                    color: 'rgba(255, 255, 255, 0.3)'
		                }
		            }
		        },
		    }]
		};
		echarts_type.setOption(options_type);
		
		window.onresize = echarts_type.resize;
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
	  		table = layui.table,global = layui.global;
	  
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
		    ,{field:'alarmTime', title: '时间', width: 200}
		    ,{field:'checkPointId', title: '监测点', width: 200}
		    ,{field:'alarmType', title: '报警类型', width: 200}
		    ,{field:'dataValue', title: '数据值', width: 200}
		    ,{field:'name', title: '负责人', width: 200}
		    ,{field:'tel', title: '联系电话', width: 200}
		    ,{field:'remark', title: '备注', width: 200}
		    ,{field:'status', title: '状态', width: 200}
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
			    ,{field:'alarmTime', title: '时间', width: 200}
			    ,{field:'checkPointId', title: '监测点', width: 200}
			    ,{field:'alarmType', title: '报警类型', width: 200}
			    ,{field:'dataValue', title: '数据值', width: 200}
			    ,{field:'name', title: '负责人', width: 200}
			    ,{field:'tel', title: '联系电话', width: 200}
			    ,{field:'remark', title: '备注', width: 200}
			    ,{field:'status', title: '状态', width: 200}
		    ]]
	  		  
	  		});
	  	}, 200)
	  });
	});

	exports('alarmRecord1', {})
})