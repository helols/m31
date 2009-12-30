 function pauseJS(timeInMilliS) {
            var date = new Date();
            var curDate = null;
            do { curDate = new Date(); }
            while(curDate-date < timeInMilliS);
}

// namespace
var m31 = {};

// 유틸리티 함수
m31.util = {
		
	JsLibraryManager: {
		'pirobox': '/js/plugin/piroBox.1_2_min.js'					// 봄씨용 이미지뷰
	},
	// 동적 함수 관리	
	requiredJS: function(libraryName) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = eval("this.JsLibraryManager." + libraryName);
		
		if (eval("this.JsLibraryManager." + libraryName)) {
			console.log("js load");
			eval("this.JsLibraryManager." + libraryName + "=false;");
			document.getElementsByTagName('head')[0].appendChild(script);
		}
  	}
};