M31Desktop.SpringPlayer = Ext.extend(M31.app.Module, {
    /*
     * Desktop에서 필요한 경우 호출하는 콜백 함수 정의 부.
     */
    init : function() {
        console.log("Init Call.....");
    },
    createCallback : function(win) {
        console.log("Create Call Back.....");
        if (undefined !== win) {
            this.win = win;
        }

        // Load Mask
        this.ds.loadMask = new Ext.app.CustomLoadMask(Ext.getCmp('springplayer-dataview').getEl(), {store: this.ds, msg:"Loading Video..."});
    },
    beforeCreate : function(){
        console.log("beforeCreate");

        // 스토어
         this.ds = new Ext.data.JsonStore({
             url: '/gateway/springplayer/search',
             restful : true,
             remoteSort : true,
             
             root: 'items',

             fields : ['source', 'duration', 'author', 'title', 'thumbnailURL', 'playerURL', 'htmlLink'],

             listeners : {
                 beforeload : function(store, options) {
                     store.loadMask.show();
                     var textfield = Ext.getCmp('springplayer-serach-textfield');
                     var combo = Ext.getCmp('springplayer-serach-combo');

                     // 페이징시 검색어가 안 넘어가서 추가.
                     if(options.params['q'] != '') {
                        var q = textfield.getRawValue();
                        options.params['q'] = (q === null) ? '' : q;
                     }    

                     // 보이는건 Youtube지만 실제 전송되는 값은 google이여야 함.
                     var comboValue = combo.getValue();
                     if(comboValue === 'Youtube')
                        comboValue = 'google';
                     options.params['type'] = comboValue;

                     options.params['limit'] = 10;

                     // 텍스트 필드나 콤보박스의 값이 바뀌면 새로 검색.
                     if(textfield.isDirty() || combo.isDirty()) {
                         options.params['start'] = 0;
                     }
                 },
                 load : function(store) {
                    Ext.getCmp("springplayer-dataview").body.scrollTo('top', 0);
                     // Dirty 채크를 위해서 검색어 저장.
                     var textfield = Ext.getCmp('springplayer-serach-textfield');
                     var combo = Ext.getCmp('springplayer-serach-combo');
                     textfield.originalValue = textfield.getValue();
                     combo.originalValue = combo.getValue();                     
                 }
             }
        });

        this.thumbnailtpl = new Ext.XTemplate(
            '<tpl for="."><div class="thumb-wrap"><table>',
            '<tr><td class="thumb" rowspan="3"><img class="thumb-img" src="{thumbnailURL}" alt="{title}"/></td><td><span><img class="player-icon" src="../../images/apps/springplayer/title.png"/>{title}</span></td></tr>',
            '<tr><td><span><img class="player-icon" src="../../images/apps/springplayer/author.png"/>{author}</span></td></tr>',
            '<tr><td>',
            '<tpl if="playerURL !== null"><a href="{playerURL}" class="player-play" title="{title}"><span><img class="player-icon" src="../../images/apps/springplayer/play.png"/>Play</span></a></tpl>',
            '<tpl if="playerURL === null"><span><img class="player-icon" src="../../images/apps/springplayer/play-disable.png"/>Play</span></tpl>',
            '<a href="{htmlLink}" class="player-link"><span><img class="player-icon" style="padding-right:2px;" src="../../images/apps/springplayer/link.png"/>{source}</span></a>',
            '<span>Me2Day</span></td></tr>',
            '</table></div></tpl>'
        );

         // 동영상 검색 부분
         this.serchePanel = new Ext.Panel({
             id : 'springplayer-serach',
             layout : 'border',

             items: [{
                region : 'center',
                xtype : 'panel',
                id : 'springplayer-dataview',
                autoScroll : true,
                items : {
                    xtype : 'dataview',
                    id : 'springplayer-dataview-view',
                    store: this.ds,
                    tpl: this.thumbnailtpl,
                    overClass:'x-view-over',
                    itemSelector: 'div.thumb-wrap',
                    singleSelect : true,
                    plugins: new Ext.DataView.DragSelector({dragSafe:true}),
                    emptyText: 'No images to display',                    

                    listeners : {
                        click : function(dataview, index, node, e) {
                            var springPlayer = this;
                            var target = null;
                            // Player로 전환.
                            if((target = e.getTarget("a .player-play")) !== null) {
                                springPlayer.play(target.title,target.href);
                            // 새창에 소스 홈페이지 오픈.
                            } else if((target = e.getTarget("a .player-link")) !== null) {
                                window.open(target.href);
                            }
                        }.createDelegate(this)
                    }
                },

                 tbar : [
                     //  검색 콤보 박스
                     {
                         id: 'springplayer-serach-combo',
                         xtype: 'combo',
                         store: new Ext.data.ArrayStore({
                             fields: ['id', 'name'],
                             data : [['google', 'Youtube'],['daum', 'Daum']]
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
                         value : 'Youtube'
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
                     pageSize: 10,
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

        var config;
        config = {
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
                    id : 'springplayer-player',
                    xtype: 'iframepanel',
                    header: false,
                    tbar : [
                        "Title", ' ',
                        {
                            id : 'springplayer-player-title',
                            xtype : 'tbtext',
                            text : 'title'
                        }, '->',
                        {
                            text : "Close",
                            handler : function() {
                                 Ext.getCmp("springplayer-player").setSrc("about:blank");
                                 Ext.getCmp("springplayer-win").getLayout().setActiveItem(0);
                            }
                        }

                    ]
                }]
        };
        return config;
    },
    /* 내가 추가한 함수들 */
    /**
     * 플레이어를 호출 한다.
     * @param title
     * @param url
     */
    play : function(title, url) {        
        this.win.getLayout().setActiveItem(1);
        // url을 iframe에 넣기.
        Ext.getCmp("springplayer-player").setSrc(url);
        // 타이틀 변경
        Ext.getCmp("springplayer-player-title").setText(title);       

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

Ext.app.CustomLoadMask = Ext.extend(Ext.LoadMask, {
    /* Override */
    onLoad : function() {
        var self = this;
        window.setTimeout(function() {
            self.el.unmask(self.removeMask);
        }, 500);
    }
});