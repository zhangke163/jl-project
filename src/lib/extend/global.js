layui.define(function(exports) {
	var scroll_timer = null;
	var exp = {
		'scroll_timer': scroll_timer,
		'yldCurrentIcon':null,
		'szCurrentIcon':null,
		'llCurrentIcon':null,
		'ip':layui.setter.ip
	}
	exports('global', exp);
})