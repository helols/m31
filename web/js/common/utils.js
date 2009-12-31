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