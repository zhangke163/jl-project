layui.define(function (exports) {
    layui.use(['admin', 'table', 'form', 'element', 'global'], function () {
        var table = layui.table,admin = layui.admin,view = layui.view,form = layui.form,$ = layui.$,global = layui.global;
        var layerType = '';
        var pointFieldList = new Array("fsw", "jgcz", "tzd");
        var lineFieldList = new Array("gj", "cz", "mslx");
        var element = layui.element;
        var _blank = "   --";
        //选项卡
        element.on('tab(test)',
            function (data) {
                layerType = $('.layui-tab-title .layui-this')[0].innerHTML;
                refreshCombox(layerType);
            });
        $(function () {
            layerType = $('.layui-tab-title .layui-this')[0].innerHTML;
            refreshCombox(layerType);
        });
        function getLayerName(layerType) {
            switch (layerType) {
                case "污水管井":
                    layerName = "wspoint";
                    break;
                case "污水管线":
                    layerName = "wsline";
                    break;
                case "雨水管井":
                    layerName = "yspoint";
                    break;
                case "雨水管线":
                    layerName = "ysline";
                    break;
            };
            return layerName;
        }

        function refreshCombox(layerType) {
            objList = null;
            targetLayer = null;
            switch (layerType) {
                case "污水管井":
                    objList = pointFieldList;
                    $('#gjform .lens').css('display', 'none');
                    $('#wgjform .lens').css('display', 'none');
                    targetLayer = "wspoint";
                    //污水管井start
                    //方法级渲染
                    table.render({
                        elem: '#sewage-table-pipe',
                        url: global.ip.backUrl + 'guanWang/getList?type=wspoint',
                        cols: [
                            [{
                                checkbox: true,
                                fixed: true
                            }, {
                                field: 'id',
                                title: 'ID',
                                width: 100,
                                sort: true,
                                fixed: true
                            }, {
                                field: 'gxxz',
                                title: '管井性质',
                                width: 100
                            }, {
                                field: 'fsw',
                                title: '附属物',
                                width: 200,
                                templet: function (d) {
                                    return d["fsw"] = d["fsw"] == null ? _blank : d["fsw"];
                                }
                            }, {
                                field: 'tzd',
                                title: '特征点',
                                width: 100,
                                templet: function (d) {
                                    return d["tzd"] = d["tzd"] == null ? _blank : d["tzd"];
                                }
                            }, {
                                field: 'jggg',
                                title: '井盖规格 (mm)',
                                width: 200,
                                templet: function (d) {
                                    return d["jggg"] = d["jggg"] == null ? _blank : d["jggg"];
                                }
                            }, {
                                field: 'jgcz',
                                title: '井盖材质',
                                width: 200,
                                templet: function (d) {
                                    return d["jgcz"] = d["jgcz"] == null ? _blank : d["jgcz"];
                                }
                            }, {
                                field: 'jds',
                                title: '井底深 (m)',
                                width: 200,
                                sort: true,
                                templet: function (d) {
                                    return d["jds"] = d["jds"] == null ? _blank : d["jds"];
                                }
                            }, {
                                field: 'jsgg',
                                title: '井室规格 (mm)',
                                width: 200,
                                templet: function (d) {
                                    return d["jsgg"] = d["jsgg"] == null ? _blank : d["jsgg"];
                                }
                            }, {
                                field: 'jsjd',
                                title: '井室角度 (rad)',
                                width: 200,
                                templet: function (d) {
                                    return d["jsjd"] = d["jsjd"] == null ? _blank : d["jsjd"];
                                }
                            }, {
                                field: 'jbg',
                                title: '井脖高 (mm)',
                                width: 200,
                                sort: true,
                                templet: function (d) {
                                    return d["jbg"] = d["jbg"] == null ? _blank : d["jbg"];
                                }
                            }, {
                                field: 'jbgg',
                                title: '井脖规格 (mm)',
                                width: 200,
                                templet: function (d) {
                                    return d["jbgg"] = d["jbgg"] == null ? _blank : d["jbgg"];
                                }
                            }, {
                                field: 'szdl',
                                title: '所在道路',
                                width: 277,
                                templet: function (d) {
                                    return d["szdl"] = d["szdl"] == null ? _blank : d["szdl"];
                                }
                            }, {
                                field: 'right',
                                align: 'center',
                                toolbar: '#barDemo',
                                fixed: 'right',
                                width: 160
                            }]
                        ],
                        page: true,
                        height: '685px',
                    });
                    break;
                case "污水管线":
                    objList = lineFieldList;
                    $('#gjform .lens').css('display', 'none');
                    $('#wgjform .lens').css('display', 'none');
                    targetLayer = "wsline";
                    //		污水管线start
                    //方法级渲染
                    table.render({
                        elem: '#sewage-table-pipe1',
                        url: global.ip.backUrl + 'guanWang/getList?type=wsline',
                        cols: [
                            [{
                                checkbox: true,
                                fixed: true
                            }, {
                                field: 'id',
                                title: 'ID',
                                width: 100,
                                sort: true,
                                fixed: true
                            }, {
                                field: 'gxxz',
                                title: '管线性质',
                                width: 120
                            }, {
                                field: 'qddh',
                                title: '起始点号',
                                width: 150
                            }, {
                                field: 'zddh',
                                title: '截止点号',
                                width: 150
                            }, {
                                field: 'cz',
                                title: '材质',
                                width: 170,
                                templet: function (d) {
                                    return d["cz"] = d["cz"] == null ? _blank : d["cz"];
                                }
                            }, {
                                field: 'gj',
                                title: '管径 (mm)',
                                width: 200,
                                sort: true,
                                templet: function (d) {
                                    return d["gj"] = d["gj"] == null ? _blank : d["gj"];
                                }
                            }, {
                                field: 'mslx',
                                title: '埋设类型',
                                width: 120,
                                templet: function (d) {
                                    return d["mslx"] = d["mslx"] == null ? _blank : d["mslx"];
                                }

                            }, {
                                field: 'tcsj',
                                title: '附属物',
                                width: 270,
                                templet: function (d) {
                                    return d["tcsj"] = d["tcsj"] == null ? _blank : d["tcsj"];
                                }
                            }, {
                                field: 'szdl',
                                title: '所在道路',
                                width: 350,
                                templet: function (d) {
                                    return d["szdl"] = d["szdl"] == null ? _blank : d["szdl"];
                                }
                            }, {
                                field: 'right',
                                align: 'center',
                                toolbar: '#barDemo',
                                fixed: 'right',
                                width: 160
                            }]
                        ],
                        page: true,
                        height: '685px',
                    });
                    break;
                case "雨水管井":
                    objList = pointFieldList;
                    $('#gjform .lens').css('display', 'none');
                    $('#wgjform .lens').css('display', 'none');
                    targetLayer = "yspoint";
                    //	雨水管井start
                    table.render({
                        elem: '#water-table-pipe',
                        url: global.ip.backUrl + 'guanWang/getList?type=yspoint',
                        cols: [
                            [{
                                checkbox: true,
                                fixed: true
                            }, {
                                field: 'id',
                                title: 'ID',
                                width: 100,
                                sort: true,
                                fixed: true
                            }, {
                                field: 'gxcz',
                                title: '管井性质',
                                width: 100
                            }, {
                                field: 'fsw',
                                title: '附属物',
                                width: 100,
                                templet: function (d) {
                                    return d["fsw"] = d["fsw"] == null ? _blank : d["fsw"];
                                }
                            }, {
                                field: 'tzd',
                                title: '特征点',
                                width: 100,
                                templet: function (d) {
                                    return d["tzd"] = d["tzd"] == null ? _blank : d["tzd"];
                                }
                            }, {
                                field: 'jggg',
                                title: '井盖规格 (mm)',
                                width: 200,
                                templet: function (d) {
                                    return d["jggg"] = d["jggg"] == null ? _blank : d["jggg"];
                                }
                            }, {
                                field: 'jgcz',
                                title: '井盖材质',
                                width: 200,
                                templet: function (d) {
                                    return d["jgcz"] = d["jgcz"] == null ? _blank : d["jgcz"];
                                }
                            }, {
                                field: 'jds',
                                title: '井底深 (m)',
                                width: 200,
                                sort: true,
                                templet: function (d) {
                                    return d["jds"] = d["jds"] == null ? _blank : d["jds"];
                                }
                            }, {
                                field: 'jsgg',
                                title: '井室规格 (mm)',
                                width: 200,
                                templet: function (d) {
                                    return d["jsgg"] = d["jsgg"] == null ? _blank : d["jsgg"];
                                }
                            }, {
                                field: 'jsjd',
                                title: '井室角度 (rad)',
                                width: 200,
                                templet: function (d) {
                                    return d["jsjd"] = d["jsjd"] == null ? _blank : d["jsjd"];
                                }
                            }, {
                                field: 'jbg',
                                title: '井脖高 (mm)',
                                width: 200,
                                templet: function (d) {
                                    return d["jbg"] = d["jbg"] == null ? _blank : d["jbg"];
                                }
                            }, {
                                field: 'jbgg',
                                title: '井脖规格 (mm)',
                                width: 200,
                                templet: function (d) {
                                    return d["jbgg"] = d["jbgg"] == null ? _blank : d["jbgg"];
                                }
                            }, {
                                field: 'szdl',
                                title: '所在道路',
                                width: 350,
                                templet: function (d) {
                                    return d["szdl"] = d["szdl"] == null ? _blank : d["szdl"];
                                }
                            }, {
                                field: 'right',
                                align: 'center',
                                toolbar: '#barDemo',
                                fixed: 'right',
                                width: 160
                            }]
                        ],
                        page: true,
                        height: '685px',
                    });
                    break;
                case "雨水管线":
                    objList = lineFieldList;
                    $('#gjform .lens').css('display', 'none');
                    $('#wgjform .lens').css('display', 'none');
                    targetLayer = "ysline";
                    //		雨水管线start
                    table.render({
                        elem: '#water-table-pipe1',
                        url: global.ip.backUrl + 'guanWang/getList?type=ysline',
                        cols: [
                            [{
                                checkbox: true,
                                fixed: true
                            }, {
                                field: 'id',
                                title: 'ID',
                                width: 100,
                                sort: true,
                                fixed: true
                            }, {
                                field: 'gxxz',
                                title: '管线性质',
                                width: 120
                            }, {
                                field: 'qddh',
                                title: '起始点号',
                                width: 150
                            }, {
                                field: 'zddh',
                                title: '截止点号',
                                width: 150
                            }, {
                                field: 'cz',
                                title: '材质',
                                width: 170,
                                templet: function (d) {
                                    return d["cz"] = d["cz"] == null ? _blank : d["cz"];
                                }
                            }, {
                                field: 'gj',
                                title: '管径 (mm)',
                                width: 200,
                                sort: true,
                                templet: function (d) {
                                    return d["gj"] = d["gj"] == null ? _blank : d["gj"];
                                }
                            }, {
                                field: 'mslx',
                                title: '埋设类型',
                                width: 120,
                                templet: function (d) {
                                    return d["mslx"] = d["mslx"] == null ? _blank : d["mslx"];
                                }
                            }, {
                                field: 'tcsj',
                                title: '附属物',
                                width: 270,
                                templet: function (d) {
                                    return d["tcsj"] = d["tcsj"] == null ? _blank : d["tcsj"];
                                }
                            }, {
                                field: 'szdl',
                                title: '所在道路',
                                width: 350,
                                templet: function (d) {
                                    return d["szdl"] = d["szdl"] == null ? _blank : d["szdl"];
                                }
                            }, {
                                field: 'right',
                                align: 'center',
                                toolbar: '#barDemo',
                                fixed: 'right',
                                width: 160
                            }]
                        ],
                        page: true,
                        height: '685px',
                    });
                    break;
            };
            $.each(objList, function (index, item) {
                var objTarget = null;

                if (layerType === '污水管井') {
                    if (item === 'fsw') {
                        objTarget = $("#sewage-fsw");
                    } else if (item === 'jgcz') {
                        objTarget = $("#sewage-cz");
                    } else if (item === 'tzd') {
                        objTarget = $("#sewage-tzd");
                    }

                } else if (layerType === '雨水管井') {
                    if (item === 'fsw') {
                        objTarget = $("#water-fsw");
                    } else if (item === 'jgcz') {
                        objTarget = $("#water-cz");
                    } else if (item === 'tzd') {
                        objTarget = $("#water-tzd");
                    }
                } else if (layerType === '污水管线') {
                    if (item === 'gj') {
                        objTarget = $("#sewage-gj2");
                    } else if (item === 'cz') {
                        objTarget = $("#sewage-cz2");
                    } else if (item === 'mslx') {
                        objTarget = $("#sewage-mslx2");

                    }
                } else if (layerType === '雨水管线') {
                    if (item === 'gj') {
                        objTarget = $("#water-gj2");
                    } else if (item === 'cz') {
                        objTarget = $("#water-cz2");
                    } else if (item === 'mslx') {
                        objTarget = $("#water-mslx2");
                    }
                }
                var arr = getUniqueValue(targetLayer, item);
                var content = "<option value='' ></option>";
                $.each(arr, function (index, ele) {
                    content += "<option value='" + ele + "' >" + ele + "</option>";
                });
                objTarget.empty().append(content)
            });
            form.render();
        };

        function getUniqueValue(layername, fieldname) {
            var listContent = new Array();
            $.ajax({
                url: global.ip.backUrl + 'guanWang/getComboBox',
                type: "get",
                async: false,
                data: {
                    tableName: layername,
                    column: fieldname
                },
                success: function (res) {
                    var data = res.data || [];
                    if (data.length > 0) {
                        data.forEach(function (item, index) {
                            var value = item[fieldname.toUpperCase()];
                            listContent.push(value);
                        });
                    }
                }
            });
            listContent.sort(compare);
            return listContent;
        }

        function compare(a, b) {
            return a - b;
        }
        //监听工具条
        table.on('tool(sewage-table)', function (obj) {
            var data = obj.data;
            data.layerType = layerType;
            if (obj.event === 'detail') {
                var rowId = data.id;
                layer.open({
                    type: 2,
                    area: ['800px', '650px'],
                    fix: false,
                    resize: false,
                    shade: 0.4,
                    title: '查看详细信息',
                    content: layui.setter.base + 'views/pop/detail.html?id=' + rowId + "&layer=" + getLayerName(layerType)
                });
            } else if (obj.event === 'location') {
                var rowId = data.id;
                layer.open({
                    type: 2,
                    area: ['1200px', '800px'],
                    id: 'LAY-popup-local',
                    title: '地图定位',
                    content: layui.setter.base + 'views/pop/localMap.html?id=' + rowId + "&layer=" + getLayerName(layerType)
                });
            }
        });

        var $ = layui.$,
            active = {
                sewageSearchBtn: function () {
                    if ($('#sewage-cz').val() || $('#sewage-fsw ').val() || $('#sewage-tzd').val() || $('#sewage-szdl').val()) {
                        table.reload('sewage-table-pipe', {
                            where: {
                                'jgcz': $('#sewage-cz').val(),
                                'fsw': $('#sewage-fsw ').val(),
                                'tzd': $('#sewage-tzd').val(),
                                'szdl': $('#sewage-szdl').val()
                            }
                        });
                    } else {
                        //执行重载
                        table.reload('sewage-table-pipe', {
                            page: {
                                curr: 1 //重新从第 1 页开始
                            },
                            where: {
                                'jgcz': "",
                                'fsw': "",
                                'tzd': "",
                                'szdl': ""
                            }
                        });

                    }
                }
            };
        //搜索按钮被点击事件
        $('.sewage-btn .layui-btn').on('click', function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
            return false;
        });
        //污水管井end	

        //监听工具条
        table.on('tool(sewage-table1)', function (obj) {
            var data = obj.data;
            data.layerType = layerType;
            if (obj.event === 'detail') {
                var rowId = data.id;
                layer.open({
                    type: 2,
                    area: ['800px', '650px'],
                    fix: false,
                    resize: false,
                    shade: 0.4,
                    title: '查看详细信息',
                    content: layui.setter.base + 'views/pop/detail.html?id=' + rowId + "&layer=" + getLayerName(layerType)
                });
            } else if (obj.event === 'location') {
                var rowId = data.id;
                layer.open({
                    type: 2,
                    area: ['1200px', '800px'],
                    id: 'LAY-popup-local',
                    title: '地图定位',
                    content: layui.setter.base + 'views/pop/localMap.html?id=' + rowId + "&layer=" + getLayerName(layerType)
                });
            }
        });
        var $ = layui.$,
            active1 = {
                sewageSearchBtn1: function () {
                    $.ajax({
                        url: global.ip.backUrl + 'guanWang/getListSum',
                        type: "get",
                        async: false,
                        data: {
                            'type': 'wsline',
                            'cz': $('#sewage-cz2').val(),
                            'gj': $('#sewage-gj2').val(),
                            'mslx': $('#sewage-mslx2').val(),
                            'szdl': $('#sewage-szdl2').val()
                        },
                        success: function (res) {
                            if (res.data.sum != null) {
                                $('#gjform .lens').css('display', 'block');
                                $('#gjform .lens span').html(res.data.sum);
                            } else {
                                $('#gjform .lens').css('display', 'block');
                                $('#gjform .lens span').html(0);
                            }
                        }
                    });
                    if ($('#sewage-cz2').val() || $('#sewage-gj2').val() || $('#sewage-mslx2').val() || $('#sewage-szdl2').val()) {
                        table.reload('sewage-table-pipe1', {
                            where: {
                                'cz': $('#sewage-cz2').val(),
                                'gj': $('#sewage-gj2').val(),
                                'mslx': $('#sewage-mslx2').val(),
                                'szdl': $('#sewage-szdl2').val()
                            }
                        });
                    } else {
                        //执行重载
                        table.reload('sewage-table-pipe1', {
                            page: {
                                curr: 1 //重新从第 1 页开始
                            },
                            where: {
                                'cz': "",
                                'gj': "",
                                'mslx': "",
                                'szdl': ""
                            }
                        });
                    }
                }
            };
        //搜索按钮被点击事件
        $('.sewage-btn1 .layui-btn').on('click', function () {
            var type = $(this).data('type');
            active1[type] ? active1[type].call(this) : '';
            return false;
        });
        //污水管线end
        //监听工具条
        table.on('tool(water-table)', function (obj) {
            var data = obj.data;
            data.layerType = layerType;
            if (obj.event === 'detail') {
                //	      layer.msg('ID：'+ data.id + ' 的查看操作');
                var rowId = data.id;
                // console.log(rowId);
                layer.open({
                    type: 2,
                    area: ['800px', '650px'],
                    fix: false,
                    resize: false,
                    shade: 0.4,
                    title: '查看详细信息',
                    content: layui.setter.base + 'views/pop/detail.html?id=' + rowId + "&layer=" + getLayerName(layerType)
                });
            } else if (obj.event === 'location') {
                var rowId = data.id;
                layer.open({
                    type: 2,
                    area: ['1200px', '800px'],
                    id: 'LAY-popup-local',
                    title: '地图定位',
                    content: layui.setter.base + 'views/pop/localMap.html?id=' + rowId + "&layer=" + getLayerName(layerType)
                });
            }
        });
        var $ = layui.$,
            active2 = {
                waterSearchBtn: function () {
                    if ($('#water-cz').val() || $('#water-tzd').val() || $('#water-fsw').val() || $('#water-szdl').val()) {
                        table.reload('water-table-pipe', {
                            where: {
                                'jgcz': $('#water-cz').val(),
                                'tzd': $('#water-tzd').val(),
                                'fsw': $('#water-fsw').val(),
                                'szdl': $('#water-szdl').val()
                            }
                        });
                    } else {
                        //执行重载
                        table.reload('water-table-pipe', {
                            page: {
                                curr: 1 //重新从第 1 页开始
                            },
                            where: {
                                'jgcz': "",
                                'tzd': "",
                                'fsw': "",
                                'szdl': ""
                            }
                        });
                    }
                }
            };
        //搜索按钮被点击事件
        $('.water-btn .layui-btn').on('click', function () {
            var type = $(this).data('type');
            active2[type] ? active2[type].call(this) : '';
            return false;
        });
        //雨水管井end
        //监听工具条
        table.on('tool(water-table1)', function (obj) {
            var data = obj.data;
            data.layerType = layerType;
            if (obj.event === 'detail') {
                var rowId = data.id;
                layer.open({
                    type: 2,
                    area: ['800px', '650px'],
                    fix: false,
                    resize: false,
                    shade: 0.4,
                    title: '查看详细信息',
                    content: layui.setter.base + 'views/pop/detail.html?id=' + rowId + "&layer=" + getLayerName(layerType)
                });
            } else if (obj.event === 'location') {
                var rowId = data.id;
                layer.open({
                    type: 2,
                    area: ['1200px', '800px'],
                    id: 'LAY-popup-local',
                    title: '地图定位',
                    content: layui.setter.base + 'views/pop/localMap.html?id=' + rowId + "&layer=" + getLayerName(layerType)
                });
            }
        });
        var $ = layui.$,
            active3 = {
                waterSearchBtn1: function () {
                    $.ajax({
                        url: global.ip.backUrl + 'guanWang/getListSum',
                        type: "get",
                        async: false,
                        data: {
                            'type': 'ysline',
                            'cz': $('#water-cz2').val(),
                            'gj': $('#water-gj2').val(),
                            'mslx': $('#water-mslx2').val(),
                            'szdl': $('#water-szdl2').val()
                        },
                        success: function (res) {
                            if (res.data.sum != null) {
                                $('#wgjform .lens').css('display', 'block');
                                $('#wgjform .lens span').html(res.data.sum);
                            } else {
                                $('#wgjform .lens').css('display', 'block');
                                $('#wgjform .lens span').html(0);
                            }
                        }
                    });
                    if ($('#water-cz2').val() || $('#water-gj2').val() || $('#water-mslx2').val() || $('#water-szdl2').val()) {
                        table.reload('water-table-pipe1', {
                            where: {
                                'cz': $('#water-cz2').val(),
                                'gj': $('#water-gj2').val(),
                                'mslx': $('#water-mslx2').val(),
                                'szdl': $('#water-szdl2').val()
                            }
                        });
                    } else {
                        //执行重载
                        table.reload('water-table-pipe1', {
                            page: {
                                curr: 1 //重新从第 1 页开始
                            },
                            where: {
                                'cz': "",
                                'gj': "",
                                'mslx': "",
                                'szdl': ""
                            }
                        });
                    }
                }
            };
        //搜索按钮被点击事件
        $('.water-btn1 .layui-btn').on('click', function () {
            var type = $(this).data('type');
            active3[type] ? active3[type].call(this) : '';
            return false;
        });
        //		雨水管线end
    });
    exports('pipeManage', {})
})