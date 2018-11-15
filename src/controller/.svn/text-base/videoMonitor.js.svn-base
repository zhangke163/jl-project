layui.define(function(exports) {
	layui.use(['jquery.ztree.all.min', 'aliplayer-flash-min'], function() {
		var $ = layui.$;

		var gIP = "183.131.146.124"; //演示平台IP
		var gPort = "8888"; //演示平台开发端口
		var gProtocol = "http"; //演示平台接口协议
		var gService = "geapi"; //演示平台接口服务名称

		var uAcc = "zhd@jhsjsj.jhhy.zj.ge"; //演示平台测试账号
		var uPwd = "e10adc3949ba59abbe56e057f20f883e"; //演示平台测试账号密码

		var uID = ""; //用户ID
		var sToken = ''; //用户登陆成功后获取的令牌，用于其他接口调用的验证
		var cameraID = ''; // 当前摄像机ID
		var cameraName = ''; // 当前摄像机名称
		var isLiving = false; // 当前播放状态：false-停止，true-直播中
		var cURL; // 当前直播地址，时效性
		var cPlayer; // 选中播放器
		var cPlayerID; // 选中播放器ID
		var cNode; // 选中播放器关联树节点
		var timeID; // 定时器ID
		var zNodes = [];
		var nodeList = [],
			fontCss = {};
		var myPlayer; // 播放器对象

		// zTree配置
		var setting = {
			data: {
				simpleData: {
					enable: true
				}
			},
			view: {
				fontCss: getFontCss
			},
			callback: {
				beforeDblClick: zBeforeDblClick,
				onClick: zOnClick
			}
		};

		// 用户登陆
		function userLogin() {
			var reqPath = gProtocol + '://' + gIP + ':' + gPort + '/' + gService + '/ge/user/login';
			$.ajax({
				async: false,
				type: 'get',
				url: reqPath,
				data: {
					uaccount: uAcc,
					upwd: uPwd
				}, // 业务应用场景中uid需通过用户登录接口获取
				dataType: "json",
				success: function(data) {
					console.log(data);
					if(data.code == '1') {
						uID = data.data.uid; // 缓存用户ID
						sToken = data.data.token; // 缓存令牌
						console.log(sToken);
						getCamList(); // 登陆成功后，调用获取摄像机列表方法
						$("#uName").text(data.data.uname);
					}

				},
				error: function() {
					alert('Login fail.');
				}
			});

		}
		getCamList();
		// 获取摄像机列表
		function getCamList() {
			var reqPath = gProtocol + '://' + gIP + ':' + gPort + '/' + gService + '/ge/camera/list';
			$.ajax({
				async: false,
				type: 'get',
				url: reqPath,
				data: {
					token: sToken,
					uid: uID
				}, // token与uid需通过用户登录接口获取
				dataType: "json",
				success: function(data) {
					if(data.code == '1') {
						initTree(data.data);
					}
				},
				error: function() {
					alert('Fail to get camera list.');
				}
			});
		}

		// 获取视频直播URL
		function getMediaURL(id, name) {

			if(!id || id.length < 20) {
				return;
			}

			var reqPath = gProtocol + '://' + gIP + ':' + gPort + '/' + gService + '/ge/camera/url.json';

			$.ajax({
				async: false,
				type: 'get',
				url: reqPath,
				data: {
					token: sToken,
					mpid: id
				},
				dataType: "json",
				success: function(data) {
					if(data.code == '1') {
						cameraID = id;
						cameraName = name;
						play(data.data.mediaURL); // 视频播放
					}
				},
				error: function() {
					alert("Fail to get media URL.");
				}
			});

		}

		// 云台控制
		window.ptz = function(action) {
			if(!isLiving || !cameraID || cameraID.length < 20) {
				return;
			}

			var reqPath = gProtocol + '://' + gIP + ':' + gPort + '/' + gService + '/ge/camera/ptz';
			var mid = cameraID;
			var para = $("#sendSound").val();
			$.ajax({
				async: false,
				type: 'get',
				url: reqPath,
				data: {
					token: sToken,
					mpid: mid,
					action: action,
					para: para
				},
				dataType: "json",
				success: function(data) {
					if(data.code != '1') {
						alert("PTZ control fail. ResultCode: " + data.code);
					}
				},
				error: function() {
					alert("REST of PTZ control is fail.");
				}
			});
		}

		// 树列表初始化
		function initTree(vjson) {
			var camStr = '[{"id":"1", "pId":"0", "name":"摄像机列表", "open":"true", "iconSkin":"pIcon01"}';

			var tmp;
			for(var i = 0; i < vjson.length; i++) {

				tmp = ',{"id":"' + vjson[i].mpid + '", "pId":"1", "name":"' + vjson[i].mpname + '", "isL": false , "pNO":"0", "isC": "' + vjson[i].iscontrol;
				if(vjson[i].iscontrol == '1' || vjson[i].iscontrol == '3') {
					if(vjson[i].status == '1') {
						tmp = tmp + '", "status": "1", "iconSkin": "icon01"}';
					} else {
						tmp = tmp + '", "status": "0", "iconSkin": "icon02"}';
					}
				} else {
					if(vjson[i].status == '1') {
						tmp = tmp + '", "status": "1", "iconSkin": "icon04"}';
					} else {
						tmp = tmp + '", "status": "0", "iconSkin": "icon05"}';
					}
				}

				camStr += tmp;
			}

			camStr += ']';

			zNodes = eval("(" + camStr + ")"); // 封装传入zTree的json对象

			$.fn.zTree.init($("#treeview"), setting, zNodes); // zTree初始化

			$("#dosearch").bind("click", searchNode); // 绑定搜索事件
		}

		// 单击事件
		function zOnClick(event, treeId, treeNode) {

			if(!treeNode.isParent) {
				// TODO
			}

		};

		// 双击事件
		function zBeforeDblClick(treeId, treeNode) {

			if(!treeNode.isParent && !treeNode.isL && treeNode.status == '1') {
				cNode = treeNode;
				getMediaURL(treeNode.id, treeNode.name); // 获取视频直播URL
			}
		}

		// 搜索
		function searchNode(e) {
			var zTree = $.fn.zTree.getZTreeObj("treeview");
			var value = $.trim($("#searchkey").val());
			if(value == "") {
				return;
			}
			updateNodeColor(false);
			nodeList = zTree.getNodesByParamFuzzy("name", value);
			updateNodeColor(true);
		}

		// 更新节点图标
		function updateNodeIcon(treeNode, b) {
			var zTree = $.fn.zTree.getZTreeObj("treeview");
			if(b) {
				if(treeNode.isC == "1") {
					treeNode.iconSkin = "icon03";
				} else {
					treeNode.iconSkin = "icon06";
				}
				treeNode.isL = true;
			} else {
				if(treeNode.isC == "1") {
					treeNode.iconSkin = "icon01";
				} else {
					treeNode.iconSkin = "icon04";
				}
				treeNode.isL = false;
			}

			zTree.updateNode(treeNode); //调用updateNode(node)接口进行更新
		}

		// 更新节点关联窗口
		function updateNodeLink(treeNode, n) {
			var iTree = $.fn.zTree.getZTreeObj("treeview");
			treeNode.pNO = n;
			iTree.updateNode(treeNode);
		}

		// 清空节点绑定状态
		function cleanNodes() {
			var zTree = $.fn.zTree.getZTreeObj("treeview");
			var nodes = zTree.getNodesByParam("status", "1");
			for(var i = 0, l = nodes.length; i < l; i++) {
				nodes[i].isL = false;
				nodes[i].pNO = "0";

				if(nodes[i].isC == "1") {
					nodes[i].iconSkin = "icon01";
				} else {
					nodes[i].iconSkin = "icon04";
				}
				zTree.updateNode(nodes[i]);
			}
		}

		// 更新节点字体颜色
		function updateNodeColor(highlight) {
			var zTree = $.fn.zTree.getZTreeObj("treeview");
			for(var i = 0, l = nodeList.length; i < l; i++) {
				nodeList[i].highlight = highlight;
				zTree.updateNode(nodeList[i]);
			}
		}

		// 设置节点字体颜色
		function getFontCss(treeId, treeNode) {
			return(!!treeNode.highlight) ? {
				color: "#A60000",
				"font-weight": "bold"
			} : {
				color: "#333",
				"font-weight": "normal"
			};
		}

		// 视频播放
		function play(oURL) {
			var oContainer = "plugin-container";
			cleanNodes();
			if(myPlayer) {
				myPlayer = null;
				$("#" + oContainer).empty();
			}
			cPlayer = myPlayer = initPlayer(oContainer, oURL);
		}

		// 播放器初始化 —— Aliplayer
		function initPlayer(oContainer, oURL) {
			var oWidth = $("#" + oContainer).width() + 1;
			var oHeight = $("#" + oContainer).height() + 1;
			var oPlayer = new Aliplayer({
				id: oContainer,
				source: oURL,
				autoplay: true,
				width: oWidth + "px",
				height: oHeight + "px",
				showBarTime: 3000,
				isLive: true,
				extraInfo: {
					liveRetry: 1, //直播流中断是否重试
					fullTitle: cameraName
				}
			});

			oPlayer.on("ready", endedHandle);

			oPlayer.on("liveStreamStop", endedHandle);

			oPlayer.on("error", endedHandle);

			oPlayer.on("mousedown", choosePlayer);

			isLiving = true;

			$("#playingT").text(cameraName); // 标题名称更新

			updateNodeLink(cNode, oContainer.substr(oContainer.length - 1, 1)); // 树节点绑定窗口

			updateNodeIcon(cNode, true); // 树节点更新图标状态

			return oPlayer;
		}

		// 结束事件触发
		function endedHandle(oPlayer) {
			oPlayer.play();
		}

		// 准备事件触发
		function autoHandle() {
			if(cPlayer.getStatus() == "ready") {
				cPlayer.play();
				window.clearInterval(timeID);
			}
		}

		// 停止视频直播相关处理
		function stopLive() {
			$("#" + cPlayerID).empty();

			myPlayer = null;

			updateNodeIcon(cNode, false);
			updateNodeLink(cNode, 0); //解绑
			$("#playingT").text("");
			isLiving = false;
		}

		// 开始视频直播相关处理
		function startLive() {
			if(!isLiving && cameraID) {
				getMediaURL(cameraID, cameraName)
			}
		}

		//获取播放器状态：‘init’‘ready’‘loading’‘play’‘pause’‘playing’‘waiting’‘error’‘ended’;
		function getStatus() {
			var ss = myPlayer1 && myPlayer1.getStatus();
		}

		// 选择播放器
		function choosePlayer(oPlayer) {
			$(".player").removeClass("choose");
			cPlayerID = oPlayer.currentTarget.id;
			$("#" + cPlayerID).addClass("choose");
			var n = cPlayerID.substr(cPlayerID.length - 1, 1);
			var iTree = $.fn.zTree.getZTreeObj("treeview");
			cNode = iTree.getNodeByParam("pNO", n, null);
			cameraID = cNode.id;
			cameraName = cNode.name;
			isLiving = cNode.isL;
			$("#playingT").text(cameraName);
		}

		// 恢复直播场景
		function recover() {
			if(isLiving && cameraID) {
				getMediaURL(cameraID, cameraName);
			}
		}

		// 更新播放器窗口大小
		function findDimensions() {
			var oContainer = "container";
			var oWidth;
			var oHeight;

			oWidth = ($("#" + oContainer).width() - 12) + "px";
			oHeight = ($("#" + oContainer).height() - 12) + "px";
			if(myPlayer) {
				myPlayer.setPlayerSize(oWidth, oHeight);
			}
		}

		// 窗口事件调用函数
		window.onresize = findDimensions();

		// 初始化调用
		window.onload = userLogin();

	})
	exports('videoMonitor', {})
})