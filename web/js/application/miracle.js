M31Desktop.SpringPlayer = Ext.extend(M31.app.Module, {
    /*
     * Desktop에서 필요한 경우 호출하는 콜백 함수 정의 부.
     */
    init : function() {
        console.log("Init Call.....");
        // 스토어
        this.ds = new Ext.data.JsonStore({
            url: '/gateway/springplayer/search',
            restful : true,
            root: 'items'
        });

        // 동영상 검색 부분
        this.serchePanel = new Ext.Panel({
            id : 'springPlayer-serach',
            layout : 'border',

            items: [{
                region : 'center',
                tbar : [
                    //  검색 콤보 박스
                    {
                        id: 'springplayer-serach-combo',
                        xtype: 'combo',
                        store: new Ext.data.ArrayStore({
                            fields: ['id', 'name'],
                            data : [['google', 'Google'],['daum', 'Daum']]
                        }),
                        displayField:'name',
                        typeAhead: true,
                        width: 100,
                        mode: 'local',
                        editable: false,
                        displayField: 'name',
                        valueField: 'id',
                        forceSelection: true,
                        lazyInit: false,
                        triggerAction: 'all',
                        value: 'Google'
                    }, '-',
                    // 검색 필드
                    new Ext.app.SearchField({
                       width:200,
                       store : this.ds
                    })
                ],

                bbar : ['test']
            }, {
                title : '탐색기',
                region : 'south',
                height : 100,
                html : '<b>south</b>',
                collapsible: true,
                split: true
            }]
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

            items : [ this.serchePanel,
            {
                id : 'springPlayer-player',
                tbar : ["Title"],
                html : '<h1>This is Player Panel</h1>'
            }]
        };
    }
    /* 내가 추가한 함수나 변수 */
});

/*검색 필드*/
/**
 * The custom search field
 */
Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.app.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },

    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',

    onTrigger1Click : function(){
        if(this.hasSearch){
            var o = {start: 0};
            o[this.paramName] = '';
            this.store.reload({params:o});
            this.el.dom.value = '';
            this.triggers[0].hide();
            this.hasSearch = false;
        }
    },

    onTrigger2Click : function(){
        var v = this.getRawValue();
        if(v.length < 1){
            this.onTrigger1Click();
            return;
        }
        var o = {start: 0};
        o[this.paramName] = v;
        this.store.reload({params:o});
        this.hasSearch = true;
        this.triggers[0].show();
    }
});