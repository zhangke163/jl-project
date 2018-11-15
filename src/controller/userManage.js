layui.define(function (exports) {
	//Demo
	layui.use(['form', 'jquery-migrate', 'jqprint', 'global', 'table', 'laydate'], function () {
		var $ = layui.$,
			form = layui.form,
			jqprint = layui.jqprint,
			global = layui.global,
			table = layui.table;
		form.render(null, 'search-form');
		//监听提交 
		form.on('submit(formDemo)', function (data) {
			// layer.msg(JSON.stringify(data.field));
			return false;
		});
		//获取用户角色
		$.ajax({
			url: global.ip.backUrl + 'role/getList',
			type: 'GET',
			data: '',
			dataType: 'json',
			success: function (data) {
				//这里获取到数据执行显示
				console.log(data.data);
				$.each(data.data, function (index, value) {
					var roleHtml = `<option value="${value.id}">${value.name}</option>`;
					$('#userrole').append(roleHtml);
					$('#allroll').append(roleHtml);
					form.render(null, 'component-form-element');
					form.render(null, 'search-form');
				})
			},
			error: function (data) {
				console.log(data.msg);
			}
		});
		//获取年龄值
		for (var i = 18; i < 55; i++) {
			var ageHtml = `<option value = '${i}'>${i}</option>`;
			$('#age').append(ageHtml);
			form.render();
		}
		//账号查重
		$("#username").blur(function () {
			var username = $('#username');
			$.ajax({
				url: global.ip.backUrl + 'user/checkUserName',
				type: 'GET',
				data: {
					"userName": username.val(),
				},
				dataType: 'json',
				success: function (data) {
					if (data.msg !== 'success') {
						$('.tips-box').html('账号已存在，请重新输入！');
					} else {
						//用户名为英文字符
						var reg = /^[A-Za-z]+$/;
						if (!reg.test($("#username").val())) {
							$('.tips-box').html('用户名请输入英文字符！');
						} else {
							$('.tips-box').html('');
						}
					}
				},
				error: function (data) {}
			});
		});
		// 手机号查重
		$("#tel").blur(function () {
			var tel = $('#tel');
			$.ajax({
				url: global.ip.backUrl + 'user/checkMobile',
				type: 'GET',
				data: {
					"mobile": tel.val(),
				},
				dataType: 'json',
				success: function (data) {
					if (data.msg !== 'success') {
						$('.tips-box').html('手机号已存在，请重新输入！');
					} else {
						$('.tips-box').html('');
					}
				},
				error: function (data) {
					alert('失败')
				}
			});
		});
		$('#starRequire').html('');
		// 用户角色选择
		form.on('select(userrole)', function (data) {
			if (data.value == 1 || data.value == 2 || data.value == 3) {
				$('#starRequire').html('*');
				$('#name').attr("lay-verify", 'required');
				form.render();
			} else {
				$('#starRequire').html('');
				$('#name').removeAttr("lay-verify");
			}
		});
		//年龄为数字
		var reg = /^[0-9]*$/;
		$("#age").blur(function () {
			if (!reg.test($("#age").val())) {
				$('.tips-box').html('年龄请输入数字！');
			} else {
				$('.tips-box').html('');
			}
		});
		$('#password').val('123456');
		$('#qrpsd').val('123456');
		$('#password').blur(function () {
			var psdValue = $('#password').val();
			//确认密码
			$("#qrpsd").blur(function () {
				if ($('#qrpsd').val() !== psdValue) {
					$('.tips-box').html('两次密码输入不一致,请重新输入！');
				} else {
					$('.tips-box').html('');
				}
			});
		})
		//电话不能和用户名相同
		$("#tel").blur(function () {
			if ($('#tel').val() == $('#username').val()) {
				$('.tips-box').html('电话不能与用户名相同,请重新输入！');
			} else {
				$('.tips-box').html('');
			}
		});
		//添加人员
		form.on('submit(addBtn)', function (data) {
			var username = $('#username');
			var company = $('#company option:selected');
			var name = $('#name');
			var password = $('#password');
			var userrole = $('#userrole option:selected');
			var sex = $('#sex option:selected');
			var qrpsd = $('#qrpsd');
			var tel = $('#tel');
			var age = $('#age');
			if ($('.tips-box').html('')) {
				$.ajax({
					url: global.ip.backUrl + 'user/user_register',
					type: 'POST',
					data: {
						"username": username.val(),
						"department": company.val(),
						"realName": name.val(),
						"password": password.val(),
						"role": userrole.val(),
						"gender": sex.val(),
						"mobile": tel.val(),
						"age": age.val(),
					},
					dataType: 'json',
					success: function (data) {
						//这里获取到数据执行显示

						if (data.msg == 'success') {
							layer.msg('用户添加成功！', {
								icon: 1
							});
							layui.table.reload('data_table');
							$('.layui-form')[0].reset();
							$('#password').val('123456');
							$('#qrpsd').val('123456');
						}
					},
					error: function (data) {}
				});
			}
			return false;
		})
		$('#clearBtn').click(function () {
			$('.layui-form')[0].reset();
			$('#password').val('123456');
			$('#qrpsd').val('123456');
		});
		// 打印功能
		function print() {
			var titleP = `<h2 style='text-align: center;'>用户列表</h2>`;
			$("#tableP").prepend(titleP);
			$("#tableP").jqprint();
			$("#tableP h2").remove();
		}
		$('#print').click(function () {
			print();
		})
		//获取监测点信息
		$.get(global.ip.backUrl + 'checkPoint/get?type=3', function (value) {
			$.each(value.data, function (index, value) {
				var optHtml = `<option value="${value.id}">${value.location}</option>`;
				$('#monitorPoint').append(optHtml);
				form.render();
			});
		})
		table.render({
			elem: '#data_table',
			url: global.ip.backUrl + 'user/getList',
			page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
				layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
					,
				first: false //不显示首页
					,
				last: false //不显示尾页
					,
				theme: '#0095ff'

			},
			cols: [
				[{
					field: 'userId',
					title: '编号',
					width: 100
				}, {
					field: 'username',
					title: '用户名',
					width: 200
				}, {
					field: 'department',
					title: '单位',
					width: 400
				}, {
					field: 'roleName',
					title: '用户角色',
					width: 200
				}, {
					field: 'mobile',
					title: '联系电话',
					width: 200
				}, {
					field: 'realName',
					title: '姓名',
					width: 300
				}, {
					field: 'gender',
					title: '性别',
					width: 100,
					templet: function (d) {
						return d.gender == '1' ? '男' : '女';
					}
				}, {
					field: 'age',
					title: '年龄',
					width: 100
				}, {
					width: 200,
					align: 'center',
					title: '操作',
					fixed: 'right',
					toolbar: '#barDemo'
				}]
			]

		});
		//查询功能
		var active = {
			searchBtn: function () {
				//获取输入框的值
				var allname = $('#allname');
				var alltel = $('#alltel');
				var allcompany = $('#allcompany option:selected');
				var allroll = $('#allroll option:selected');
				var allsex = $('#allsex option:selected');
				if (allname.val() || alltel.val() || allcompany.val() || allroll.val() || allsex.val()) {
					var index = layer.msg('查询中，请稍候...', {
						icon: 16,
						time: false,
						shade: 0
					});
					setTimeout(function () {
						table.reload('data_table', {
							where: {
								'realName': allname.val(),
								'mobile': alltel.val(),
								'department': allcompany.val(),
								'role': allroll.val(),
								'gender': allsex.val()
							}
						});
						layer.close(index);
					}, 800);
				} else {
					//执行重载
					table.reload('data_table', {
						page: {
							curr: 1 //重新从第 1 页开始
						},
						where: {
							'realName': '',
							'mobile': '',
							'department': '',
							'role': '',
							'gender': ''
						}
					});

				}
			}
		};
		//查询按钮被点击事件
		$('#searchBtn').on('click', function () {
			console.log('被点击');
			var type = $(this).data('type');
			active[type] ? active[type].call(this) : '';
		});

		$('#add').click(function (event) {
			layer.open({
				type: 2,
				area: ['500px', '465px'],
				fix: false,
				resize: false,
				shade: 0.4,
				maxmin: false,
				title: '添加监测数据',
				content: layui.setter.base + 'views/pop/addMonitorData.html',
				end: function () {
					table.reload('data_table', {
						page: {
							curr: 1 //重新从第 1 页开始
						}
					});
				}
			});
		});

		//收缩和展开左侧菜单栏，延迟200ms执行重新渲染表格的操作
		$('#LAY_app_flexible').click(function (event) {
			setTimeout(function () {
				table.render({
					elem: '#data_table',
					url: global.ip.backUrl + 'user/getList',
					page: {
						layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
							,
						first: false //不显示首页
							,
						last: false //不显示尾页
							,
						theme: '#0095ff'

					},
					cols: [
						[{
							field: 'userId',
							title: '编号',
							width: 100
						}, {
							field: 'username',
							title: '用户名',
							width: 200
						}, {
							field: 'department',
							title: '单位',
							width: 400
						}, {
							field: 'roleName',
							title: '用户角色',
							width: 200
						}, {
							field: 'mobile',
							title: '联系电话',
							width: 200
						}, {
							field: 'realName',
							title: '姓名',
							width: 300
						}, {
							field: 'gender',
							title: '性别',
							width: 100,
							templet: function (d) {
								return d.gender == '1' ? '男' : '女';
							}
						}, {
							field: 'age',
							title: '年龄',
							width: 100
						}, {
							width: 200,
							align: 'center',
							title: '操作',
							fixed: 'right',
							toolbar: '#barDemo'
						}]
					]

				});
			}, 200)
		});
		//监听工具条
		table.on('tool(data_table)', function (obj) {
			var data = obj.data;
			var rowId = data.userId;
			if (obj.event === 'reset') {
				layer.confirm('是否重置密码为123456？', function (index) {
					$.ajax({
						url: global.ip.backUrl + 'user/resetPsw',
						type: 'GET',
						data: {
							'userId': rowId
						},
						dataType: 'json',
						success: function (data) {
							layer.close(index);
							if (data.msg == 'success') {
								layer.msg('重置密码成功！', {
									icon: 1
								});
							}
						},
						error: function (data) {
							alert(data.msg);
						}
					});
				});
			} else if (obj.event === 'del') {
				layer.confirm('是否确认删除？', function (index) {
					$.ajax({
						url: global.ip.backUrl + 'user/del',
						type: 'GET',
						data: {
							'userId': rowId
						},
						dataType: 'json',
						success: function (data) {
							obj.del();
							layer.close(index);

						},
						error: function (data) {
							console.log(data.msg);
						}
					});
				});
			} else if (obj.event === 'edit') {
				// layer.alert('编辑行：<br>'+ JSON.stringify(data))
				layer.open({
					type: 2,
					area: ['518px', '525px'],
					fix: false,
					resize: false,
					shade: 0.4,
					title: '信息编辑',
					content: layui.setter.base + 'views/pop/userDetail.html?id=' + rowId
				});
			}
		});
	});
	exports('userManage', {})
})