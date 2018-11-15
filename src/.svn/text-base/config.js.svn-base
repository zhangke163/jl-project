/**

 @Name：全局配置
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL（layui付费产品协议）

 */

layui.define(['laytpl', 'layer', 'element', 'util'], function(exports) {
	exports('setter', {
		container: 'LAY_app' //容器ID
			,
		base: layui.cache.base //记录layuiAdmin文件夹所在路径
			,
		views: layui.cache.base + 'views/' //视图所在目录
			,
		entry: 'index' //默认视图文件名
			,
		engine: '.html' //视图文件后缀名
			,
		pageTabs: false //是否开启页面选项卡功能。单页版不推荐开启

			,
		name: '金华市排水管网智能平台',
		tableName: 'layuiAdmin' //本地存储表名
			,
		MOD_NAME: 'admin' //模块事件名

			,
		debug: true //是否开启调试模式。如开启，接口异常时会抛出异常 URL 等信息

			,
		interceptor: true //是否开启未登入拦截

			//自定义请求字段
			,
		request: {
			tokenName: 'access_token' //自动携带 token 的字段名。可设置 false 不携带。
		}

		//自定义响应字段
		,
		response: {
			statusName: 'code' //数据状态的字段名称
				,
			statusCode: {
				ok: 0 //数据状态一切正常的状态码
					,
				logout: 1001 //登录状态失效的状态码
			},
			msgName: 'msg' //状态信息的字段名称
				,
			dataName: 'data' //数据详情的字段名称
		},
		//IP配置
		ip:{
			imageHref : 'http://122.225.120.146:8082/jhzhps1/portal/assets/well_image/',
			videoSrc : 'http://122.225.120.146:8082/jhzhps1/portal/assets/pipe_video/',
			arcServerUrl : 'http://122.225.120.146:6082/',
			pipeUrl : 'http://192.168.20.125:6080/',
			backUrl : 'http://47.101.159.182:8080/jhzhps-back/',
			baseImgUrl : 'http://47.101.159.182:8080/',
			threeUrl : 'http://122.225.120.146:82/Pipeline/'
		}
		//独立页面路由，可随意添加（无需写参数）
		,
		indPage: [
				'/user/login' //登入页
				, '/user/portal' //系统选择页
				, '/user/reg' //注册页
				, '/user/forget' //找回密码
				, '/template/tips/test' //独立页的一个测试 demo
			]

			//扩展的第三方模块
			,
		extend: [
				'echarts', //echarts 核心包
				'echartsTheme', //echarts 主题
				'html5shiv',
				'leaflet',
				'esri-leaflet',
				'L.Control.BetterScale',
				'L.Control.MousePosition',
				'mouse-position',
				'proj4',
				'proj4leaflet',
				'leaflet-measure',
				'maputil',
				'customUtil',
				'BMap',
				'leaflet.draw',
				'global',
				'wicket',
				'wicket-leaflet',
				'leaflet-touch-helper',
				'expData',
				'nouislider',
				'jquery-migrate',
				'jqprint',
				'leaflet-echarts',
				'echarts.source',
				'nicescroll',
				'jq-ztree',
				'jquery.ztree.all.min',
				'jquery.ztree.exedit',
				'aliplayer-flash-min',
				'videos',
				'viewer',
				'main',
				'leaflet.ChineseTmsProviders',
				'leaflet-ant-path',
				'leaflet.groupedlayercontrol'
			]

			//主题配置
			,
		theme: {
			//内置主题配色方案
			color: [{
					main: '#008df2',
					logo: '#00aaff',
					selected: '#4cc3ff',
					header: '#00aaff',
					alias: '自定义' //自定义
				},{
					main: '#1E9FFF',
					logo: '#1E9FFF',
					selected: '#38B5B4',
					header: '#1E9FFF',
					alias: '海洋蓝' //海洋头
				}, {
					header: '#393D49',
					alias: '经典黑' //经典黑头
				}]

				//初始的颜色索引，对应上面的配色方案数组索引
				//如果本地已经有主题色记录，则以本地记录为优先，除非请求本地数据（localStorage）
				,
			initColorIndex: 0
		}
	});
});