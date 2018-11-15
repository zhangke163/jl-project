layui.define(function(exports) {
	layui.use(['echarts','form','table','jquery-migrate','jqprint','global'], function() {
		var $ = layui.$,
				echarts = layui.echarts,
				table = layui.table,
				jqprint = layui.jqprint,global=layui.global;

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
//		var ageData =    [{ value: 3, name: '20岁以下' },
//			            { value: 1, name: '20-30岁' },
//			            { value: 1, name: '30-40岁' },
//			            { value: 2, name: '40-50岁' },
//			            { value: 2, name: '50岁以上' }];
		var ageData  = [];
		$.get(global.ip.backUrl + 'person/statByAge',function(value){
			$.each(value.data[0],function(key,value){
				var options = {'value':value,'name':key};
				ageData.push(options);
			})
			//绘制报警类型统计图表
			var echarts_type = echarts.init(document.getElementById('type_gather'), layui.echartsTheme),
			    options_type = {
			    //报警类型统计图表
			    title: {
			    	x: 'center',
			    	y: '20',
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
			        data: ['20岁以下', '20-30岁', '30-40岁', '40-50岁', '50岁以上']
			    },
			    series: [{
			        name: '人员年龄',
			        type: 'pie',
			        radius: ['50%', '70%'],
			        center: ['50%', '50%'],
			        data: [],
			        color: ['#ecca76', '#409b72', '#41a2d8', '#6c62c4', '#e77a3d'],
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
			console.log(ageData)
			echarts_type.setOption(options_type);
			echarts_type.setOption({
					        series: [{
						            data: ageData
						       }
						    ]
					    });
			window.onresize = echarts_type.resize;
		})
	})

	//Demo
	layui.use('form', function(){
		var $ =layui.$;
	  var form = layui.form;
	  form.render(null, 'search-form');
	  form.render(null,'component-form-element');
	  
	  //监听提交
	  form.on('submit(formDemo)', function(data){
//	    layer.msg(JSON.stringify(data.field));
	    return false;
	  });
	  //获取年龄值
		for(var i = 18; i< 55 ; i++){
			var ageHtml = `<option value = '${i}'>${i}</option>`;
			$('#age').append(ageHtml);
			form.render();
		}
	});

	layui.use('laydate', function(){
	  var laydate = layui.laydate;
	  
	  //执行一个laydate实例
	  laydate.render({
	    elem: '#test1' //指定元素
	  });
	});

	layui.use(['table','form','global'], function(){
	  var $ = layui.$,
	  		table = layui.table,
	  form = layui.form,global=layui.global;
	  table.render({
	    elem: '#test'
	    ,url:global.ip.backUrl + 'person/queryList'
	    ,page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
	      layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
	      ,first: false //不显示首页
	      ,last: false //不显示尾页
	      ,theme: '#0095ff'
	      
	    }
	    ,cols: [[
	      		{field:'ROW_ID', title: '编号'}
	  		    ,{field:'id', title: 'ID', width: '15%'}
	  		    ,{field:'name', title: '姓名'}
	  		    ,{field:'tel', title: '手机号'}
	  		    ,{field:'company', title: '单位'}		    
	  		    ,{field:'post', title: '岗位'}
	  		    ,{field:'sex', title: '性别'}		    
	  		    ,{field:'age', title: '年龄'}
	  		    ,{width:178, align:'center',title:'操作', fixed: 'right', toolbar: '#deleteBtn'}
	    ]]
	    
	  });

	  //收缩和展开左侧菜单栏，延迟200ms执行重新渲染表格的操作
	  $('#LAY_app_flexible').click(function(event) {
	  	setTimeout(function() {
	  		table.render({
	  		  elem: '#test'
	  		  ,url:global.ip.backUrl + 'person/queryList'
	  		  ,page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
	  		    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
	  		    ,first: false //不显示首页
	  		    ,last: false //不显示尾页
	  		    ,theme: '#0095ff'
	  		    
	  		  }
	  		  ,cols: [[
	  		    {field:'ROW_ID', title: '编号'}
	  		    ,{field:'id', title: 'ID', width: '15%'}
	  		    ,{field:'name', title: '姓名'}
	  		    ,{field:'tel', title: '手机号'}
	  		    ,{field:'company', title: '单位'}		    
	  		    ,{field:'post', title: '岗位'}
	  		    ,{field:'sex', title: '性别'}		    
	  		    ,{field:'age', title: '年龄'}
	  		    ,{width:178, align:'center',title:'操作', fixed: 'right', toolbar: '#deleteBtn'}
	  		  ]]
	  		  
	  		});
	  	}, 200)
	  });
	  //监听工具条
	    table.on('tool(test)', function(obj){
	      var data = obj.data;
	      if(obj.event === 'del'){
	        layer.confirm('是否确认删除？', function(index){
	        	console.log(obj.data.id);
	          obj.del();
	          layer.close(index);
	           $.ajax({ 
	           	url: global.ip.backUrl + "person/delete",
	           	type: 'post',
	           	data: {'id':obj.data.id}, 
	           	success: function(){
			    	layer.msg('删除成功！', {icon: 1});
			   	}
	           })
	        });
	      }
	    });	
	    function  print(){
	    	var titleP =`<h2 style='text-align: center;'>人员管理列表</h2>`;
	       $("#tableP").prepend(titleP);
	        $("#tableP").jqprint();
	        $("#tableP h2").remove();
	    }
	    $('#print').click(function(){
	    	print();
	    })
	    //添加人员    			
//	    $('#addBtn').click(function()
	    form.on('submit(addBtn)', function(data){
	    	var names = $("#name");
	    	var sexs = $("#sex option:selected");
	    	var ages = $("#age option:selected");
	    	var tels = $("#tel");
	    	var companys = $("#company option:selected");
	    	var posts = $("#post option:selected");
	    		$.ajax({
					url: global.ip.backUrl + 'person/createPerson',
					type: 'POST',
					data: {
						"name": names.val(),
						"sex": sexs.val(),
						"age": ages.val(),
						"tel": tels.val(),
						"company": companys.val(),
						"post": posts.val(),
					},
					dataType: 'json',
					success: function(data) {
						//这里获取到数据执行显示
						layer.msg(data.msg);
						layui.table.reload('test');
					},
					error: function(data) {
					}
				});
				return false;
	})
	    $('#clearBtn').click(function(){
	    	$('.layui-form')[0].reset();
	    })
//	    //添加养护单位
	    $.ajax({
				url: global.ip.backUrl + 'person/queryList',
				type: 'GET',
				data: '',
				dataType: 'json',
				success: function(data) {
					//这里获取到数据执行显示
					console.log(data.data);
					$.each(data.data,function(index,value){
						var postHtml = `<option value="${value.company}">${value.company}</option>`;
		    			$('#table-company').append(postHtml);
		    			form.render(null, 'search-form');
					})				
				},
				error: function(data) {
					console.log(data.msg);
				}
			});
	    
	    //查询数据
		var $ = layui.$,
			   active = {
				searchQuery: function() {
					//获取输入框的值
					var table_name = $('#table-name');
					var table_tel = $('#table-tel');
					var table_company = $('#table-company option:selected');
					var table_post = $('#table-post option:selected');
					var table_sex = $('#table-sex option:selected');
					if(table_name.val() || table_tel.val() || table_company.val() || table_post.val() || table_sex.val()) {
						var index = layer.msg('查询中，请稍候...', {
							icon: 16,
							time: false,
							shade: 0
						});
						setTimeout(function() {
							table.reload('test', {
								where: {
									'name': table_name.val(),
									'tel': table_tel.val(),
									'company': table_company.val(),
									'post': table_post.val(),
									'sex': table_sex.val()
								}
							});
							layer.close(index);
						}, 800);
					} else {
						//执行重载
						table.reload('test', {
							page: {
								curr: 1 //重新从第 1 页开始
							},
							where: {
								'name': "",
								'tel': "",
								'company': "",
								'sex': ""
							}
						});

					}
				}
			};
		//搜索按钮被点击事件
		$('#searchQuery').on('click', function() {
			console.log('搜索按钮被点击');
			var type = $(this).data('type');
			active[type] ? active[type].call(this) : '';
		});
		//查询巡查员月度前三名
		$.get(global.ip.backUrl + 'person/statByTask',function(value){			
			$.each(value.data,function(index,value){
				console.log(value.num);
				if(value.num == 1){
					$('.ranking-list:nth-child(1) .rank-name h2').html(value.name);
					$('.ranking-list:nth-child(1) .rank-number h3').html(value.num);
				}else if(value.num == 2){
					$('.ranking-list:nth-child(2) .rank-name h2').html(value.name);
					$('.ranking-list:nth-child(2) .rank-number h3').html(value.num);
				}else if(value.num == 3){
					$('.ranking-list:nth-child(3) .rank-name h2').html(value.name);
					$('.ranking-list:nth-child(3) .rank-number h3').html(value.num);
				}
			})
		})
		//刷新
		$('.refresh button').click(function(){
			$.get(global.ip.backUrl + 'person/statByTask',function(value){			
			$.each(value.data,function(index,value){
				console.log(value.num);
				if(value.num == 1){
					$('.ranking-list:nth-child(1) .rank-name h2').html(value.name);
					$('.ranking-list:nth-child(1) .rank-number h3').html(value.num);
				}else if(value.num == 2){
					$('.ranking-list:nth-child(2) .rank-name h2').html(value.name);
					$('.ranking-list:nth-child(2) .rank-number h3').html(value.num);
				}else if(value.num == 3){
					$('.ranking-list:nth-child(3) .rank-name h2').html(value.name);
					$('.ranking-list:nth-child(3) .rank-number h3').html(value.num);
				}
			 })
			})
		});
	});
	
	exports('personManage', {})
})