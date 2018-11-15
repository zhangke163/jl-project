layui.define(function(e) {
	var expData = {};

	var config = {
		/*覆土深度*/
		FTSDStan: [{
				id: "雨水管线",
				stand: "0.6"
			}, {
				id: "污水管线",
				stand: "0.5"
			}]
			//查询要素唯一字段OBJECTID_1 、OBJECTID ****************一定要与要素类中的唯一字段对应
			,
		onlyID: 'OBJECTID' //'OBJECTID_1'
			,
		analysiFields: {
			//"起点埋深"
			startPtBuriedDepth: "起点埋深",
			//"终点埋深"
			endPtBuriedDepth: "终点埋深",
			//"起点高程"
			startPtElevation: "起点高程",
			//"终点高程"
			endPtElevation: "终点高程",
			//"物探点号"
			geophysicalProspecting: "物探点号",
			//"起点点号"
			startPtNum: "起点点号",
			//"终点点号"
			endPtNum: "终点点号",
			//附属物
			appendage: "附属物",
			//"探测时间"
			probeTime: "探测时间",
			//总孔数/管孔总数
			holeCount: "管孔总数",
			//已用孔数
			usedHole: "未用孔数",
			//埋设年代
			inbuiltYear: "埋设年代",
			//地面高程
			groundElevation: "地面高程",
			//建设年代
			buildYear: "建设年代",
			//材质
			material: "材质",
			//权属单位
			ownershipUnits: "权属单位"
		}

	}
	expData['config'] = config;

	//液位计数据
	var yeweiji = {
		"type": "FeatureCollection",
		"features": [{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.62734, 29.09002]
				},
				"properties": {
					"name": "双溪西路/浦江街"
				},
				"id": 1
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.64738, 29.09649]
				},
				"properties": {
					"name": "城南桥监测点"
				},
				"id": 2
			},
			//			{
			//				"type": "Feature",
			//				"geometry": {
			//					"type": "Point",
			//					"coordinates": [119.65774, 29.09293]
			//				},
			//				"properties": {
			//					"name": "金钱寺监测点"
			//				},
			//				"id": 3
			//			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.65947, 29.09768]
				},
				"properties": {
					"name": "婺剧院北检查井液位计"
				},
				"id": 4
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.6672, 29.04868]
				},
				"properties": {
					"name": "东阳街梅溪桥北检查井液位计"
				},
				"id": 5
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.67392, 29.07377]
				},
				"properties": {
					"name": "环城南路东市街检查井液位计"
				},
				"id": 6
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.60823, 29.05869]
				},
				"properties": {
					"name": "金星街G330检查井液位计"
				},
				"id": 7
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.66894, 29.08719]
				},
				"properties": {
					"name": "李渔桥下检查井液位计"
				},
				"id": 8
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.64086, 29.04185]
				},
				"properties": {
					"name": "双鱼南街二环路检查井液位计"
				},
				"id": 9
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.58706, 29.07758]
				},
				"properties": {
					"name": "桐溪污水干管检查井液位计"
				},
				"id": 10
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.65734, 29.09565]
				},
				"properties": {
					"name": "婺剧院南检查井液位计"
				},
				"id": 11
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.68671, 29.11001]
				},
				"properties": {
					"name": "永济桥北桥头检查井液位计"
				},
				"id": 12
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.68459, 29.10768]
				},
				"properties": {
					"name": "永济桥南桥头检查井液位计"
				},
				"id": 13
			}
		]
	}
	expData['yeweiji'] = yeweiji;

	//易涝点数据
	var yilaodian = {
		"type": "FeatureCollection",
		"features": [{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.64848, 29.11823]
				},
				"properties": {
					"id": 1,
					"type": 1,
					"device": 1,
					"name": "八一立交",
					"value": "0.26",
					"paras": {
						"a": 0.1,
						"b": 1.03,
						"c": 66.463
					}
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.67371, 29.12040]
				},
				"properties": {
					"id": 2,
					"type": 1,
					"device": 1,
					"name": "环城东路/丰亭路",
					"value": "0.16",
					"paras": {
						"a": 0.1,
						"b": 1.035,
						"c": 66.788
					}
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.628201, 29.113335]
				},
				"properties": {
					"id": 3,
					"type": 1,
					"device": 1,
					"name": "洪源立交",
					"value": "0.21",
					"paras": {
						"a": 0.15,
						"b": 0.947,
						"c": 61.099
					}
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.67422, 29.11853]
				},
				"properties": {
					"device": 0,
					"name": "东关立交桥下",
					"value": "0.12"
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.695766, 29.12409]
				},
				"properties": {
					"device": 0,
					"name": "康济街公铁立交桥洞口",
					"value": "0.14"
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.648371, 29.122994]
				},
				"properties": {
					"device": 0,
					"name": "北苑立交桥下",
					"value": "0.17"
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.630062, 29.130287]
				},
				"properties": {
					"device": 0,
					"name": "北山路与二环北路交叉口",
					"value": "0.19"
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.592496, 29.079773]
				},
				"properties": {
					"device": 0,
					"name": "宾虹西路铁路立交桥下",
					"value": "0.24"
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.67790, 29.03463]
				},
				"properties": {
					"device": 0,
					"name": "雅畈镇镇政府门口",
					"value": "0.21"
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.61122, 29.10012]
				},
				"properties": {
					"device": 0,
					"name": "乾西乡政府门口路段",
					"value": "0.16"
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.57492, 29.08588]
				},
				"properties": {
					"device": 0,
					"name": "奥林匹克花园正门口",
					"value": "0.27"
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.60052, 29.06490]
				},
				"properties": {
					"device": 0,
					"name": "330国道与八达路交叉口",
					"value": "0.18"
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.65932, 29.12616]
				},
				"properties": {
					"device": 0,
					"name": "金带街和丹光东路交叉口路段",
					"value": "0.2"
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.67282, 29.09324]
				},
				"properties": {
					"device": 0,
					"name": "万达",
					"value": "0.19"
				}
			}

			//坐标未确定数据
			//			, {
			//				"type": "Feature",
			//				"geometry": {
			//					"type": "Point",
			//					"coordinates": [,]
			//				},
			//				"properties": {
			//					"name": "万里扬后门路段"
			//				}
			//			}, {
			//				"type": "Feature",
			//				"geometry": {
			//					"type": "Point",
			//					"coordinates": [,]
			//				},
			//				"properties": {
			//					"name": "婺源区政府后门"
			//				}
			//			}, {
			//				"type": "Feature",
			//				"geometry": {
			//					"type": "Point",
			//					"coordinates": [,]
			//				},
			//				"properties": {
			//					"name": "环城西路火车站至热电厂"
			//				}
			//			}, {
			//				"type": "Feature",
			//				"geometry": {
			//					"type": "Point",
			//					"coordinates": [, ]
			//				},
			//				"properties": {
			//					"name": "白龙桥临江西路"
			//				}
			//			}

		]
	}
	expData['yilaodian'] = yilaodian;

	//泵站数据
	var bengzhan = {
		"type": "FeatureCollection",
		"features": [{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.65754, 29.09278]
				},
				"properties": {
					"name": "金龙湾泵站",
					"value": "0.5"
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.61175, 29.08348]
				},
				"properties": {
					"name": "西关泵站",
					"value": "0.5"
				}
			}
			//			,{
			//				"type": "Feature",
			//				"geometry": {
			//					"type": "Point",
			//					"coordinates": []
			//				},
			//				"properties": {
			//					"name": "公安分局泵站"
			//				}
			//			}
			//			,{
			//				"type": "Feature",
			//				"geometry": {
			//					"type": "Point",
			//					"coordinates": []
			//				},
			//				"properties": {
			//					"name": "立交桥泵站"
			//				}
			//			}
		]
	}
	expData['bengzhan'] = bengzhan;

	//污水处理厂数据
	var wushuichulichang = {
		"type": "FeatureCollection",
		"features": [{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.60070, 29.08195]
				},
				"properties": {
					"name": "秋滨污水处理厂"
				}
			}

		]
	}
	expData['wushuichulichang'] = wushuichulichang;

	//水质监测点
	var shuizhi = {
		"type": "FeatureCollection",
		"features": [{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.59933, 29.08475]
				},
				"properties": {
					"id": 4,
					"type": 2,
					"name": "污水处理厂围墙内",
					"value": {
						"PH": "0",
						"COD": "0",
						"氨氮": "0",
						"总磷": "0",
						"总氮": "0"
					}
				}
			}

		]
	}
	expData['shuizhi'] = shuizhi;
	//流量监测点
	var liuliang = {
		"type": "FeatureCollection",
		"features": [{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [119.61340, 29.09357]
			},
			"properties": {
				"id": 5,
				"type": 3,
				"name": "今飞集团门口",
				"value": "5"
			}
		}]
	}
	expData['liuliang'] = liuliang;
	e('expData', expData);
	
	
	//干网图中涉及的几个点
	
	//泵站数据
	var gw_bz = {
		"type": "FeatureCollection",
		"features": [{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.66261, 29.08948]
				},
				"properties": {
					"name": "金龙湾泵站",
					"value": "0.5"
				}
			}, {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.61637, 29.08031]
				},
				"properties": {
					"name": "西关泵站",
					"value": "0.5"
				}
			}
		]
	}
	expData['gw_bz'] = gw_bz;

	//污水处理厂数据
	var gw_wscl = {
		"type": "FeatureCollection",
		"features": [{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [119.60584, 29.07772]
				},
				"properties": {
					"name": "秋滨污水处理厂"
				}
			}

		]
	}
	expData['gw_wscl'] = gw_wscl;

});