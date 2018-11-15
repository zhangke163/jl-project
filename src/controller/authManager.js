layui.define(['jq-ztree', 'form', 'customUtil', 'global'], function (exports) {
	var form = layui.form,
		$ = layui.jquery,
		customUtil = layui.customUtil,
		global = layui.global,
		treeObj = null,
		currentRoleId;
	var setting = {
		check: {
			enable: true
		},
		data: {
			key: {
				checked: 'checked',
				children: 'list',
				name: 'title',
			}
		}
	};
	form.on('select(role)', function (data) {
		if (data.value == '') {
			$('#authTree').css('display', 'none');
			$('#limits-box').css('display', 'none');

		} else {
			$('#authTree').css('display', 'block');
			$('#limits-box').css('display', 'block');
		}
		currentRoleId = data.value;
		$.ajax({
			url: global.ip.backUrl + 'role/getAuthByRoleId?roleId=' + currentRoleId,
			success: function (res) {
				var anthJson = $.parseJSON('{"data":' + res.data.auth + "}");
				treeObj = $.fn.zTree.init($("#authTree"), setting, anthJson.data);
			}
		});
	});
	form.on('submit(save)', function (data) {
		var roleId = $("#role").val();
		if (roleId) {
			var nodes = treeObj.getNodes();
			var nodeArr = treeObj.transformToArray(nodes);
			var nodeLevel0 = nodeArr.filter(function (item) {
				if (item.level == 0) {
					return item;
				}
			});
			filterNodes(nodeLevel0);
			var strNode = JSON.stringify({
				data: nodeLevel0
			})
			var data1 = strNode.substring(8, strNode.length - 1);
			$.ajax({
				url: global.ip.backUrl + 'role/update',
				type: 'post',
				data: {
					id: currentRoleId,
					auth: data1
				},
				success: function (res) {
					if (res.msg == "success" && res.count == 1) {
						layer.msg('保存成功！', {
							icon: 1,
							time: 1000
						})
					}
				}
			})
		} else {
			layer.alert('请在下拉框中选择要删除的角色！');
		}

		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
	form.on('submit(deleteRole)', function (data) {
		debugger
		var roleId = $('#role option:selected').val();
		if (roleId) {
			layer.confirm('确定删除', function (index) {
				$.ajax({
					url: global.ip.backUrl + 'role/del?roleId=' + roleId,
					success: function (res) {
						if (res.count == 1) {
							layer.msg('删除成功！', {
								icon: 1,
								time: 1000
							}, function () {
								$.ajax({
									url: global.ip.backUrl + 'role/getList',
									success: function (res) {
										var roleArr = res.data;
										$("#role").empty().append($(`<option title="请选择角色" value="">请选择角色</option>`));
										roleArr.forEach(function (item) {
											$("#role").append($(`<option title="${item.instruction}" value="${item.id}">${item.name}</option>`));
										});
										$('#limits-box').css('display','none');
										$('#authTree').css('display','none');
										form.render();
										layer.closeAll();
									}
								})
							});
						}
					}
				});
			});
		} else {
			layer.alert('请在下拉框中选择要删除的角色！');
		}
		form.render();
		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
	form.on('submit(addRole)', function (formData) {
		layer.confirm('确定提交', function (index) {
			var role_name = $('#name').val();
			$.ajax({
				url: global.ip.backUrl + 'role/create',
				type: 'post',
				data: formData.field,
				success: function (res) {
					console.log(res);
					var ids = res.data.id;
					if (res.count == 1) {
						layer.msg('添加成功！', {
							icon: 1,
							time: 2000
						}, function () {
							$.ajax({
								url: global.ip.backUrl + 'role/getList',
								success: function (res) {
									var roleArr = res.data;
//									$("#role").empty().append($(`<option title="请选择角色" value="">请选择角色</option>`));
									roleArr.forEach(function (item) {
										$("#role").append($(`<option title="${item.instruction}" value="${item.id}">${item.name}</option>`));
									})
									$("#instruction").val('');
									$("#name").val('');
									$("#role").val(ids);
									$('#authTree').css('display', 'block');
									$('#limits-box').css('display', 'block');
									form.render();
									layer.closeAll();
								}
							})
						});

					}
				}
			});
		});
		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
	$(function () {
		$.ajax({
			url: global.ip.backUrl + 'role/getList',
			success: function (res) {
				var roleArr = res.data;
				roleArr.forEach(function (item) {
					$("#role").append($(`<option title="${item.instruction}" value="${item.id}">${item.name}</option>`));
				})
				form.render();
			}
		});
		$.ajax({
			url: global.ip.backUrl + 'role/getAuthByRoleId?roleId=10001',
			success: function (res) {
				var anthJson = $.parseJSON('{"data":' + res.data.auth + "}");
				treeObj = $.fn.zTree.init($("#authTree"), setting, anthJson.data);
			}
		});
	});

	function filterNodes(nodeArr) {
		nodeArr.forEach(function (item, index) {
			nodeArr[index] = {}
			nodeArr[index].name = item.name ? item.name : "";
			nodeArr[index].title = item.title ? item.title : "";
			nodeArr[index].jump = item.jump ? item.jump : "";
			if (item.checked) {
				nodeArr[index].checked = item.checked;
			}
			if (item.isParent) {
				nodeArr[index].list = item.list;
				nodeArr[index].icon = "layui-icon-component";
				filterNodes(nodeArr[index].list);
			}
		});
	}

	function beforeCheck() {
		return (treeNode.doCheck !== false);
	}
	exports('authManager', {})
})