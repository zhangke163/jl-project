layui.use(['layer', 'form', 'global',], function () {
  var layer = layui.layer,
    form = layui.form,
    global = layui.global;
  var treeObj = null;
  $('#treeDemo').niceScroll({
				cursorcolor: "#ccc", //滚动条的颜色
				cursoropacitymax: 1, //滚动条的透明度，从0-1
				touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
				cursorwidth: "5px", //滚动条的宽度
				cursorborder: "0", // 游标边框css定义
				cursorborderradius: "5px", //以像素为光标边界半径  圆角
				//autohidemode最好设置为true，这样切换的时候会自动隐藏滚动条
				autohidemode: true, //是否隐藏滚动条  true的时候默认不显示滚动条，当鼠标经过的时候显示滚动条
				zindex: "auto", //给滚动条设置z-index值
				railpadding: {
					top: 0,
					right: 0,
					left: 0,
					bottom: 0
				} //滚动条的位置
			});
  /*传参*/
  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
      return unescape(r[2]);
    return null;
  }
  var selectId = GetQueryString('id');
  $.ajax({ //异步请求返回给后台
    url: global.ip.backUrl + 'role/getAuthByRoleId',
    type: 'GET',
    data: {
      'roleId': selectId
    },
    dataType: 'json',
    success: function (res) {
      $('#rolename').val(res.data.name);
      $('#roledetail').val(res.data.instruction);
      var anthJson = $.parseJSON('{"data":' + res.data.auth + "}");
      treeObj = $.fn.zTree.init($("#treeDemo"), setting, anthJson.data);
    }
  });
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
  $(document).ready(function () {
    // 初始化树
    // $.ajax({
    //     url: global.ip.backUrl + 'role/getAuthByRoleId?roleId=10001',
    //     success: function (res) {
    //         var anthJson = $.parseJSON('{"data":' + res.data + "}");
    //         treeObj = $.fn.zTree.init($("#treeDemo"), setting, anthJson.data);
    //     }
    // });
  });
  //保存按钮
  $('#saveBtn').click(function () {
    var names = $('#rolename').val();
    var instructions = $('#roledetail').val();
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
        id: selectId,
        name:names,
        instruction:instructions,
        auth: data1
      },
      success: function (res) {
        if (res.msg == "success" && res.count == 1) {
          layer.msg('保存成功！', {
            icon: 1,
            time: 1000
          },function(){
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
            parent.layui.table.reload('roleTable'); 
          })
        }
      }
    })
  })
  function filterNodes(nodeArr) {
    nodeArr.forEach(function (item, index) {
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
        console.log(nodeArr[index].icon);
        if(nodeArr[index].icon === ''){
        	nodeArr[index].icon = "operation";
        }
//      nodeArr[index].icon = "layui-icon-component";
        filterNodes(nodeArr[index].list);
      }
    });
  }

})