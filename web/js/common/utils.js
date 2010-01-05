Ext.ns("M31", "M31.dt", "M31.app");
Ext.Ajax.defaultHeaders = {'AJAX': 'true'};

if (Ext.isIE) {
    var console = function() {
        return {log : function(log) {
//            if(Ext.fly('log') === null){
//                Ext.getBody().insertHtml(
//                        'afterBegin',
//                        '<div id="log" style="background:#FFF; color:#000;overflow:hidden;">'+log+'</div>');
//            }else{
//                Ext.fly('log').update(Ext.fly('log').dom.innerHTML+log);
//            }
        }}
    }();
}
// namespace
var m31 = {};

// 유틸리티 함수
m31.util = {

    JsLibraryManager: {
        'pirobox': '/js/plugin/piroBox.1_2_min.js'                    // 봄씨용 이미지뷰
    },
    // 동적 함수 관리
    requiredJS: function(libraryName) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = "UTF-8";
        script.src = eval("this.JsLibraryManager." + libraryName);

        if (eval("this.JsLibraryManager." + libraryName)) {
            eval("this.JsLibraryManager." + libraryName + "=false;");
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    },
    /**
     * Interface Elements for jQuery
     * utility function
     *
     * http://interface.eyecon.ro
     *
     * Copyright (c) 2006 Stefan Petre
     * Dual licensed under the MIT (MIT-LICENSE.txt)
     * and GPL (GPL-LICENSE.txt) licenses.
     *
     *
     */
    getPosition : function(ext)
    {
        var x = 0;
        var y = 0;
        var e = ext.dom;
        var es = e.style;
        var restoreStyles = false;
        if (jQuery(e).css('display') == 'none') {
            var oldVisibility = es.visibility;
            var oldPosition = es.position;
            restoreStyles = true;
            es.visibility = 'hidden';
            es.display = 'block';
            es.position = 'absolute';
        }
        var el = e;
        while (el) {
            x += el.offsetLeft + (el.currentStyle && !jQuery.browser.opera ? parseInt(el.currentStyle.borderLeftWidth) || 0 : 0);
            y += el.offsetTop + (el.currentStyle && !jQuery.browser.opera ? parseInt(el.currentStyle.borderTopWidth) || 0 : 0);
            el = el.offsetParent;
        }
        el = e;
        while (el && el.tagName && el.tagName.toLowerCase() != 'body')
        {
            x -= el.scrollLeft || 0;
            y -= el.scrollTop || 0;
            el = el.parentNode;
        }
        if (restoreStyles == true) {
            es.display = 'none';
            es.position = oldPosition;
            es.visibility = oldVisibility;
        }
        return {x:x, y:y};
    }
};

/** 
 * 알림 함수
 * m31.notification.msg({
 *   id: dom id, 기본 'm31-notification-msg-div-' + target.id
 *   target: el or id, 필수
 *   title: 제목
 *   text: 내용
 *   width: 길이(자동길이는 아직 미완성)
 *   top: top 마진, 기본 0
 *   time: 알림창 유지시간, 기본 1초
 *   align: Ext.Element.alignTo(position) 의 값, 기본 상단-중앙
 * });  
 */
m31.notification = function(){
	var createBox = function(title, text){
		return ['<div class="notification">',
                '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
                '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', title, '</h3>', text, '</div></div></div>',
                '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
                '</div>'].join('');
	};
	
	var defaultConfig = {
		align: 't-t',
		title: '',
		text: '',
		time: 1
	};
	
	return {
		getBox: function(config){
			var msgCt = Ext.get(config.id);
			if(!msgCt){
				msgCt = Ext.DomHelper.insertFirst(config.target, {id:config.id}, true);
				msgCt.addClass('m31-notification-div');
			}
			if(!config.width){
				//msgCt.setWidth('auto');
				config.width = Ext.util.TextMetrics.measure(msgCt.dom, config.text).width;
			}
			else{
				msgCt.applyStyles('width:' + config.width + 'px;');
			}
			msgCt.alignTo(config.target, config.align);
			if(config.top){
				msgCt.applyStyles('top:' + config.top + 'px;');
			}
			return msgCt;
		},
		init: function(config){
			config = Ext.apply({}, config, defaultConfig);
			if(!config.target){
				config.target = document.body;
			}
			else if(Ext.isString(config.target)){
				config.target = Ext.get(config.target);
			}
			if(!config.id){ config.id = 'm31-notification-msg-div-' + Ext.id(config.target); }
			return config;
		},
		msg: function(config){
			Ext.apply(config, this.init(config));
			// var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(this.getBox(config), {html:createBox(config.title, config.text)}, true);
            m.slideIn('t').pause(config.time).ghost("t", {remove:true});
		}
	};
}();