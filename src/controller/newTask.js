layui.define(function (exports) {
    layui.use(['layer', 'laydate', 'element', 'upload','viewer','main','form', 'nicescroll',
        'leaflet', 'esri-leaflet', 'L.Control.BetterScale', 'L.Control.MousePosition',
        'mouse-position', 'leaflet.draw', 'proj4', 'proj4leaflet',
        'leaflet-measure', 'maputil', 'customUtil', 'global'
    ], function () {
        var $ = layui.jquery,
            layer = layui.layer,
            laydate = layui.laydate,
            element = layui.element,
            upload1 = layui.upload,
            upload2 = layui.upload,
            form = layui.form,
            nicescroll = layui.nicescroll,
            maputil = layui.maputil,
            customUtil = layui.customUtil,
            global = layui.global;
        var beforePic = [];
        var afterPic = [];
        var pathOptions = {
            color: '#F00',
            weight: 2,
            opacity: 1,
            clickable: true
        };
        var drawLayer = null;
        var popup = null;
        var featureLayer = new L.featureGroup();
        $(function () {
            initWindow();
            maputil.initGlobal();
            initMap();
            maputil.initMapControl();
            initDrawControl();
        })
        //滚动条
        function scroll(dom) {
            dom.niceScroll({
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
        }

        function initWindow() {
            // 监听浏览器窗口发生变化时，动态调整div的尺寸
            $(window).resize(function () {
                map.invalidateSize(); //重置地图尺寸
            });
        }

        function initMap() {
            map = L.map('taskMap', {
                crs: crs,
                zoomControl: false,
                attributionControl: false,
                doubleClickZoom: false,
                boxZoom: true,
                dragging: true,
                minZoom: 12,
                maxZoom: 20,
                maxBounds: bounds,
                layers: [ys, ws]
            }).setView([29.08948, 119.65279], 13);
            map.addLayer(vector);
            map.addLayer(featureLayer);
        }

        function initDrawControl() {
            if (!drawControl) {
                var drawControl = new L.Control.Draw({
                    position: 'topleft',
                    draw: {
                        marker: true,
                        polyline: true,
                        polygon: false,
                        circle: false,
                        rectangle: false
                    },
                    edit: {
                        featureGroup: featureLayer,
                        edit: false,
                        remove: false
                    }
                });
            }
            map.addControl(drawControl);

            map.on('draw:created', function (e) {
                shapeType = e.layerType;
                drawLayer = e.layer;
                featureLayer.addLayer(drawLayer);
                if (shapeType == "polyline") {
                    var content = `
								<div>
									<div class="popupContent">
										<p class="addAddress-p">请输入路线名称</p>
										<form>
											<div class="addAddress-box">
												<input type="text" id="name" class="addAddress">
											</div>
											<div>
												<input type="button" class="btn-cancel" value="取消" onclick='routeCancel()'>
												<input type="button" class="btn-save" value='保存' onclick='routeSave()'>
												<div class="layui-clear"></div>
											</div>
										</form>
									</div>
								</div>
							`;
                    popup = L.popup({
                        keepInView: true,
                        closeButton: false,
                        closeOnClick: false
                    }).setContent(content).setLatLng(drawLayer._latlngs[0]).openOn(map);
                } else if (shapeType == "marker") {
                    var content = `<div>
										<div class="popupContent">
											<p class="addAddress-p">请输入地点名称</p>
											<form>
												<div class="addAddress-box">
													<input type="text" id="name" class="addAddress">
												</div>
												<div>
													<input type="button" class="btn-cancel" value="取消" onclick='siteCancel()'>
													<input type="button" class="btn-save" value='保存' onclick='siteSave()'>
													<div class="layui-clear"></div>
												</div>
											</form>
										</div>
									</div>
									`;
                    popup = L.popup({
                        keepInView: true,
                        closeButton: false,
                        closeOnClick: false
                    }).setContent(content).setLatLng(drawLayer._latlng).openOn(map)
                }
                maputil.initMapEvent();
            });

            map.on('draw:drawstart', function (e) {
                featureLayer.removeLayer(drawLayer);
                map.closePopup(popup);
                map.off('click');
            });
        }

        window.siteCancel = function () {
            featureLayer.removeLayer(drawLayer);
            map.closePopup(popup);
        }

        window.siteSave = function () {
            var latlng = drawLayer._latlng;
            var wkt = `POINT(${latlng.lng} ${latlng.lat})`;
            var name = $('#name').val();
            $.ajax({
                url: backUrl + 'location/insert',
                type: 'post',
                data: {
                    name: name,
                    longitude: latlng.lng,
                    latitude: latlng.lat
                },
                success: function (res) {
                    layer.msg('地点保存成功！');
                    map.closePopup(popup);
                }
            });
        }

        window.routeCancel = function () {
            featureLayer.removeLayer(drawLayer);
            map.closePopup(popup);
        }

        window.routeSave = function () {
            var line = lineToWKT1(drawLayer);
            var name = $('#name').val();
            $.ajax({
                url: backUrl + 'checkLines/insert',
                type: 'post',
                data: {
                    line: line,
                    name: name
                },
                success: function (res) {
                    layer.msg('路线保存成功！');
                    map.closePopup(popup);
                }
            });
        }

        function lineToWKT1(feature) {
            console.log(feature);
            var latlngs = feature._latlngs;
            var path = '[';
            latlngs.forEach(function (item) {
                path += '[' + item.lat + ',' + item.lng + '],'
            })
            path = path.substr(0, path.length - 1);
            path += ']';
            return path;
        };
        //执行一个laydate实例
        laydate.render({
            elem: '#times' //指定元素
                ,
            type: 'datetime'
        });
        laydate.render({
            elem: '#finished-times' //指定元素
                ,
            type: 'datetime'
        });
        //判断图片宽高比
		function checkPicurl(url) {
			var img = new Image();
			img.src = url;
			img.onerror = function () {
				alert(name + " 图片加载失败，请检查url是否正确");
				return false;
			};
			if (img.complete) {
				if (img.width < img.height) {
					$('.detail-img img').css('width', '90px');
				} else {
					$('.detail-img img').css('height', '90px');
				}
			} else {
				img.onload = function () {
					if (img.width < img.height) {
						$('.detail-img img').css('width', '90px');
					} else {
						$('.detail-img img').css('height', '90px');
					}
					img.onload = null; //避免重复加载
				}
			}
		}
        let lz = layui.setter.base;
        var baseImgUrl = global.ip.baseImgUrl; //测试服务器端口
		var locationUrl = window.location.host;
		var testUrl = locationUrl == baseImgUrl ? locationUrl : baseImgUrl;
        //养护图片上传，多图片上传  点击添加任务图片
        upload1.render({
            elem: '#test2',
            url: global.ip.backUrl + 'upload/uploadFile',
            multiple: true,
            auto: true,
            choose: function (obj) {
            	layer.load();
                //将每次选择的文件追加到文件队列
                var files = this.files = obj.pushFile();
            },
            done: function (res, index, upload) {
            	layer.closeAll('loading'); 
            	beforePic.push(res.data);
                delete this.files[index];
            	console.log(8888888);
            	var imgurl = testUrl + 'jhzhpsPic/' + res.data;
            	checkPicurl(imgurl);
            	$('#demo2').find('.clearImg').remove();
                var divHtml = `<div class="layui-upload-img img-detail">
	                    				   <img data-original="${imgurl}" src="${imgurl}">
						 			  	   <div class="deleteBtn" ></div>
						 			   </div>`;
                $('#demo2').append(divHtml);
                $("#demo2").viewer('update');
            },
            allDone: function (obj) {
                console.log(obj);
            },
            error: function (index, upload) {
                console.log('失败');
            }
        });
        upload2.render({
            elem: '#test3',
            url: global.ip.backUrl + 'upload/uploadFile',
            multiple: true,
            auto: true,
            choose: function (obj) {
            	layer.load();
                //将每次选择的文件追加到文件队列
                var files = this.files = obj.pushFile();
            },
            done: function (res, index, upload) {
            	layer.closeAll('loading'); 
                afterPic.push(res.data);
                delete this.files[index];
            	console.log(8888888);
            	var imgurl = testUrl + 'jhzhpsPic/' + res.data;
            	checkPicurl(imgurl);
            	$('#demo3').find('.clearImg1').remove();
                var divHtml = `<div class="layui-upload-img img-detail">
	                    				   <img data-original="${imgurl}" src="${imgurl}">
						 			  	   <div class="deleteBtn" ></div>
						 			   </div>`;
                $('#demo3').append(divHtml);
                $("#demo3").viewer('update');
            },
            allDone: function (obj) {
                console.log(obj);
            },
            error: function (index, upload) {
                console.log('失败');
            }
        });
        //删除图片
        $('#demo2').delegate(".deleteBtn", "click", function () {
            beforePic.splice($(this).parent().index(), 1);
            $(this).parent().remove();
        });
        $('#demo3').delegate(".deleteBtn", "click", function () {
            afterPic.splice($(this).parent().index(), 1);
            $(this).parent().remove();
        });
        scroll($('#demo2'));
        scroll($('#demo3'));

        //监听提交  创建任务
        form.on('submit(formDemo1)', function (data) {
            submitForm();
            return false;
        });
        //		重置表单
        function resetHtml() {
            $('#search-form')[0].reset();
            $('#beforeDetail').val('');
            $('#afterDetail').val('');
            $('#demo2').empty();
            $('#demo3').empty();
            var imgHtml = `<img src= "${lz}style/res/zwxgtp.png" alt="" />`;
            $('#demo2').append(imgHtml);
            $('#demo3').append(imgHtml);
        }

        function submitForm() {
        	console.log(beforePic.join(","));
        	console.log(11111111111);
        	console.log(afterPic.join(","));
            var siteType;
            var active = $('.tabs-title .active').text();
            if (active == '地点') {
                siteType = '1';
            } else {
                siteType = '2';
            }
            //触发上传按钮的点击事件
            $('#btnOne').click();
            $('#btnTwo').click();
            $('#btnOne').click();
            $('#btnTwo').click();
            $.ajax({
                url: global.ip.backUrl + 'task/create',
                type: 'POST',
                data: {
                    "reportTime": $('#times').val(),
                    "beforeDetail": $("#beforeDetail").val(),
                    "afterDetail": $("#afterDetail").val(),
                    "siteId": $('#Search option:selected').val(),
                    "userId": $('#peoples option:selected').val(),
                    "status": $('#finished option:selected').val(),
                    "siteType": siteType,
                    "type": $('#gx-type  option:selected').val(),
                    "recipient": $('#yh-peoples').val(),
                    "completeTime": $('#finished-times').val(),
                    "beforePicUrl": beforePic.join(","),
                    "afterPicUrl": afterPic.join(",")
                },
                dataType: 'json',
                success: function (data) {
                    //这里获取到数据执行显示
                    if (data.msg == 'success') {
                        layer.msg('任务创建成功!', {
                            icon: 1
                        });
                    }
                    resetHtml();
                },
                error: function (data) {
                    layer.msg(data.msg, {
                        icon: 5
                    });
                    resetHtml();
                }
            });
        }
        $(function () {
            let lz = layui.setter.base;
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
                    scroll($('#test-scroll .layui-form-select dl.layui-anim'));
                },
                error: function (data) {
                    console.log(data.msg);
                }
            });
            //养护员获取
            $.ajax({
                url: global.ip.backUrl + 'user/summaryQuery',
                type: 'GET',
                data: {
                    'roleId': xcyId
                },
                dataType: 'json',
                success: function (data) {
                    //这里获取到数据执行显示
                    $.each(data.data, function (index, value) {
                        var peoplesHtml = `<option value='${value.id}'>${value.name}</option>`;
                        $('#yh-peoples').append(peoplesHtml);
                        form.render();
                    });
                    scroll($('#test-scroll .layui-form-select dl.layui-anim'));
                },
                error: function (data) {
                    console.log(data.msg);
                }
            });
            //图片放大事件
//          function imgclick(dom) {
//              dom.click(function (e) {
//                  if ($(e.target).hasClass('magnificationBtn')) {
//                      var imgUrl = $(e.target).parent().css("background-image").split("\"")[1];
//                      var imgHtml = `<img src='${imgUrl}' class='imgs'/>`;
//                      $('body').append(imgHtml);
//                      $('.imgs').css('display', 'none');
//                      var imgW = $(e.target).parent().find($(".imgs")).width();
//                      var imgH = $(e.target).parent().find($(".imgs")).height();
//                      layer.open({
//                          type: 1,
//                          title: '查看图片',
//                          skin: 'layui-layer-rim', //加上边框
//                          area: [imgW + 'px', imgH + 'px'], //宽高
//                          content: "<img alt=" + name + " title=" + name + " src=" + imgUrl + " />"
//                      });
//                  }
//              });
//          }
//          imgclick($('#demo2'));
//          imgclick($('#demo3'));
            form.render(null, 'search-form');

            $('.tabs-title li').click(function () {
                var index = $(this).index();
                $(this).siblings('.tabs-title li').removeClass('active');
                $(this).addClass('active');
                $(this).parent().parent().find('.tabs-content .content-one').eq(index).siblings('.content-one').addClass('noshows');
                $(this).parent().parent().find('.tabs-content .content-one').eq(index).removeClass('noshows');
                if (index == 1) { //路线	
                    initRouteList();
                } else { //地点	
                    initSiteList();
                }
                showData($('#Search').val());
            })
            //启动后选项更新以及目标选择
            if ($('.tabs-title li').index() == 1) {
                initRouteList();
            } else {
                initSiteList();
            }
            showData($('#Search').val());
            //是否养护选择养护员、完成时间、养护后图片是否上传
            function edisabled(dom1, dom2, dom3, dom4, stus) {
                $(dom1).attr("disabled", stus);
                $(dom2).attr("disabled", stus);
                $(dom3).attr("disabled", stus);
                $(dom4).attr("disabled", stus);
            }
            edisabled('#yh-peoples', '#finished-times', '#test3', '#afterDetail', true);
            form.on('select(finished)', function (data) {
                if (data.value == 1) {
                    edisabled('#yh-peoples', '#finished-times', '#test3', '#afterDetail', true);
                    $('#yh-peoples').val("");
                    $('#finished-times').val("");
                    $('#test3').val("");
                    $('#demo3').html("");
                    form.render();
                } else if (data.value == 3) {
                    $('#yh-peoples').parent().find('.layui-form-select').removeClass('layui-select-disabled');
                    $('#yh-peoples').parent().find('.layui-form-select .layui-select-title input').removeClass('layui-disabled');
                    edisabled('#yh-peoples', '#finished-times', '#test3', '#afterDetail', false);
                    form.render();
                }
            });
            //下拉列表选择项显示定位
            form.on('select(target)', function (data) {
                var targetID = data.value;
                showData(targetID);
            });

            function showData(targetID) {
                featureLayer.clearLayers();
                map.closePopup(popup);
                if (targetID == "")
                    return;
                if ($('.tabs-title .active').text() == "路线") { //线路
                    //						console.log("路线" + targetID)
                    var result = exuteAjax(backUrl + 'checkLines/getList', targetID);
                    if (result && result.count > 0) {
                        var item = result.data[0];
                        let path = item.line;
                        let name = item.name;
                        let id = item.id;
                        var feature = L.polyline(eval("(" + path + ")"), pathOptions).on('click', function (e) {
                            var content = `<div> ${name}  #${id} </div>`;
                            L.popup().setContent(content).setLatLng(e.latlng).openOn(map)
                        }).addTo(featureLayer);
                        map.fitBounds(feature.getBounds());
                    }
                } else { //地点
                    console.log("地点" + targetID)
                    var result = exuteAjax(backUrl + 'location/getList', targetID);
                    if (result && result.count > 0) {
                        var item = result.data[0];
                        let lat = item.latitude,
                            lng = item.longitude;
                        L.marker([lat, lng], {
                            name: item.name,
                            id: item.id
                        }).on('click', function (e) {
                            var content = `<div> ${item.name}  #${ item.id} </div>`
                            L.popup().setContent(content).setLatLng(e.latlng).openOn(map)
                        }).addTo(featureLayer);
                        map.setView(L.latLng(lat, lng), 14);
                    }
                }
            }

            function exuteAjax(dataUrl, id) {
                var res = null;
                $.ajax({
                    url: dataUrl,
                    async: false,
                    data: {
                        id: id
                    },
                    success: function (result) {
                        var total = result.count; //记录总数
                        totalLeft = total;
                        if (total) {
                            res = result;
                        }
                    }
                });
                return res;
            }

            function initRouteList() {
                $.ajax({
                    url: backUrl + 'checkLines/getList?limit=-1',
                    async: false,
                    success: function (res) {
                        var data = res.data || [];
                        var opt = "";
                        opt = `<option value="" >请选择</option>`;
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
                    url: backUrl + 'location/getList.json?limit=-1',
                    async: false,
                    success: function (res) {
                        var data = res.data || [];
                        var opt = "";
                        opt = `<option value="" >请选择</option>`;
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
        })
    })
    exports('newTask', {})
})