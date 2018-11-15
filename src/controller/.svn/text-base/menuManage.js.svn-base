layui.define(function (exports) {
	layui.use(['jq-ztree', 'jquery.ztree.all.min', 'jquery.ztree.exedit', 'global','nicescroll'], function () {
		var global = layui.global;
		var treeObj = null;
		var setting = {
			view: {
				addHoverDom: addHoverDom,
				removeHoverDom: removeHoverDom,
				selectedMulti: false
			},
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: true,
				 showRenameBtn: false
			},
			data: {
				simpleData: {
					enable: true
				},
				key: {
					children: 'list',
					name: 'title',
				}
			},
			callback: {
				beforeDrag: beforeDrag,
				// beforeEditName: beforeEditName,
				beforeRemove: zTreeBeforeRemove,
				// beforeRename: beforeRename,
				onRemove: onRemove,
				// onRename: onRename
			}
		};

		var zNodes =[
			{ id:1, pId:0, name:"parent node 1", open:true},
			{ id:11, pId:1, name:"leaf node 1-1"},
			{ id:12, pId:1, name:"leaf node 1-2"},
			{ id:13, pId:1, name:"leaf node 1-3"},
			{ id:2, pId:0, name:"parent node 2", open:true},
			{ id:21, pId:2, name:"leaf node 2-1"},
			{ id:22, pId:2, name:"leaf node 2-2"},
			{ id:23, pId:2, name:"leaf node 2-3"},
			{ id:3, pId:0, name:"parent node 3", open:true },
			{ id:31, pId:3, name:"leaf node 3-1"},
			{ id:32, pId:3, name:"leaf node 3-2"},
			{ id:33, pId:3, name:"leaf node 3-3"}
		];
		var log, className = "dark";
		function beforeDrag(treeId, treeNodes) {
			return false;
		}
		function beforeEditName(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("menutree");
			zTree.selectNode(treeNode);
			setTimeout(function() {
				if (confirm("Start node '" + treeNode.name + "' editorial status?")) {
					setTimeout(function() {
						zTree.editName(treeNode);
					}, 0);
				}
			}, 0);
			return false;
		}
		function beforeRemove(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("menutree");
			zTree.selectNode(treeNode);
			return false;
		}
		function zTreeBeforeRemove(treeId, treeNode) {
	      var zTree = $.fn.zTree.getZTreeObj("menutree");
	      layer.confirm("确认删除 " + treeNode.title + " 菜单吗？", {btn: ['确定', '取消']},
	        function (index) {//确定
	                //手动移除节点
	                zTree.removeNode(treeNode);
	                layer.close(index);
	        },
	        function (index) {//取消
	          layer.close(index);
	        });
	      //注意：返回false便不会触发onRemove事件
	      return false;
	    }
		function onRemove(e, treeId, treeNode) {
			showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
		}
		function beforeRename(treeId, treeNode, newName, isCancel) {
			className = (className === "dark" ? "":"dark");
			showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
			if (newName.length == 0) {
				setTimeout(function() {
					var zTree = $.fn.zTree.getZTreeObj("menutree");
					zTree.cancelEditName();
					alert("Node name can not be empty.");
				}, 0);
				return false;
			}
			return true;
		}
		function onRename(e, treeId, treeNode, isCancel) {
			showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
		}
		function showRemoveBtn(treeId, treeNode) {
			return !treeNode.isFirstNode;
		}
		function showRenameBtn(treeId, treeNode) {
			return !treeNode.isLastNode;
		}
		function showLog(str) {
			if (!log) log = $("#log");
			log.append("<li class='"+className+"'>"+str+"</li>");
			if(log.children("li").length > 8) {
				log.get(0).removeChild(log.children("li")[0]);
			}
		}
		function getTime() {
			var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
			return (h+":"+m+":"+s+ " " +ms);
		}

		var newCount = 1;
		function addHoverDom(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='新增菜单' onfocus='this.blur();'></span>";
			sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", function(){  
				
				layer.open({
					type: 2,
					area: ['520px', '270px'],
					title: '弹出窗',
					shade: false,
					//			        maxmin: true,
					fix: false,
					resize: true,
					shade: 0.4,
					title: '新增菜单',
					content: layui.setter.base + 'views/pop/addMenu.html',
				});
				window.aa=function(names,jumps){
					var zTree = $.fn.zTree.getZTreeObj("menutree");
					var data = {id:(100 + newCount), pId:treeNode.tId, title:names,jump:'/'+jumps}
					zTree.addNodes(treeNode, data);
				}
				return false;
			});
		};
		
		function removeHoverDom(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};
//		function selectAll() {
//			var zTree = $.fn.zTree.getZTreeObj("menutree");
//			zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
//		}
		$(document).ready(function(){
			$.ajax({
				url: global.ip.backUrl + 'role/getAuthByRoleId?roleId=10001',
				success: function (res) {
					var anthJson = $.parseJSON('{"data":' + res.data.auth + "}");
					treeObj = $.fn.zTree.init($("#menutree"), setting, anthJson.data);
//					$("#selectAll").bind("click", selectAll);
				}
			});
			$("#addParent").bind("click", {isParent:true}, add);
		});
		function add(e) {
			var zTree = $.fn.zTree.getZTreeObj("menutree"),
			isParent = e.data.isParent,
			nodes = zTree.getSelectedNodes(),
			treeNode = nodes[0];
			if (treeNode) {
				treeNode = zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.tId, isParent:isParent, title:"新菜单" + (newCount++)});
			} else {
				treeNode = zTree.addNodes(null, {id:(100 + newCount), pId:0, isParent:isParent, title:"新菜单" + (newCount++)});
			}
			if (treeNode) {
				zTree.editName(treeNode[0]);
			} else {
				alert("Leaf node is locked and can not add child node.");
			}
		};
		//保存菜单
		   $('#saveBtn').click(function () {
//		   	$('.button-box button:nth-child(2)').css('background','pink');
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
		 	console.log(data1)
		 	$.ajax({
		 	  url: global.ip.backUrl + 'role/updateRoles',
		 	  type: 'post',
		 	  data: {
		 		roles: data1
		 	  },
		 	  success: function (res) {
		 	  	console.log(res);
		 		if (res.msg == "success" && res.count == 1) {
		 		  layer.msg('保存成功！', {
		 			icon: 1,
		 			time: 1000
		 		  })
		 		}
		 	  }
		 	})
		   })
		   function filterNodes(nodeArr) {
		   	console.log(nodeArr);
		 	nodeArr.forEach(function (item, index) {
		 		console.log(item);
		 	  nodeArr[index] = {}
		 	  nodeArr[index].name = item.name ? item.name : "";
		 	  nodeArr[index].title = item.title ? item.title : "";
		 	  nodeArr[index].jump = item.jump ? item.jump : "";
		 	  nodeArr[index].icon = item.icon ? item.icon : "";
		 	  if (item.checked) {
		 		nodeArr[index].checked = item.checked;
		 	  }
		 	  if (item.isParent) {
		 		nodeArr[index].list = item.list;
//		 		nodeArr[index].icon = "layui-icon-component";
		 		filterNodes(nodeArr[index].list);
		 	  }
		 	});
		   }
		   //重置菜单
		   $('#reset').click(function(){
		   	$.ajax({
				url: global.ip.backUrl + 'role/getAuthByRoleId?roleId=10001',
				success: function (res) {
					var anthJson = $.parseJSON('{"data":' + res.data.auth + "}");
					treeObj = $.fn.zTree.init($("#menutree"), setting, anthJson.data);
				}
			});
		   })
	})
	exports('menuManage', {})
})