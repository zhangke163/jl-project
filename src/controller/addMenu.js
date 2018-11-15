layui.use(['layer', 'form', 'global'], function () {
  var layer = layui.layer,
    form = layui.form,
    global = layui.global;
  var treeObj = null;
  /*传参*/
  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
      return unescape(r[2]);
    return null;
  }
  var selectId = GetQueryString('id');
  //保存按钮
  $('#saveBtn').click(function () {
    	var names= $('#rolename').val();
    	var jumps= $('#roledetail').val();
          layer.msg('保存成功！', {
            icon: 1,
            time: 1000
          },function(){
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            console.log(parent)
            parent.aa(names,jumps);
            parent.layer.close(index); //再执行关闭
          })
  })

})