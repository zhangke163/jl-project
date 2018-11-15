layui.define(function (exports) {
    layui.use(['echarts', 'form', 'global', 'table', 'jquery-migrate', 'jqprint','laydate'], function () {
    	var $ = layui.$,
            echarts = layui.echarts,
            form = layui.form,
            table = layui.table,
            jqprint = layui.jqprint,
            global = layui.global,
            laydate = layui.laydate;
        function checkTime(time) { //校验时间,小于10前面加0
            if (time < 10) return "0" + time;
            return time;
        }

        function checkTime(time) { //校验时间,小于10前面加0
            if (time < 10) return "0" + time;
            return time;
        }
        //当从其他页面跳转到此页面时，清除已存在定时器timer
        if (window.timer) {
            window.clearInterval(window.timer)
        }

        window.timer = setInterval(function () {
            var date = new Date();
            //显示时分秒
            $("#time").html(checkTime(date.getHours()) + ":" + checkTime(date.getMinutes()) + ":" + checkTime(date.getSeconds()));
        }, 1000)
        //路线地点启动后选项更新以及目标选择
        if ($('.select-tab-btn > div').index() == 1) {
            initRouteList();
        } else {
            initSiteList();
        }
        $('.select-tab-btn > div').click(function () {
            var _this = $(this);
            var _index = _this.index();
            _this.addClass('active').siblings().removeClass('active');
            _this.parent().next().children('.new-input').hide().eq(_index).show();
            if (_index == 1) { //路线
                initRouteList();
            } else { //地点
                initSiteList();
            }
        });

        function initRouteList() {
            $.ajax({
                url: global.ip.backUrl + 'checkLines/getList?limit=-1',
                async: false,
                success: function (res) {
                    var data = res.data || [];
                    var opt = `<option value="" ></option>`;
                    if (data.length > 0) {
                        data.forEach(function (item) {
                            opt += `<option value="${item.id}" >${item.name}</option>`;
                        })
                    }
                    $('#Search').empty().append(opt);
                    form.render('select');
                }
            });
        }

        function initSiteList() {
            $.ajax({
                url: global.ip.backUrl + 'location/getList.json?limit=-1',
                async: false,
                success: function (res) {
                    var data = res.data || [];
                    var opt = `<option value="" ></option>`;
                    if (data.length > 0) {
                        data.forEach(function (item) {
                            opt += `<option value="${item.id}" >${item.name}</option>`;
                        })
                    }
                    $('#Search').empty().append(opt);
                    form.render('select');
                }
            });
        }
        //巡查员获取
        var yhyId;
        var xcyId;
        $.ajax({
            url: global.ip.backUrl + 'role/getList',
            type: 'GET',
            data: '',
            async: false,
            dataType: 'json',
            success: function (data) {
                //这里获取到数据执行显示
                $.each(data.data, function (index, value) {
                    if (value.name == '巡查员') {
                        yhyId = value.id;
                    } else if (value.name == '养护员') {
                        xcyId = value.id;
                    }
                });
            },
            error: function (data) {
                console.log(data.msg);
            }
        });

        $.ajax({
            url: global.ip.backUrl + 'user/summaryQuery',
            type: 'GET',
            data: {
                'roleId': yhyId
            },
            dataType: 'json',
            success: function (data) {
                //这里获取到数据执行显示
                console.log(data.data);
                $.each(data.data, function (index, value) {
                    var peoplesHtml = `<option value='${value.id}'>${value.name}</option>`;
                    console.log(peoplesHtml);
                    $('#peoples').append(peoplesHtml);
                    form.render();
                });
            },
            error: function (data) {
                console.log(data.msg);
            }
        });
        //			var xData = ['2018/06/01', '2018/06/02', '2018/06/03', '2018/06/04', '2018/06/05', '2018/06/06', '2018/06/07'];
        var xData = [];
        var qxData = [];
        var dlData = [];
        var qtData = [];
        $.get(global.ip.backUrl + 'task/statisticsWeek', function (data) {
            console.log(data);
            $.each(data.data, function (index, value) {
                console.log(value.reportTime); //日期
                console.log(value['管网养护']); //管线养护
                console.log(value['道路养护']); //道路养护
                console.log(value['其他']); //其他
                //具体内容
                xData.push(value.reportTime);
                qxData.push(value['管网养护']);
                dlData.push(value['道路养护']);
                qtData.push(value['其他']);
                // alreadyData.push(value.issue);
                // waitData.push(value.unIssue);

            })

            option = {
                title: {
                    text: "一周任务情况",
                    x: "center",
                    textStyle: {
                        color: '#323232',
                        fontSize: '18'
                    }
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                        textStyle: {
                            color: "#fff"
                        }

                    },
                },
                grid: {
                    show: false,
                    containLabel: true,
                    left: 70,
                    right: 48,
                    top: 80,
                    bottom: 25,
                    textStyle: {
                        color: "#fff"
                    }
                },
                legend: {
                    x: 'center',
                    top: 30,
                    textStyle: {
                        color: '#323232',
                        fontSize: 14
                    },
                    data: ['管线养护', '道路养护', '其他']
                },
                // calculable: true,
                xAxis: [{
                    type: "category",
                    axisLine: {
                        lineStyle: {
                            color: '#888888'
                        }
                    },
                    splitLine: {
                        "show": false
                    },
                    axisTick: {
                        "show": false
                    },
                    splitArea: {
                        "show": false
                    },
                    axisLabel: {
                        interval: 0,
                    },
                    data: xData,
                }],
                yAxis: [{
                    type: "value",
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#888888'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0,
                        show: false
                    },
                    splitArea: {
                        show: false
                    },

                }],
                dataZoom: [{
                    show: false,
                }, {
                    type: "inside",
                    show: true,
                    height: 15,
                    start: 1,
                    end: 35
                }],
                series: [{
                    name: "管线养护",
                    type: "bar",
                    stack: "总量",
                    itemStyle: {
                        normal: {
                            color: '#00aaff',
                            label: {
                                show: true,
                                textStyle: {
                                    color: "#ffffff"
                                },
                                position: "insideBottom"
                            }
                        }
                    },
                    data: []
                }, {
                    name: "道路养护",
                    type: "bar",
                    stack: "总量",
                    barWidth: '50%',
                    barGap: "10%",
                    itemStyle: {
                        normal: {
                            color: '#03b373',
                            label: {
                                show: true,
                                textStyle: {
                                    color: "#fff"
                                },
                                position: "insideBottom"
                            }
                        }
                    },
                    data: [],
                }, {
                    name: "其他",
                    type: "bar",
                    stack: "总量",
                    barWidth: '50%',
                    barGap: "10%",
                    itemStyle: {
                        normal: {
                            color: '#d4dad8',
                            label: {
                                show: true,
                                textStyle: {
                                    color: "#fff"
                                },
                                position: "insideBottom"
                            }
                        }
                    },
                    data: [],
                }]
            }
            var task_type = $('#task_type');
            $(task_type[0]).css('height', '351px');
            var echarts_task = echarts.init(task_type[0], layui.echartsTheme);

            echarts_task.setOption(option);
            echarts_task.setOption({
                series: [{
                    data: qxData
                }, {
                    data: dlData
                }, {
                    data: qtData
                }]
            });
            window.onresize = echarts_task.resize;
        })
        form.render(null, 'search-form');
        //监听提交
        form.on('submit(formDemo)', function (data) {
            return false;
        });
        //执行一个laydate实例
        laydate.render({
            elem: '#date' //指定元素
                ,
            range: true
        });

        table.render({
            elem: '#data_table',
            url: global.ip.backUrl + 'task/getList',
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
                    field: 'taskId',
                    title: '任务编号',
                    width: 100
                }, {
                    field: 'reportTime',
                    title: '上报时间',
                    width: 200
                }, {
                    field: 'siteName',
                    title: '地点/路线',
                    width: 600
                }, {
                    field: 'detail',
                    title: '详情',
                    width: 350
                }, {
                    field: 'userName',
                    title: '巡检员',
                    width: 200
                }, {
                    field: 'status',
                    title: '状态',
                    width: 200
                }, {
                    field: 'dataValue',
                    title: '操作',
                    toolbar: '#table_btn',
                    width: 178,
                    fixed: 'right'
                }]
            ]

        });

        //监听工具条
        table.on('tool(data_table)', function (obj) {
            var data = obj.data;
            if (obj.event === 'details') {
                var rowId = data.taskId;
                layer.open({
                    type: 2,
                    area: ['1200px', '565px'],
                    title: '弹出窗',
                    shade: false,
                    fix: false,
                    resize: false,
                    shade: 0.4,
                    title: '任务编号为' + rowId + '的任务详情',
                    content: layui.setter.base + 'views/pop/lookupPop.html?id=' + rowId
                });
            }
        });

        //收缩和展开左侧菜单栏，延迟200ms执行重新渲染表格的操作
        $('#LAY_app_flexible').click(function (event) {
            setTimeout(function () {
                table.render({
                    elem: '#data_table',
                    url: global.ip.backUrl + 'task/getList',
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
                            field: 'taskId',
                            title: '任务编号',
                            width: 100
                        }, {
                            field: 'reportTime',
                            title: '上报时间',
                            width: 200
                        }, {
                            field: 'siteName',
                            title: '地点/路线',
                            width: 600
                        }, {
                            field: 'detail',
                            title: '详情',
                            width: 350
                        }, {
                            field: 'userName',
                            title: '巡检员',
                            width: 200
                        }, {
                            field: 'status',
                            title: '状态',
                            width: 200
                        }, {
                            field: 'dataValue',
                            title: '操作',
                            toolbar: '#table_btn',
                            width: 178,
                            fixed: 'right'
                        }]
                    ]

                });
            }, 200)
        });
	var datas = '',beginTime = '',endTime = '',siteNames = '',userNames = '',statuss = '',sname = '',users = '',tatus = '';
        //查询功能
        var active = {
            taskSearchBtn: function () {
                //获取输入框的值
                datas = $('#date');
                beginTime = datas.val().substring(0, 10);
                endTime = datas.val().substring(13);
                siteNames = $('#Search option:selected');
               userNames = $('#peoples option:selected');
               statuss = $('#finished option:selected');

                sname = siteNames.val();
                users = userNames.val();
                tatus = statuss.val();
                if (beginTime || endTime || siteNames.val() || userNames.val() || statuss.val()) {
                    var index = layer.msg('查询中，请稍候...', {
                        icon: 16,
                        time: false,
                        shade: 0
                    });
                    setTimeout(function () {
                        table.reload('data_table', {
                            where: {
                                'beginTime': beginTime,
                                'endTime': endTime,
                                'siteId': siteNames.val(),
                                'userId': userNames.val(),
                                'status': statuss.val()
                            }
                        });
                        layer.close(index);
                    }, 800);

                } else {
                    //执行重载
                    table.reload('data_table', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        },
                        where: {
                            'beginTime': "",
                            'endTime': "",
                            'siteId': "",
                            'userId': "",
                            'status': ""
                        }
                    });

                }
            }
        };
        //查询按钮被点击事件
        $('.task-btn .layui-btn').on('click', function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });

        function print() {
            var titleP = `<h2 style='text-align: center;'>任务统计列表</h2>`;
            $("#tableP").prepend(titleP);
            $("#tableP").jqprint();
            $("#tableP h2").remove();
        }
        $('#print').click(function () {
            print();
        })
        //最开始导出
        function exports1(beginTime, endTime, sname, tatus, users) {
            let data = (beginTime || endTime || sname || tatus || users) ? '?beginTime=' + beginTime + '&endTime=' + endTime + '&siteId=' + sname + '&status=' + tatus + '&userId=' + users : '';
            window.location.href = global.ip.backUrl + 'task/exportTask' + data;
        }
        $('#export').click(function () {
            exports1(beginTime, endTime, sname, tatus, users);
        })

        //显示任务完成情况
        $.ajax({
            url: global.ip.backUrl + 'task/statistics',
            async: false,
            success: function (res) {
                $('#all-task').html(res.data[0].total);
                $('#end-task').html(res.data[0].finished);
                $('#ing-task').html(res.data[0].unfinished);
            }
        });
        //刷新
        $('.refresh button').click(function () {
            $.ajax({
                url: global.ip.backUrl + 'task/statistics',
                async: false,
                success: function (res) {
                    $('#all-task').html(res.data[0].total);
                    $('#end-task').html(res.data[0].finished);
                    $('#ing-task').html(res.data[0].unfinished);
                }
            });
        })
    })
    exports('taskStatistics', {})
})