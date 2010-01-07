M31Desktop.SpringPlayer = Ext.extend(M31.app.Module, {
    /*
     * Desktop에서 필요한 경우 호출하는 콜백 함수 정의 부.
     */
    init : function() {
        console.log("Init Call.....");
    },
    createCallback : function(win) {
       console.log("Create Call Back.....");
        if(win == undefined) {

        }
    },
    beforeCreate : function(){
        console.log("beforeCreate");
        // 스토어
         this.ds = new Ext.data.JsonStore({
             url: '/gateway/springplayer/search',
             restful : true,
             remoteSort : true,
             
             root: 'items',

             fields : ['source', 'duration', 'author', 'title', 'thumbnailURL', 'playerURL'],

             listeners : {
                 beforeload : function(store, options) {
                     var textfield = Ext.getCmp('springplayer-serach-textfield');

                     // 페이징시 검색어가 안 넘어가서 추가.
                     if(options.params['q'] != '') {
                        var q = textfield.getRawValue();
                        options.params['q'] = (q === null) ? '' : q;
                     }
                     options.params['limit'] = 20;
                     options.params['type'] = Ext.getCmp('springplayer-serach-combo').getValue();
                 },
                 load : function(s) { console.log(s);}
             }
        });

        this.thumbnailtpl = new Ext.XTemplate(
            '<tpl for="."><table>',
            '<tr><td rowspan="3"><img src="{thumbnailURL}"></td><td>{title}</td></tr>',
            '<tr><td>{author}</td></tr>',
            '<tr><td>Play / New Window / Me2Day</td></tr>',
            '</table></tpl>'
        );

         // 동영상 검색 부분
         this.serchePanel = new Ext.Panel({
             id : 'springplayer-serach',
             layout : 'border',

             items: [{
                region : 'center',
                id : 'springplayer-dataview',
                autoScroll : true,
                items : {
                    xtype : 'dataview',
                    store: this.ds,
                    tpl: this.thumbnailtpl,
                    multiSelect: true,
                    itemSelector:'div.thumb-wrap',
                    emptyText: 'No images to display'
                },

                 tbar : [
                     //  검색 콤보 박스
                     {
                         id: 'springplayer-serach-combo',
                         xtype: 'combo',
                         store: new Ext.data.ArrayStore({
                             fields: ['id', 'name'],
                             data : [['google', 'Google'],['daum', 'Daum']]
                         }),
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
                         id : 'springplayer-serach-textfield',
                         width:200,
                         store : this.ds,
                         paramName : 'q'
                     })
                 ],
                 // 페이징 툴바
                 bbar: new Ext.PagingToolbar({
                     pageSize: 20,
                     store : this.ds                     
                 })
             }, {
                 title : '탐색기',
                 region : 'south',
                 height : 100,
                 html : '<strong>south</strong>',
                 collapsible: true,
                 split: true
             }]
         });
    },
    removeWin: function(){
        console.log("removeWin");
        // this.win = undefined;
    },
    createWindow : function() {
        console.log("CreateWindow");

        var config = {
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
        return config;
    }
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

    // X버튼 클릭시
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
    // 검색(돋보기) 클릭시
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