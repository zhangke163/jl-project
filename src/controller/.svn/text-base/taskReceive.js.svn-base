layui.define(function (exports) {
	layui.use(['layer', 'global', 'table'], function () {
		var layer = layui.layer,
			global = layui.global,
			$ = layui.$,
			table = layui.table;

		table.render({
			elem: '#test',
			url: global.ip.backUrl + 'task/getList',
			where: {
				'status': '5'
			},
			page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
				layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
					,
				first: false //不显示首页
					,
				last: false //不显示尾页
					,
				theme: '#0095ff'

			},
			width: '100%',
			cols: [
				[{
					field: 'taskId',
					title: '任务编号',
					width: 100
				}, {
					field: 'reportTime',
					title: '上报时间',
					width: 200
				}, {
					field: 'siteName',
					title: '线路',
					width: 750
				}, {
					field: 'userName',
					title: '巡查员',
					width: 200
				}, {
					field: 'status',
					title: '状态',
					width: 210
				}, {
					width: 178,
					align: 'center',
					title: '操作',
					fixed: 'right',
					toolbar: '#barDemo',
					width: 178
				}]
			]

		});

		//收缩和展开左侧菜单栏，延迟200ms执行重新渲染表格的操作
		$('#LAY_app_flexible').click(function (event) {
			setTimeout(function () {
				table.render({
					elem: '#test',
					url: global.ip.backUrl + 'task/getList',
					where: {
						'status': '5'
					},
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
							field: 'taskId',
							title: '任务编号'
						}, {
							field: 'reportTime',
							title: '上报时间',
							width: '15%'
						}, {
							field: 'siteName',
							title: '线路'
						}, {
							field: 'userName',
							title: '巡查员'
						}, {
							field: 'status',
							title: '状态'
						}, {
							width: 178,
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
		table.on('tool(viewB)', function (obj) {
			var data = obj.data;
			if (obj.event === 'detail') {
				var rowId = data.taskId;
				layer.open({
					type: 2,
					area: ['1200px', '640px'],
					title: '弹出窗',
					shade: false,
					//			        maxmin: true,
					fix: false,
					resize: true,
					shade: 0.4,
					title: '任务编号为' + rowId + '的任务详情',
					content: layui.setter.base + 'views/pop/auditPop.html?id=' + rowId,
				});
			}
		});
		$('.test-table-operate-btn .layui-btn').on('click', function () {
			var type = $(this).data('type');
			active[type] ? active[type].call(this) : '';
		});
	});

	exports('taskReceive', {})
})