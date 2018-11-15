//Demo
layui.use(['form', 'global'], function () {
  var $ = layui.$,
    form = layui.form,
    global = layui.global;

  //监听提交
  form.on('submit(formDemo)', function (data) {
    layer.msg(JSON.stringify(data.field));
    return false;
  });

  /*传参*/
  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
      return unescape(r[2]);
    return null;
  }
  //获取用户角色
  $.ajax({
    url: global.ip.backUrl + 'role/getList',
    type: 'GET',
    data: '',
    async: false,
    dataType: 'json',
    success: function (data) {
      //这里获取到数据执行显示
      $.each(data.data, function (index, value) {
        var roleHtml = '<option value="' + value.id + '">' + value.name + '</option>';
        $('#role').append(roleHtml);
        form.render(null, 'formDemo');
      })
    },
    error: function (data) {
      console.log(data.msg);
    }
  });
  var selectId = GetQueryString('id');
  $.ajax({ //异步请求返回给后台
    url: global.ip.backUrl + 'user/getById',
    type: 'GET',
    data: {
      'userId': selectId
    },
    dataType: 'json',
    success: function (data) {
      form.val("formDemo", {
        "username": data.data.username,
        "department": data.data.department,
        "mobile": data.data.mobile,
        "realName": data.data.realName,
        "gender": data.data.gender,
        "age": data.data.age
      });
      $('#role').val(data.data.role);
      form.render();
    }
  });
  //确认按钮的点击事件
  $('#confirmBtn').click(function () {
    var username = $('#username');
    var department = $('#department option:selected');
    var roleName = $('#role option:selected');
    var mobile = $('#mobile');
    var realName = $('#realName');
    var gender = $('#gender');
    var age = $('#age');
    $.ajax({ //异步请求返回给后台
      url: global.ip.backUrl + 'user/update',
      type: 'POST',
      data: {
        'userId': selectId,
        'mobile': mobile.val(),
        'gender': gender.val(),
        'realName': realName.val(),
        'age': age.val(),
        'department': department.val(),
        'role': roleName.val()
      },
      dataType: 'json',
      success: function (data) {
        console.log(data.msg);
        parent.layui.table.reload('data_table');
      }
    });
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index);

  })
  $('#clearBtn').click(function () {
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index);
  })
});