layui.define(function(exports) {

	layui.use('jquery', function() {
		var $ = layui.$;
		$('.new-layui-nav').find('.layui-nav-item').click(function() {
			var _this = $(this);
			var _index = _this.index();

			// var target1 = $('.pump-data');
			// target1.each(function(index, el) {
			// 	var child = $(el).children('div');
			// 	child.hide().eq(_index).show();
			// });

			var target2 = $('.online-monitor');
			target2.hide().eq(_index).show();

			var target3 = $('.technics-img');
			target3.hide().eq(_index).show();
		});

		if(layui.router().search.stationName) {
			var name = layui.router().search.stationName;
			console.log(666666666);
			console.log(name);
			$('.new-layui-nav .layui-nav-item').each(function(index, item) {
				$(item).removeClass('layui-this');
				if($(item).find('a').text() == unescape(name)){						
					$(item).addClass('layui-this');	
					var target2 = $('.online-monitor');
					target2.hide().eq(index).show();
					var target3 = $('.technics-img');
					target3.hide().eq(index).show();
				}
			})
		}
	})

	layui.use('element', function() {
		var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块

		element.render('nav', 'component-nav');

		//监听导航点击
		element.on('nav(demo)', function(elem) {
			//console.log(elem)
			layer.msg(elem.text());
		});
	});

	//区块轮播切换
	layui.use(['admin', 'carousel'], function() {
		var $ = layui.$,
			admin = layui.admin,
			carousel = layui.carousel,
			element = layui.element,
			device = layui.device();

		//轮播切换
		$('.layadmin-carousel').each(function() {
			var othis = $(this);
			carousel.render({
				elem: this,
				width: '100%',
				arrow: 'none',
				interval: othis.data('interval'),
				autoplay: othis.data('autoplay') === true,
				trigger: (device.ios || device.android) ? 'click' : 'hover',
				anim: othis.data('anim')
			});
		});

		element.render('progress');

	});

	exports('monitorControl', {})
})