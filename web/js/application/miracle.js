M31Desktop.SpringPlayer = Ext.extend(M31.app.Module, {
    /*
     * Desktop에서 필요한 경우 호출하는 콜백 함수 정의 부.
     */
    init : function() {
        console.log("Init Call.....");
        // 동영상 검색 부분
        this.serchePanel = new Ext.Panel({
            layout : 'border'
        });
    },
    createCallback : function(win) {
       console.log("Create Call Back.....");
    },
    beforeCreate : function(){
        console.log("beforeCreate");
        
    },
    removeWin: function(){
        console.log("removeWin");
        // this.win = undefined;
    },
    createWindow : function() {
        console.log("CreateWindow");
        return {
            id : 'springplayer',
            title : 'Spring Player',
            width: 640,
            height: 480,
            minWidth: 640,
            minHeight: 480,

            layout : 'card',            
            activeItem : 0,

            items : [{
                id : 'springPlayer-serach',
                tbar : ["Test1"],
                html : '<h1>This is serach Panel</h1>'
            },{
                id : 'springPlayer-player',
                tbar : ["Title"],
                html : '<h1>This is Player Panel</h1>'
            }
            ]
        };
    }
    /* 내가 추가한 함수나 변수 */
});