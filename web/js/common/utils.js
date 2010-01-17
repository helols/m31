Ext.BLANK_IMAGE_URL = '../../../../../extJS/resources/images/default/s.gif';
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
var noti_unique_id = null;
// 유틸리티 함수
m31.util = {

    JsLibraryManager: {
        'pirobox': '/js/plugin/piroBox.1_2.js'                    // 봄씨용 이미지뷰
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
    },

    /**
     * 로딩 layer 띄우기.
     * 첫번째 인자로 ... 에니메이션 및 투명화 옵션..
     * ex ) m31.util.loading(true);
     * @param anime  default : false
     */
    loading : function(anime){
        var anime = anime || false;
        var loadingHtml = [   '     <div id="loading"> '
                            , '         <div class="loading-messge"> '
                            , '             <img class="loading-img" src="../../../images/loading-logo.png"/><br/>'
                            , '            Loading...<br/>'
                            , '             <img class="loader-img" src="../../../images/ajax-loader.gif" align="absmiddle"/>'
                            , '         </div>'
                            , '</div>' ].join('');
        Ext.DomHelper.insertAfter(Ext.fly('loading-mask'), loadingHtml,true);
        if(anime){
                Ext.fly('loading-mask').setOpacity(.1).setVisible(true).animate({opacity: {to: .8, from: .1}});
                Ext.fly('loading').setVisible(true,true);
        }else{
           Ext.fly('loading-mask').setVisible(true);
           Ext.fly('loading').setVisible(true,true);
        }
    },

    /**
     * 로딩이미지 제거 ..
     * @param anime_time 삭제 시간 제어. 기본 250 ms  
     */
    loading_remove: function(anime_time){
        setTimeout(function(){
            Ext.fly('loading').remove();
            Ext.fly('loading-mask').fadeOut({remove:false});
        }, anime_time||250);
    },

    /**
     * gritter 옵션과 동일.. 다만  이미지는 무조건 .. logo로 ..
     * opt.remove : true . 입력시 이전 노티 삭제후 새로운 노티만 표시해줌.
     * @param opt gritter 옵션 참조. http://boedesign.com/blog/2009/07/11/growl-for-jquery-gritter/
     */
    notification : function(opt){
        opt.title = opt.title||'Notification...';
        opt.text = opt.text||'';
        opt.image = '../../../../../images/plugin/notication-logo.png';
        opt.time = opt.time || 4000;
        if(opt.remove && noti_unique_id !== null){
            $.gritter.remove(noti_unique_id, {
        	    fade: false,
	            speed: 'fast'
            });
        }
        noti_unique_id =  $.gritter.add(opt);
        return noti_unique_id;
    },
    notificationRemove : function( uniqueArray){
        if(Ext.isArray(uniqueArray)){
            Ext.each(uniqueArray, function(uniqueId){
                $.gritter.remove(uniqueId, {
        	        fade: false,
	                speed: 'fast'
                });
            });
        }else{
            $.gritter.removeAll();
        }
    },

    getUserCookie : function(){
        var user = Ext.util.Cookies.get("springsprout");
        var users = [];
        if (user !== null) {
            users = user.split(";");
        }
        return users;
    },
    setUserCokie : function(user){
        Ext.util.Cookies.set("springsprout", user, new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)), "/");
    },
    
    replaceURLtoLink: function(str) {
    	var regExp = /(https?:\/\/)([\da-z\.-]+\.)([a-z\.]{2,6})([\/\w\.\?\&=-]*)\/?/g;
    	return str.replace(regExp, '<a href="$1$2$3$4">$1$2$3$4</a>');
    }
};

getApp = function(appName){
    return M31.ApplicationRegistry.getInstance().getApp(appName);
};

reqexception = function(){
    m31.util.notification({title:'죄송합니다..',text:'Ajax 요청중 에러가 발생했습니다..',remove:true});
};

Ext.Ajax.on('requestexception',reqexception,this);
