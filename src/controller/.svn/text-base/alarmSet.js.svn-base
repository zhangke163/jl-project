layui.define(function (exports) {
    layui.use(['layer', 'global'], function () {
        var layer = layui.layer,
            $ = layui.$,
            global = layui.global;
        var lz = layui.setter.base;
        $.get(global.ip.backUrl + 'alarmCondition/queryListByType?type=1', function (value) {
            $.each(value.data, function (index, value) {
                //易涝监测点 页面
                var oneHtml = `<div class="layui-col-md4 flood_box">
									 <div class="flood_small">${value.name}</div>
									 <div class="flood_cons">
									   <div class="flood_cons_title" id='${value.alarmConditionId}'><span>${value.dataType}(${value.unit})</span><img src="${lz}style/res/edit.png" class='editBtn'/></div>
									   <form action="" class="flood_cons_detail"><h3 style="font-size:14px;color: #0095ff;margin-top:8px;">预警值</h3><input type="text" value="${value.warning}" class="input_flood_one" disabled/>
								    		<h4 style="font-size:14px;color: #0095ff;">报警值</h4><input type="text" value="${value.value}"/ class="input_flood_two" disabled>
								    		<div class ="flood_time">
									    		<b>更新时间</b>
									    		<span>${value.modifyTime}</span>
								    		</div>
							    		</form>
									 </div>
								   </div>`;
                $('#contents-one').append(oneHtml);
            })
        })
        $.get(global.ip.backUrl + 'alarmCondition/queryListByType?type=2', function (value) {
            var twoTitleHtml = `<div class="layui-col-md6 flood_box water_big_box">
										<div class="layui-col-md12 water_title">
											<span>${value.data[0].name}</span>
										</div>
										<div class="layui-col-md3 water_box water_first water-one">
											<div class="flood_cons" style="margin-top:0">
											</div>
										</div>
										<div class="layui-col-md3 water_box water-two">
											<div id="water_range_box">
					
											</div>
										</div>
										<div class="layui-col-md3 water_box water-three">
											<div class="flood_cons" style="margin-top:0">
											</div>
										</div>
										<div class="layui-col-md3 water_box water-four">
											<div class="flood_cons" style="margin-top:0">
											</div>
										</div>
									</div>`;
            $('#contents-two').append(twoTitleHtml);
            $.each(value.data, function (index, value) {
                if (index == 0) {
                    var waterOneHtml = `<div class="flood_cons_title" id='${value.alarmConditionId}'><span>${value.dataType}(${value.unit})</span><img src="${lz}style/res/edit.png" class='editBtn'/></div>
											<form action="" class="flood_cons_detail"><h3 style="font-size:14px;color: #0095ff;margin-top:8px;">预警值</h3><input type="text" value="${value.warning}" class="input_flood_one" disabled/>
									    		<h4 style="font-size:14px;color: #0095ff;">报警值</h4><input type="text" value="${value.value}"/ class="input_flood_two" disabled>
									    		<div class ="flood_time">
										    		<b>更新时间</b>
										    		<span>${value.modifyTime}</span>
									    		</div>
									    	</form>`;
                    $('.water-one .flood_cons').append(waterOneHtml);
                } else if (index == 1) {
                    var warnValue = value.warning.split('-');
                    var valueValue = value.value.split('-');
                    var waterTwoHtml = `<div class="water_range_box">
												<div class="flood_cons_title" id='${value.alarmConditionId}'>
									    		<span>${value.dataType}</span>
									    		<img src="${lz}/style/res/edit.png" class = 'editBtn1'/>
									    	</div>
									    	<form action="" class="flood_cons_detail">
									    		<h3 style="font-size:14px;color: #0095ff;margin-top:8px;">预警值</h3>
									    		<div class="detail_top">
									    			<div class="cons_left">
										    			<img src="${lz}/style/res/≤.png" alt="" />
										    			<input type="text" value="${warnValue[0]}" class="rangTopOne" disabled/>
										    		</div>
										    		<div class="cons_right">
										    			<img src="${lz}/style/res/≥.png" alt="" />
										    			<input type="text" value="${warnValue[1]}" class="rangTopTwo" disabled/>
										    		</div>	
									    		</div>
									    		<h4 style="font-size:14px;color: #0095ff;">报警值</h4>
									    		<div class="detail_bottom">
									    			<div class="cons_left">
										    			<img src="${lz}/style/res/≤.png" alt="" />
										    			<input type="text" value="${valueValue[0]}" class="rangeBottomOne" disabled/>
										    		</div>
										    		<div class="cons_right">
										    			<img src="${lz}/style/res/≥.png" alt="" />
										    			<input type="text" value="${valueValue[1]}" class="rangeBottomTwo" disabled/>
										    		</div>	
									    		</div>
									    		<div class="flood_time1">
										    		<b>更新时间</b>
										    		<span>${value.modifyTime}</span>
									    		</div>
									    	</form>`;
                    $('.water-two #water_range_box').append(waterTwoHtml);
                } else if (index == 2) {
                    var waterThreeHtml = `<div class="flood_cons_title" id='${value.alarmConditionId}'><span>${value.dataType}(${value.unit})</span><img src="${lz}style/res/edit.png" class='editBtn'/></div>
												<form action="" class="flood_cons_detail"><h3 style="font-size:14px;color: #0095ff;margin-top:8px;">预警值</h3><input type="text" value="${value.warning}" class="input_flood_one" disabled/>
										    		<h4 style="font-size:14px;color: #0095ff;">报警值</h4><input type="text" value="${value.value}"/ class="input_flood_two" disabled>
										    		<div class ="flood_time">
											    		<b>更新时间</b>
											    		<span>${value.modifyTime}</span>
										    		</div>
										    	</form>`;
                    $('.water-three .flood_cons').append(waterThreeHtml);
                } else if (index == 3) {
                    var waterFourHtml = `<div class="flood_cons_title" id='${value.alarmConditionId}'><span>${value.dataType}(${value.unit})</span><img src="${lz}style/res/edit.png" class='editBtn'/></div>
											<form action="" class="flood_cons_detail"><h3 style="font-size:14px;color: #0095ff;margin-top:8px;">预警值</h3><input type="text" value="${value.warning}" class="input_flood_one" disabled/>
									    		<h4 style="font-size:14px;color: #0095ff;">报警值</h4><input type="text" value="${value.value}"/ class="input_flood_two" disabled>
									    		<div class ="flood_time">
										    		<b>更新时间</b>
										    		<span>${value.modifyTime}</span>
									    		</div>
									    	</form>`;
                    $('.water-four .flood_cons').append(waterFourHtml);
                }
            })
        })
        $.get(global.ip.backUrl + 'alarmCondition/queryListByType?type=3', function (value) {
            $.each(value.data, function (index, value) {
                //易涝监测点 页面
                var threeHtml = `<div class="layui-col-md12 flood_box">
										<div class="flood_small">${value.name}</div>
										<div class="flood_cons">
											<div class="flood_cons_title" id='${value.alarmConditionId}'><span>${value.dataType}(${value.unit})</span><img src="${lz}style/res/edit.png" class='editBtn'/></div>
											<form action="" class="flood_cons_detail"><h3 style="font-size:14px;color: #0095ff;margin-top:8px;">预警值</h3><input type="text" value="${value.warning}" class="input_flood_one" disabled/>
									    		<h4 style="font-size:14px;color: #0095ff;">报警值</h4><input type="text" value="${value.value}"/ class="input_flood_two" disabled>
									    		<div class ="flood_time">
										    		<b>更新时间</b>
										    		<span>${value.modifyTime}</span>
									    		</div>
									    	</form>
										</div>
									</div>`;
                $('#contents-three').append(threeHtml);
            })
        })
        //编辑按钮的点击事件 
        var inputValue = '';
        var inputValue1 = '';
        $(".flood_content").delegate(".editBtn", "click", function (e) {
            // $(e.target).attr("disabled", "disabled");
            inputValue = $(e.target).parent().parent().find('.input_flood_one').val();
            inputValue1 = $(e.target).parent().parent().find('.input_flood_two').val();
            $(e.target).parent().parent().find('.input_flood_one').removeAttr('disabled').val('').attr('placeholder', '输入预警值');
            $(e.target).parent().parent().find('.input_flood_two').removeAttr('disabled').val('').attr('placeholder', '输入报警值');
            $($(e.target).parent().parent().find('.flood_time')).css('display', 'none');
            var confirmHtml = $(`<div class ='confirmBox'><input type="submit" value='确定' class='confirmBtn'></div>`);
            $(e.target).parent().parent().append(confirmHtml);
            $(e.target).attr('src', '../src/style/res/close.png');
            $(e.target).removeClass('editBtn').addClass('closeBtn');
        });
        //关闭按钮的点击事件
        $(".flood_content").delegate(".closeBtn", "click", function (e) {
            $(e.target).removeClass('closeBtn').addClass('editBtn').removeAttr('disabled');
            $(e.target).attr('src', '../src/style/res/edit.png');
            $($(e.target).parent().parent().find('.confirmBox')).css('display', 'none');
            $($(e.target).parent().parent().find('.flood_time')).css('display', 'block');
            $(e.target).parent().parent().find('.input_flood_one').attr('disabled', 'disabled').val(inputValue);
            $(e.target).parent().parent().find('.input_flood_two').attr('disabled', 'disabled').val(inputValue1);
        });
        //确定按钮的点击事件
        $(".flood_content").delegate(".confirmBtn", "click", function (e) {
            $($(e.target).parent().parent().find('.closeBtn')).addClass('editBtn').removeAttr('disabled');
            $($(e.target).parent().parent().find('.closeBtn')).attr('src', '../src/style/res/edit.png');
            $($(e.target).parent().parent().find('.confirmBox')).css('display', 'none');
            $($(e.target).parent().parent().find('.flood_time')).css('display', 'block');
            $(e.target).parent().parent().find('.input_flood_one').attr('disabled', 'disabled');
            $(e.target).parent().parent().find('.input_flood_two').attr('disabled', 'disabled');
            if ($(e.target).parent().parent().find('.input_flood_one').val() == '') {
                $(e.target).parent().parent().find('.input_flood_one').attr('disabled', 'disabled').val(inputValue);
            }
            if ($(e.target).parent().parent().find('.input_flood_two').val() == '') {
                $(e.target).parent().parent().find('.input_flood_two').attr('disabled', 'disabled').val(inputValue1);
            }
            var alarmConditionId = $(e.target).parent().parent().find('.flood_cons_title').attr('id');
            var warning = $(e.target).parent().parent().find('.input_flood_one').val();
            var values = $(e.target).parent().parent().find('.input_flood_two').val();
            $.ajax({
                url: global.ip.backUrl + 'alarmCondition/updateById',
                type: 'POST',
                data: {
                    "alarmConditionId": alarmConditionId,
                    "warning": warning,
                    "value": values
                },
                dataType: 'json',
                success: function (data) {
                    //这里获取到数据执行显示
                    console.log(data.msg);
                },
                error: function (data) {
                    console.log(data.msg);
                }
            });
        });
        //水质第二个范围框
        //编辑按钮的点击事件 
        var inputValueTopOne = '';
        var inputValueTopTwo = '';
        var inputValueBottomOne = '';
        var inputValueBottomTwo = '';
        $(".flood_content").delegate(".editBtn1", "click", function (e) {
            // $(e.target).attr("disabled", "disabled");
            inputValueTopOne = $(e.target).parent().parent().find('.rangTopOne').val();
            inputValueTopTwo = $(e.target).parent().parent().find('.rangTopTwo').val();
            inputValueBottomOne = $(e.target).parent().parent().find('.rangeBottomOne').val();
            inputValueBottomTwo = $(e.target).parent().parent().find('.rangeBottomTwo').val();
            $(e.target).parent().parent().find('.rangTopOne').removeAttr('disabled').val('').attr('placeholder', '0-7');
            $(e.target).parent().parent().find('.rangTopTwo').removeAttr('disabled').val('').attr('placeholder', '7-14');
            $(e.target).parent().parent().find('.rangeBottomOne').removeAttr('disabled').val('').attr('placeholder', '0-7');
            $(e.target).parent().parent().find('.rangeBottomTwo').removeAttr('disabled').val('').attr('placeholder', '7-14');
            $($(e.target).parent().parent().find('.flood_time1')).css('display', 'none');
            var confirmHtml = $(`<div class ='confirmBox'><input type="submit" value='确定' class='confirmBtn' id='confirmBtn'></div>`);
            $(e.target).parent().parent().append(confirmHtml);
            $(e.target).attr('src', '../src/style/res/close.png');
            $(e.target).removeClass('editBtn1').addClass('closeBtn1');
        });
        //关闭按钮的点击事件
        $(".flood_content").delegate(".closeBtn1", "click", function (e) {
            $(e.target).removeClass('closeBtn1').addClass('editBtn1').removeAttr('disabled');
            $(e.target).attr('src', '../src/style/res/edit.png');
            $($(e.target).parent().parent().find('.confirmBox')).css('display', 'none');
            $($(e.target).parent().parent().find('.flood_time1')).css('display', 'block');
            $(e.target).parent().parent().find('.rangTopOne').attr('disabled', 'disabled').val(inputValueTopOne);
            $(e.target).parent().parent().find('.rangTopTwo').attr('disabled', 'disabled').val(inputValueTopTwo);
            $(e.target).parent().parent().find('.rangeBottomOne').attr('disabled', 'disabled').val(inputValueBottomOne);
            $(e.target).parent().parent().find('.rangeBottomTwo').attr('disabled', 'disabled').val(inputValueBottomTwo);
        });
        //确定按钮的点击事件
        $(".flood_content").delegate("#confirmBtn", "click", function (e) {
            $($(e.target).parent().parent().find('.closeBtn1')).addClass('editBtn1').removeAttr('disabled');
            $($(e.target).parent().parent().find('.closeBtn1')).attr('src', '../src/style/res/edit.png');
            $($(e.target).parent().parent().find('.confirmBox')).css('display', 'none');
            $($(e.target).parent().parent().find('.flood_time1')).css('display', 'block');
            $(e.target).parent().parent().find('.rangTopOne').attr('disabled', 'disabled');
            $(e.target).parent().parent().find('.rangTopTwo').attr('disabled', 'disabled');
            $(e.target).parent().parent().find('.rangeBottomOne').attr('disabled', 'disabled');
            $(e.target).parent().parent().find('.rangeBottomTwo').attr('disabled', 'disabled');
            if ($(e.target).parent().parent().find('.rangTopOne').val() == '') {
                $(e.target).parent().parent().find('.rangTopOne').attr('disabled', 'disabled').val(inputValueTopOne);
            }
            if ($(e.target).parent().parent().find('.rangTopTwo').val() == '') {
                $(e.target).parent().parent().find('.rangTopTwo').attr('disabled', 'disabled').val(inputValueTopTwo);
            }
            if ($(e.target).parent().parent().find('.rangeBottomOne').val() == '') {
                $(e.target).parent().parent().find('.rangeBottomOne').attr('disabled', 'disabled').val(inputValueBottomOne);
            }
            if ($(e.target).parent().parent().find('.rangeBottomTwo').val() == '') {
                $(e.target).parent().parent().find('.rangeBottomTwo').attr('disabled', 'disabled').val(inputValueBottomTwo);
            }
            var warnings = $(e.target).parent().parent().find('.rangTopOne').val() + '-' + $(e.target).parent().parent().find('.rangTopTwo').val();
            var values = $(e.target).parent().parent().find('.rangeBottomOne').val() + '-' + $(e.target).parent().parent().find('.rangeBottomTwo').val();
            $.ajax({
                url: global.ip.backUrl + 'alarmCondition/updateById',
                type: 'POST',
                data: {
                    "alarmConditionId": $(e.target).parent().parent().find('.flood_cons_title').attr('id'),
                    "warning": warnings,
                    "value": values
                },
                dataType: 'json',
                success: function (data) {
                    //这里获取到数据执行显示
                    console.log(data.msg);
                },
                error: function (data) {
                    console.log(data.msg);
                }
            });
        });
    })
    exports('alarmSet', {})
})