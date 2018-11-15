layui.define(function(exports) {
	layui.use(['admin', 'table', 'form', 'element', 'global'], function() {
		var table = layui.table,
			$ = layui.$,
			global = layui.global,
			element = layui.element;

		$(function() {
			element.on('tab(switch)',
				function(data) {
					layerType = $('.layui-tab-title .layui-this')[0].innerHTML;
					refreshCombox(layerType);
				});
			layerType = $('.layui-tab-title .layui-this')[0].innerHTML;
			refreshCombox(layerType);
			//			获取重点道路
			$.ajax({
                url: global.ip.backUrl + '/lineSta/getTotalEmphasis',
                type: 'GET',
                data: '',
                async: false,
                dataType: 'json',
                success: function (data) {
                	console.log(data)
                    $('#zddl-one').html(data.data.TOTALLENGTH);
                    $('#zddl-two').html(data.data.TOTALAREA);
                    $('#zddl-three').html(data.data.YSTOTALLEN);
                    $('#zddl-four').html(data.data.WSTOTALLEN);
                    $('#zddl-five').html(data.data.YS1);
                    $('#zddl-six').html(data.data.WS1);
                    $('#zddl-seven').html(data.data.YS2);
                    $('#zddl-eight').html(data.data.WS2);
                    $('#zddl-nine').html(data.data.YS3);
                    $('#zddl-ten').html(data.data.WS3);
                    $('#zddl-eleven').html(data.data.YS4);
                    $('#zddl-twelve').html(data.data.WS4);
                    $('#zddl-thirteen').html(data.data.WSJCOUNT);
                    $('#zddl-fourteen').html(data.data.YSJCOUNT);
                    $('#zddl-fivteen').html(data.data.BZCOUNT);
                    $('#zddl-hj-one').html(data.data.TOTAL1);
                    $('#zddl-hj-two').html(data.data.TOTAL2);
                    $('#zddl-hj-three').html(data.data.TOTAL3);
                    $('#zddl-hj-four').html(data.data.TOTAL4);
                    $('#zddl-total').html(data.data.TOTAL1+data.data.TOTAL2+data.data.TOTAL3+data.data.TOTAL4);
                },
                error: function (data) {
                    console.log(data.msg);
                }
            });
//			获取材质合计
			$.ajax({
                url: global.ip.backUrl + '/lineSta/getCountCZ',
                type: 'GET',
                data: '',
                async: false,
                dataType: 'json',
                success: function (data) {
                    $('#czxj-one').html(data.data.subtotal[0].ys_z);
                    $('#czxj-two').html(data.data.subtotal[0].ws_z);
                    $('#czxj-three').html(data.data.subtotal[0].ys_zh);
                    $('#czxj-four').html(data.data.subtotal[0].ws_zh);
                    $('#czxj-five').html(data.data.subtotal[0].ys_pvc);
                    $('#czxj-six').html(data.data.subtotal[0].ws_pvc);
                    $('#czxj-seven').html(data.data.subtotal[0].ys_pe);
                    $('#czxj-eight').html(data.data.subtotal[0].ws_pe);
                    $('#czxj-nine').html(data.data.subtotal[0].ys_zs);
                    $('#czxj-ten').html(data.data.subtotal[0].ws_zs);
                    $('#czxj-eleven').html(data.data.subtotal[0].ys_g);
                    $('#czxj-twelve').html(data.data.subtotal[0].ys_g);
                    $('#czxj-thirteen').html(data.data.subtotal[0].ys_zt);
                    $('#czxj-fourteen').html(data.data.subtotal[0].ws_zt);
                    $('#czxj-fifteen').html(data.data.subtotal[0].ys_hnt);
                    $('#czxj-sixteen').html(data.data.subtotal[0].ws_hnt);
                    $('#czhj-one').html(data.data.aggregate[0].z);
                    $('#czhj-two').html(data.data.aggregate[0].zh);
                    $('#czhj-three').html(data.data.aggregate[0].pvc);
                    $('#czhj-four').html(data.data.aggregate[0].pe);
                    $('#czhj-five').html(data.data.aggregate[0].zs);
                    $('#czhj-six').html(data.data.aggregate[0].g);
                    $('#czhj-seven').html(data.data.aggregate[0].zt);
                    $('#czhj-eight').html(data.data.aggregate[0].hnt);
                    $('#czzj').html(data.data.total[0].total);
                },
                error: function (data) {
                    console.log(data.msg);
                }
            });
//			获取管径合计
			$.ajax({
                url: global.ip.backUrl + '/lineSta/getCountGJ',
                type: 'GET',
                data: '',
                async: false,
                dataType: 'json',
                success: function (data) {
                    $('#gjxj-one').html(data.data.subtotal[0].ys1);
                    $('#gjxj-two').html(data.data.subtotal[0].ws1);
                    $('#gjxj-three').html(data.data.subtotal[0].ys2);
                    $('#gjxj-four').html(data.data.subtotal[0].ws2);
                    $('#gjxj-five').html(data.data.subtotal[0].ys3);
                    $('#gjxj-six').html(data.data.subtotal[0].ws3);
                    $('#gjxj-seven').html(data.data.subtotal[0].ys4);
                    $('#gjxj-eight').html(data.data.subtotal[0].ws4);
                    $('#gjhj-one').html(data.data.aggregate[0].aggregate1);
                    $('#gjhj-two').html(data.data.aggregate[0].aggregate2);
                    $('#gjhj-three').html(data.data.aggregate[0].aggregate3);
                    $('#gjhj-four').html(data.data.aggregate[0].aggregate4);
                    $('#gjzj').html(data.data.total[0].total);
                },
                error: function (data) {
                    console.log(data.msg);
                }
            });
		});

		function refreshCombox(layerType) {
			objList = null;
			targetLayer = null;
			if(layerType == "管径统计") {
				table.render({
					elem: '#sewage-table-gj',
					url: global.ip.backUrl + 'lineSta/getListGJ',
					cols: [
						[{
								field: 'ROW_ID',
								title: '序号',
								width: 150,
								rowspan: 3
							},{
								field: 'szdl',
								title: '所在道路',
								width: 150,
								rowspan: 3
							} //rowspan即纵向跨越的单元格数
							, {
								align: 'center',
								title: '管径',
								colspan: 8
							}
						],
						[{
							align: 'center',
							title: '0-300（mm）',
							colspan: 2
						}, {
							align: 'center',
							title: '300-600（mm）',
							colspan: 2
						}, {
							align: 'center',
							title: '600-1000（mm）',
							colspan: 2
						}, {
							align: 'center',
							title: '1000以上（mm）',
							colspan: 2
						}],
						[{
							align: 'center',
							title: '雨水（m）',
							field: 'ys_len_1',
						}, {
							align: 'center',
							title: '污水（m）',
							field: 'ws_len_1',
						}, {
							align: 'center',
							title: '雨水（m）',
							field: 'ys_len_2',
						}, {
							align: 'center',
							title: '污水（m）',
							field: 'ws_len_2',
						}, {
							align: 'center',
							title: '雨水（m）',
							field: 'ys_len_3',
						}, {
							align: 'center',
							title: '污水（m）',
							field: 'ws_len_3',
						}, {
							align: 'center',
							title: '雨水（m）',
							field: 'ys_len_4',
						}, {
							align: 'center',
							title: '污水（m）',
							field: 'ws_len_4',
						}]
					],
					page: true,
					limits: [10, 20, 50],
					height: '685px',
				});
			} else if(layerType == "材质统计") {
				table.render({
					elem: '#sewage-table-cz',
					url: global.ip.backUrl + 'lineSta/getListCZ',
					cols: [
						[{
								field: 'ROW_ID',
								title: '序号',
								width: 150,
								rowspan: 3
							},{
								field: 'szdl',
								title: '所在道路',
								width: 150,
								rowspan: 3
							} //rowspan即纵向跨越的单元格数
							, {
								align: 'center',
								title: '材质',
								colspan: 16
							}
						],
						[{
							align: 'center',
							title: '砖',
							colspan: 2
						}, {
							align: 'center',
							title: '砖石',
							colspan: 2
						}, {
							align: 'center',
							title: '砖混',
							colspan: 2
						}, {
							align: 'center',
							title: '砼',
							colspan: 2
						}, {
							align: 'center',
							title: 'PVC',
							colspan: 2
						}, {
							align: 'center',
							title: 'PE',
							colspan: 2
						}, {
							align: 'center',
							title: '钢',
							colspan: 2
						}, {
							align: 'center',
							title: '铸铁',
							colspan: 2
						}],
						[{
							align: 'center',
							title: '雨水（m）',
							width:'120',
							field: 'ys_z',
						}, {
							align: 'center',
							title: '污水（m）',
							width:'120',
							field: 'ws_z',
						}, {
							align: 'center',
							title: '雨水（m）',
							width:'120',
							field: 'ys_zs',
						}, {
							align: 'center',
							title: '污水（m）',
							width:'120',
							field: 'ws_zs',
						}, {
							align: 'center',
							title: '雨水（m）',
							width:'120',
							field: 'ys_zh',
						}, {
							align: 'center',
							title: '污水（m）',
							width:'120',
							field: 'ws_zh',
						}, {
							align: 'center',
							title: '雨水（m）',
							width:'120',
							field: 'ys_hnt',
						}, {
							align: 'center',
							title: '污水（m）',
							width:'120',
							field: 'ws_hnt',
						}, {
							align: 'center',
							title: '雨水（m）',
							width:'120',
							field: 'ys_pvc',
						}, {
							align: 'center',
							title: '污水（m）',
							width:'120',
							field: 'ws_pvc',
						}, {
							align: 'center',
							title: '雨水（m）',
							width:'120',
							field: 'ys_pe',
						}, {
							align: 'center',
							title: '污水（m）',
							width:'120',
							field: 'ws_pe',
						}, {
							align: 'center',
							title: '雨水（m）',
							width:'120',
							field: 'ys_g',
						}, {
							align: 'center',
							title: '污水（m）',
							width:'120',
							field: 'ws_g',
						}, {
							align: 'center',
							title: '雨水（m）',
							width:'120',
							field: 'ys_zt',
						}, {
							align: 'center',
							title: '污水（m）',
							width:'120',
							field: 'ws_zt',
						}]
					],
					page: true,
					limits: [10, 20, 50],
					height: '685px',
				});
			}else{
				table.render({
					elem: '#sewage-table-zddl',
					url: global.ip.backUrl + '/lineSta/getListEmphasis',
					cols: [
						[{
								field: 'ROW_ID',
								title: '序号',
								width: 150,
								rowspan: 3
							},{
								field: 'szdl',
								title: '所在道路',
								width: 150,
								rowspan: 3
							},//rowspan即纵向跨越的单元格数
							{
								field: 'start',
								title: '起点',
								width: 150,
								rowspan: 3
							},
							{
								field: 'end',
								title: '终点',
								width: 150,
								rowspan: 3
							},
							{
								field: 'length',
								title: '道路长度(m)',
								width: 150,
								rowspan: 3
							} ,
							{
								field: 'width',
								title: '道路宽度(m)',
								width: 150,
								rowspan: 3
							},
							{
								field: 'area',
								title: '道路面积(m²)',
								width: 150,
								rowspan: 3
							},
							{
								field: 'ys_len_total',
								title: '雨水管道长度(m)',
								width: 150,
								rowspan: 3
							},
							{
								field: 'ws_len_total',
								title: '污水管道长度(m)',
								width: 150,
								rowspan: 3
							}  
							, {
								align: 'center',
								title: '管径',
								colspan: 8
							},
							{
								field: 'wsj',
								title: '污水井（个）',
								width: 150,
								rowspan: 3
							},
							{
								field: 'ysj',
								title: '雨水井（个）',
								width: 150,
								rowspan: 3
							} ,
							{
								field: 'bz',
								title: '雨水篦（个）',
								width: 150,
								rowspan: 3
							} 
						],
						[{
							align: 'center',
							title: '0-300（mm）',
							colspan: 2
						}, {
							align: 'center',
							title: '300-600（mm）',
							colspan: 2
						}, {
							align: 'center',
							title: '600-1000（mm）',
							colspan: 2
						}, {
							align: 'center',
							title: '1000以上（mm）',
							colspan: 2
						}],
						[{
							align: 'center',
							title: '雨水（m）',
							width: 120,
							field: 'ys_len_1',
						}, {
							align: 'center',
							title: '污水（m）',
							width: 120,
							field: 'ws_len_1',
						}, {
							align: 'center',
							title: '雨水（m）',
							width: 120,
							field: 'ys_len_2',
						}, {
							align: 'center',
							title: '污水（m）',
							width: 120,
							field: 'ws_len_2',
						}, {
							align: 'center',
							title: '雨水（m）',
							width: 120,
							field: 'ys_len_3',
						}, {
							align: 'center',
							title: '污水（m）',
							width: 120,
							field: 'ws_len_3',
						}, {
							align: 'center',
							title: '雨水（m）',
							width: 120,
							field: 'ys_len_4',
						}, {
							align: 'center',
							title: '污水（m）',
							width: 120,
							field: 'ws_len_4',
						}]
					],
					page: true,
					limits: [10, 20, 50],
					height: '685px',
				});
			}
		};

	})
	exports('pipeStatistic', {})
})