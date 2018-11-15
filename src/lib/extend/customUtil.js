layui.define(['laypage'], function(exports) {
	var $ = layui.jquery,
		laypage = layui.laypage;

	/*传参*/
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null)
			return unescape(r[2]);
		return null;
	}

	//分页控件的初始化，先解除page事件然后重新绑定，防止多次触发
	function pageInit(total, visiblePages, startPage, pageId, dataUrl, $_listPanel, getTable, pageNum) {
		laypage.render({
			elem: pageId,
			count: total,
			groups: visiblePages,
			first: '«',
			last: '»',
			prev: '<',
			next: '>',
			curr: startPage,
			jump: function(obj, first) {
				var page = obj.curr;
				var pageSize = pageNum || 10;
				$.ajax({
					url: dataUrl,
					data: {
						page: page,
						limit: pageSize
					},
					success: function(result) {
						listPage = page;

						var total = result.count; //记录总数
						var data = getTable(result, page, pageSize);
						$_listPanel.empty().html(data);
					}
				});
			}
		});
	}

	//获取工程
	/**
	 * pageIndex：第几页
	 * url：接口
	 * $_listPanel：列表容器的jquery对象，这里是ul
	 * $_paginationWrap：分页容器
	 * $_resTatal：查询结果总数容器,
	 * getTable:函数，根据ajax的返回值生成列表的html
	 * */
	function getList(pageIndex, url, $_listPanel, $_paginationWrap, paginationId, $_resTatal, getTable, pageNum) {
		var pageSize = pageNum || 10;
		$.ajax({
			url: url,
			async: false,
			type: "get",
			data: {
				page: pageIndex,
				limit: pageSize
			},
			success: function(result) {
				var total = result.count; //记录总数
				totalLeft = total;
				if(total) {
					var data = getTable(result, pageIndex, pageSize);
					$_listPanel.empty().html(data);
					if(total > 10) {
						var pageTotal = total / pageSize;
						var remainder = total % pageSize;
						if(remainder > 0) {
							pageTotal++;
						}
						//初始化一个分页控件
						pageInit(total, 4, pageIndex, paginationId, url, $_listPanel, getTable);
						$('#' + paginationId).css('display', 'block');
						$_paginationWrap.css('display', 'block');
					} else {
						$('#' + paginationId).css("display", "none");
						$_paginationWrap.css('display', 'none');
					}
				} else {

					$_listPanel.empty();
				}
				if($_resTatal) {
					$_resTatal.text(total);
				}
			}
		});
	}

	//生成左侧河段列表
	function getTable(result, pageIndex, pageSize) {
		var data = "";
		if(result != "" && result != null) {
			//获取json数据
			if(selectedType.indexOf('line') != -1) {
				$.each(result.data, function(idx, item) {
					let orderNum = (pageIndex - 1) * pageSize + idx + 1;
					let qddh = item.QDDH;
					let zddh = item.ZDDH;
					let gj = item.GJ;
					let cz = item.CZ;
					let OBJECTID = item.ID;
					data += `<li data="${OBJECTID}" onclick="local('${selectedType}',${OBJECTID})">
                    <a href="javascript:;">
                           <div class="left">${orderNum}</div>
                    <div class="center">
                        <div class="tit">                            	 
                            	 <div class="info-left">#${qddh} -- #${zddh}</div>
                            	 <div class="right">                            	     
                            	         查看视频<img src="${resUrl}/视频.png" alt="查看视频" title="查看视频" onclick="showWellVideo(event)">
                            	     
                            	 </div>
                        </div>
                        <div class="content">
                                
                                <div class="bottom-left"><span class="bottom-name">管径：</span><span class="bottom-info">${gj}</span></div>
                                <div class="bottom-right"><span class="bottom-name">材质：</span><span class="bottom-info">${cz}</span></div>
                        </div>
                    </div>
                    
                    </a>
                </li> `;
				})
			} else {
				$.each(result.data, function(idx, item) {

					let orderNum = (pageIndex - 1) * pageSize + idx + 1;
					let wtdh = item.WTDH;
					let fsw = item.FSW;
					let jgcz = item.JGCZ;
					let OBJECTID = item.ID;
					data += `<li data="${wtdh}"  onclick="local('${selectedType}','${OBJECTID}')">
                    <a href="javascript:;">
                           <div class="left">${orderNum}</div>
                    <div class="center">
                        <div class="tit">
                            	<div class="info-left">管点 #${wtdh}</div>
                            	<div class="right">
                            	   
                            	        查看图片<img data="${wtdh}" class="wellImage" onclick="showWellImage(event)" src="${resUrl}/图片.png" alt="查看图片" title="查看图片">
                            	    
                            	</div>
                        </div>
                        <div class="content">
                                <div class="bottom-left"><span class="bottom-name">附属物：</span><span class="bottom-info">${fsw}</span></div>
                                <div class="bottom-right"><span class="bottom-name">材质：</span><span class="bottom-info">${jgcz}</span></div>
                        </div>
                    </div>
                    
                    </a>
                </li> `;
				});
			}

		}
		data = data === "" ? "<div class='nolist'>暂无数据</div>" : data;
		return data;
	}

	function proToTable(properties, latlng) {
		var type = properties['物探点号'];
		var obj1 = [];
		var obj2 = [];
		var obj3 = [];
		var obj4 = [];
		var arrKey = Object.keys(properties);
		var popInfo = '<div style="padding:19px 0 0 0;box-sizing: border-box;"><div class="pipeName clearfix">';
		if(type == undefined) {
			obj1 = ['管径', '管线性质', '起点点号'];
			obj2 = ['材质', '埋设类型', '终点点号'];
			obj3 = ['OBJECTID', 'SHAPE', '起点埋深', '终点埋深', '起点高程', '终点高程', '沟截面宽高', '探测单位', '探测时间', '压力', '流向'];
			obj4 = ['建设年代', '使用年限', '权属单位', '线型', '探测状态', 'PIPE_LEN', 'ELEMSTIME', 'ELEMETIME', 'SHAPE_Leng', 'SHAPE_Length', '备注'];
			popInfo += `<div class="fl" id="message">管线信息</div><div class="fr"><a href="javascript:;" style="font-size: 10px;">视频接入<img data="${properties['OBJECTID']}" src="${resUrl}/视频.png" alt="视频" onclick="showWellVideo(event)" style="margin: -3px 0 0 3px;;"></a></div></div><div style="padding:0 20px;"><div class="bcgblue"><div class="title"><span>雨水管线#${properties['OBJECTID']}</span><span id="use">${properties['使用状态']}</span></div>`;
		} else {
			obj1 = ['附属物', '井盖材质', '特征点', '管线性质', '井盖规格'];
			obj2 = ['井底深', '井室规格', '井脖高', '井脖规格', '井室角度'];
			obj3 = ['OBJECTID', 'SHAPE', '物探点号', 'X坐标', 'Y坐标', '地面高程', '偏心井位', '井室附属物代码', '图幅号'];
			obj4 = ['图上点号', '图例角度', '探测单位', '探测时间', '建设年代', '生效时间', '失效时间', '权重', '备注'];
			popInfo += `<div class="fl" id="message">管点信息</div><div class="fr"><a href="javascript:;" style="font-size: 10px;">图片查看<img  data="${properties['物探点号']}" src="${resUrl2}/图片.png" alt="图片" onclick="showWellImage(event)" style="margin: -3px 0 0 3px;"></a></div></div><div style="padding:0 20px;"><div class="bcgblue"><div class="title"><span>雨水管点#${properties['OBJECTID']}</span><span id="photocode">井盖照片代码<strong style="font-size:14px;font-weight:normal;margin-left:8px;">${properties['OBJECTID']}</strong></span></div>`;
		}
		popInfo += '<div class="content clearfix"><ul class="fl con-left">' + sort(properties, obj1) +
			'</ul><ul class="fl con-right">' + sort(properties, obj2) +
			'</ul></div><div class="position"><div class="fl"><i class="fa fa-map-marker" aria-hidden="true"></i> 所在道路</div><div class="fr">' + properties['所在道路'] + '</div></div></div></div><div class="list"><ul class="list-left">' + sort(properties, obj3) +
			'</ul><ul class="list-right">' + sort(properties, obj4) + '</ul></div></div>';
		L.popup({
				minWidth: 460
			})
			.setLatLng(latlng)
			.setContent(popInfo)
			.openOn(map);
	}

	function sort(originObj, orderObj) {
		var info = '';
		var temp;
		$.each(orderObj, function(index, e) {
			for(var k in originObj) {
				if(originObj[e] === originObj[k] && e === k) {
					if(k == "探测单位" || k == "权属单位") {
						temp = originObj[k].length < 9 ? originObj[k] : originObj[k].substr(0, 8).concat('...');
					} else if(k.indexOf('时间') != -1 || k.indexOf('TIME') != -1) {
						var time = (new Date(originObj[k])).toLocaleDateString();
						temp = time != 'Invalid Date' ? time : '空';
					} else if(k == "终点高程" || k == "起点埋深" || k == '起点高程' || k == "SHAPE_Length") {

						try {
							temp = originObj[k].toFixed(3);
						} catch(e) {
							temp = originObj[k];
						}
					} else {
						temp = originObj[k];
					}
					info += '<li>' +
						'<span class="cate">' + k + '</span>' +
						'<span class="num" title="' + originObj[k] + '">' + temp + '</span>' +
						'</li>';
				}
			}
		})
		return info;
	}

	function isClass(o) {
		if(o === null) return "Null";
		if(o === undefined) return "Undefined";
		return Object.prototype.toString.call(o).slice(8, -1);
	}

	function deepClone(obj) {
		if(!obj) {
			return null
		}
		let result, oClass = isClass(obj);
		//确定result的类型
		if(oClass === "Object") {
			result = {};
		} else if(oClass === "Array") {
			result = [];
		} else {
			return obj;
		}

		for(let key in obj) {
			if(obj.hasOwnProperty(key)) {
				let copy = obj[key];
				if(isClass(copy) == "Object") {
					result[key] = deepClone(copy); //递归调用
				} else if(isClass(copy) == "Array") {
					result[key] = deepClone(copy);
				} else {
					result[key] = obj[key];
				}
			}
		}
		return result;
	}

	var exp = {
		'GetQueryString': GetQueryString,
		'getList': getList,
		'pageInit': pageInit,
		'getTable': getTable,
		'deepClone': deepClone
	};

	exports('customUtil', exp);
})