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

  var selectId = GetQueryString('id');
  var selectLayer = GetQueryString('layer');

  console.log(selectLayer);
  switch (selectLayer) {
    case "yspoint":
    case "wspoint":
      getPointDetail(selectLayer, selectId);
      break;
    case "wsline":
    case "ysline":
      getLineDetail(selectLayer, selectId);
      break;
  }
  //时间转换
  //获得年月日      得到日期oTime  
  function getMyDate(str) {
    var oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen); //最后拼接时间  
    return oTime;
  };
  //补0操作  
  function getzf(num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  }

  function getLineDetail(layername, selectId) {
    $.ajax({ //异步请求返回给后台
      url: global.ip.backUrl + 'guanWang/getById',
      type: 'GET',
      data: {
        'id': selectId,
        'type': layername
      },
      dataType: 'json',
      success: function (data) {
        $('.forms-one').css('display', 'block');
        $('.forms-two').css('display', 'none');
        //这里获取到数据执行显示
        $('#gxxz').val(data.data.gxxz);
        $('#qddh').val(data.data.qddh);
        $('#zddh').val(data.data.zddh);
        $('#qdms').val(data.data.qdms);
        $('#zdms').val(data.data.zdms);
        $('#qdgc').val(data.data.qdgc);
        $('#zdgc').val(data.data.zdgc);
        $('#gj').val(data.data.gj);
        $('#gjmkg').val(data.data.gjmkg);
        $('#cz').val(data.data.cz);
        $('#yl').val(data.data.yl);
        $('#dy').val(data.data.dy);
        $('#zks').val(data.data.zks);
        $('#yyks').val(data.data.yyks);
        $('#dlgs').val(data.data.dlgs);
        $('#lx').val(data.data.lx);
        $('#mslx').val(data.data.mslx);
        $('#buildtime').val(data.data.buildtime);
        $('#synx').val(data.data.synx);
        $('#qsdw').val(data.data.qsdw);
        $('#tdqs').val(data.data.tdqs);
        $('#syzt').val(data.data.syzt);
        $('#szdl').val(data.data.szdl);
        $('#tcdw').val(data.data.tcdw);
        var tcsj = getMyDate(data.data.tcsj);
        $('#tcsj').val(tcsj);
        $('#remark').val(data.data.remark);
        $('#pipeLen').val(data.data.pipeLen);
        $('#elemstime').val(data.data.elemstime);
        $('#shapeLength').val(data.data.shapeLength);
        $('#qz').val(data.data.qz);
        $('#zdgc').val(data.data.zdgc);

      }
    });
  }

  function getPointDetail(layername, selectId) {
    $.ajax({ //异步请求返回给后台
      url: global.ip.backUrl + 'guanWang/getById',
      type: 'GET',
      data: {
        'id': selectId,
        'type': layername
      },
      dataType: 'json',
      success: function (data) {
        $('.forms-one').css('display', 'none');
        $('.forms-two').css('display', 'block');
        $('#wtdh').val(data.data.wtdh);
        $('#gxxz').val(data.data.gxxz);
        $('#xzb').val(data.data.xzb);
        $('#tsdh').val(data.data.tsdh);
        $('#yzb').val(data.data.yzb);
        $('#dmgc').val(data.data.dmgc);
        $('#tzd').val(data.data.tzd);
        $('#fsw').val(data.data.fsw);
        $('#pxjw').val(data.data.pxjw);
        $('#jsfswdm').val(data.data.jsfswdm);
        $('#jgcz').val(data.data.jgcz);
        $('#jggg').val(data.data.jggg);
        $('#jds').val(data.data.jds);
        $('#jsgg').val(data.data.jsgg);
        $('#jbg').val(data.data.jbg);
        $('#jbgg').val(data.data.jbgg);
        $('#jsjd').val(data.data.jsjd);
        $('#jgzpdm').val(data.data.jgzpdm);
        $('#tfh').val(data.data.tfh);
        $('#tljd').val(data.data.tljd);
        $('#szdl').val(data.data.szdl);

      }
    });
  }
});