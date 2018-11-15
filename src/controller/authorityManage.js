layui.define(function (exports) {
    layui.use(['layer', 'global', 'table', 'form'], function () {
        var layer = layui.layer,
            global = layui.global,
            $ = layui.$,
            table = layui.table,
            form = layui.form;
        form.on('submit(addRole)', function (formData) {
            layer.confirm('确定提交', function (index) {
                var role_name = $('#name').val();
                $.ajax({
                    url: global.ip.backUrl + 'role/create',
                    type: 'post',
                    data: formData.field,
                    success: function (res) {
                        console.log(res);
                        var ids = res.data.id;
                        if (res.count == 1) {
                            layer.msg('添加成功！', {
                                icon: 1,
                                time: 2000
                            }, function () {
                                $.ajax({
                                    url: global.ip.backUrl + 'role/getList',
                                    success: function (res) {
                                        var roleArr = res.data;
                                        //									$("#role").empty().append($(`<option title="请选择角色" value="">请选择角色</option>`));
                                        roleArr.forEach(function (item) {
                                            $("#role").append($(`<option title="${item.instruction}" value="${item.id}">${item.name}</option>`));
                                        })
                                        $("#instruction").val('');
                                        $("#name").val('');
                                        $("#role").val(ids);
                                        $('#authTree').css('display', 'block');
                                        $('#limits-box').css('display', 'block');
                                        form.render();
                                        layer.closeAll();
                                        layui.table.reload('roleTable');
                                    }
                                })
                            });

                        }
                    }
                });
            });
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        table.render({
            elem: '#roleTable',
            url: global.ip.backUrl + 'role/getList',
            where: {
                'status': '3'
            },
            page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
                    ,
                first: false //不显示首页
                    ,
                last: false //不显示尾页
                    ,
                theme: '#0095ff'

            },
            width: '100%',
            cols: [
                [{
                    field: 'id',
                    title: '角色编号',
                    width: 200
                }, {
                    field: 'name',
                    title: '角色名称',
                    width: 650
                }, {
                    field: 'instruction',
                    title: '角色描述',
                    width: 650
                }, {
                    align: 'center',
                    title: '操作',
                    fixed: 'right',
                    toolbar: '#barDemo',
                    width: 178
                }]
            ]

        });

        //收缩和展开左侧菜单栏，延迟200ms执行重新渲染表格的操作
        $('#LAY_app_flexible').click(function (event) {
            setTimeout(function () {
                table.render({
                    elem: '#roleTable',
                    url: global.ip.backUrl + 'role/getList',
                    where: {
                        'status': '5'
                    },
                    page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                        layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'] //自定义分页布局
                            ,
                        first: false //不显示首页
                            ,
                        last: false //不显示尾页
                            ,
                        theme: '#0095ff'
                    },
                    cols: [
                        [{
                            field: 'id',
                            title: '角色编号',
                            width: 200
                        }, {
                            field: 'name',
                            title: '角色名称',
                            width: 650
                        }, {
                            field: 'instruction',
                            title: '角色描述',
                            width: 650
                        }, {
                            align: 'center',
                            title: '操作',
                            fixed: 'right',
                            toolbar: '#barDemo',
                            width: 178
                        }]
                    ]

                });
            }, 200)
        });
        //监听工具条
        table.on('tool(roleTable)', function (obj) {
            console.log(999);
            console.log(obj);
            var data = obj.data;
            var rowName = obj.data.name;
            var rowId = data.id;
            if (obj.event === 'del') {
                layer.confirm('是否确认删除'+rowName+'?', function (index) {
                    $.ajax({
                        url: global.ip.backUrl + 'role/del',
                        type: 'GET',
                        data: {
                            'roleId': rowId
                        },
                        dataType: 'json',
                        success: function (data) {
                            layer.msg('删除成功!', {
                                icon: 1
                            });
                            obj.del();
                            layer.close(index);

                        },
                        error: function (data) {
                            console.log(data.msg);
                        }
                    });
                });
            } else if (obj.event === 'edit') {
                // layer.alert('编辑行：<br>'+ JSON.stringify(data))
                layer.open({
                    type: 2,
                    area: ['518px', '625px'],
                    fix: false,
                    resize: false,
                    shade: 0.4,
                    title: '信息编辑',
                    content: layui.setter.base + 'views/pop/roleDetail.html?id=' + rowId
                });
            }
        });
        $('.test-table-operate-btn .layui-btn').on('click', function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    });

    exports('authorityManage', {})
})