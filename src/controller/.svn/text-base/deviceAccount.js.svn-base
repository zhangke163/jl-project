layui.define(function(exports) {
	layui.use(['echarts','global'], function() {
		var $ = layui.$,
				echarts = layui.echarts,global=layui.global;

		//绘制报警类型统计图表
		// var echarts_type = echarts.init(document.getElementById('device_type'), layui.echartsTheme);

		var data_type = $('#device_type');
		$(data_type[0]).css('height','392px');
		var echarts_type = echarts.init(data_type[0], layui.echartsTheme);

		var  options_type = {
		    //报警类型统计图表
		    title: {
		    	text: '所有设备分类统计',
		    	x: 'center',
		    	y: 10,
		    	textStyle: {
		    		fontSize: 18,
		    		color: '#323232'
		    	}
		    },
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c}",
		        extraCssText:'width:100px;height:50px;',
		        // position:function(p){
		        // 	return [p[0] + 20, p[1] - 20];
		        // },
		    },
		    legend: {
		        orient: 'vertical',
		        left: 15,
		        top: '10%',
		        itemGap: 20,
		        data: ['格栅', '水泵', '自控', '变压器', '配电柜']
		    },
		    series: [{
		        name: '设备类型',
		        type: 'pie',
		        radius: ['50%', '70%'],
		        center: ['50%', '50%'],
		        data: [
		            { value: 2, name: '格栅' },
		            { value: 1, name: '水泵' },
		            { value: 2, name: '自控' },
		            { value: 2, name: '变压器' },
		            { value: 2, name: '配电柜' }
		        ],
		        color: ['#d0e5bb', '#384852', '#417e98', '#86b9c4', '#b4d5d8'],
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
	  form.render(null, 'new-form');
	  
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
	    elem: '#date' //指定元素
	  });
	});

	layui.use(['table','global'], function(){
	  var $ = layui.$,
	  		table = layui.table,global=layui.global;
	  
	  table.render({
	    elem: '#data_table'
	    ,url:global.ip.backUrl + 'alarm/getList'
	    ,page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
	      layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
	      ,first: false //不显示首页
	      ,last: false //不显示尾页
	      ,theme: '#0095ff'
	      
	    }
	    ,cols: [[
  		    {field:'alarmId', title: '序号', width: 100}
			    ,{field:'alarmTime', title: '设备类型', width: 200}
			    ,{field:'checkPointId', title: '设备名称', width: 200}
			    ,{field:'alarmType', title: '管理人员', width: 200}
			    ,{field:'dataValue', title: '管理部门', width: 200}
			    ,{field:'name', title: '权属单位', width: 200}
			    ,{field:'tel', title: '安装地点', width: 200}
			    ,{field:'remark', title: '运行状态', width: 200}
			    ,{field:'status', title: '备品备件', width: 200}
			    ,{field:'status', title: '使用手册', width: 200}
			    ,{field:'status', title: '制造商', width: 200}
			    ,{field:'status', title: '售后服务商', width: 200}
			    ,{field:'status', title: '备注', width: 200}
			    ,{field:'status', title: '维修记录', width: 200}
  		  ]]
	    
	  });

	  //收缩和展开左侧菜单栏，延迟200ms执行重新渲染表格的操作
	  $('#LAY_app_flexible').click(function(event) {
	  	setTimeout(function() {
	  		table.render({
	  		  elem: '#data_table'
	  		  ,url:global.ip.backUrl + 'alarm/getList'
	  		  ,page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
	  		    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
	  		    ,first: false //不显示首页
	  		    ,last: false //不显示尾页
	  		    ,theme: '#0095ff'
	  		    
	  		  }
	  		  ,cols: [[
	  		    {field:'alarmId', title: '序号', width: 100}
				    ,{field:'alarmTime', title: '设备类型', width: 200}
				    ,{field:'checkPointId', title: '设备名称', width: 200}
				    ,{field:'alarmType', title: '管理人员', width: 200}
				    ,{field:'dataValue', title: '管理部门', width: 200}
				    ,{field:'name', title: '权属单位', width: 200}
				    ,{field:'tel', title: '安装地点', width: 200}
				    ,{field:'remark', title: '运行状态', width: 200}
				    ,{field:'status', title: '备品备件', width: 200}
				    ,{field:'status', title: '使用手册', width: 200}
				    ,{field:'status', title: '制造商', width: 200}
				    ,{field:'status', title: '售后服务商', width: 200}
				    ,{field:'status', title: '备注', width: 200}
				    ,{field:'status', title: '维修记录', width: 200}
	  		  ]]
	  		  
	  		});
	  	}, 200)
	  });
	});

	exports('deviceAccount', {})
})