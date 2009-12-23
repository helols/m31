// 봄미투데이
M31.app.SpringM2Day = Ext.extend(M31.app.Module, {
    init : function() {
        console.log("init");
    },
    createCallback : function() {
    	console.log("createCallback");
    },
    beforeCreate : function() {
    	console.log("beforeCreate");
    },
    removeWin: function(){
    	console.log("removeWin");
    },
    createWindow : function () {
    	console.log("createWindow");
    }
});

console.log("봄 미투데이를 생성합니다.");
var springM2Day = new M31.app.SpringM2Day();
springM2Day.createCallback();
springM2Day.beforeCreate();
springM2Day.removeWin();
springM2Day.createWindow();