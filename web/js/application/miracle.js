M31Desktop.SpringPlayer = Ext.extend(M31.app.Module, {
    /*
     * Desktop에서 필요한 경우 호출하는 콜백 함수 정의 부.
     */
    init : function () {
        //console.log("Init Call.....");
    },
    createCallback : function (win) {
        //console.log("Create Call Back.....");
        if (undefined !== win) {
            this.win = win;
        }

        // Load Mask
        this.ds.loadMask = new Ext.app.CustomLoadMask(Ext.getCmp('springplayer-dataview').getEl(), {store: this.ds, msg: "Loading Video..."});
        // 검색창에 포커스 줌.. (바로 주면 포커스 못 받는 경우가 있어서 500ms후에 focus주도록 함.
        window.setTimeout(function () {
            Ext.getCmp('springplayer-serach-textfield').focus();
        }, 500);
    },
    beforeCreate : function () {
//        console.log("spring player beforeCreate");

        // 스토어
        this.ds = new Ext.data.JsonStore({
            url: '/gateway/springplayer/search',
            restful : true,
            remoteSort : true,

            root: 'items',

            fields : ['source', 'duration', 'author', 'title', 'thumbnailURL', 'playerURL', 'htmlLink'],

            listeners : {
                beforeload : function (store, options) {
                    store.loadMask.show();
                    var textfield = Ext.getCmp('springplayer-serach-textfield');
                    var combo = Ext.getCmp('springplayer-serach-combo');

                    // 페이징시 검색어가 안 넘어가서 추가.
                    if (options.params.q !== '') {
                        var q = textfield.getRawValue();
                        options.params.q = (q === null) ? '' : q;
                    }

                    options.params.type = combo.getValue();
                    options.params.limit = 10;

                    // 텍스트 필드나 콤보박스의 값이 바뀐후 페이징시..                  
                    if(!options.start) {
                        if (textfield.isDirty()) {
                            textfield.setValue(textfield.originalValue);
                            options.params.q = textfield.getRawValue();
                        }

                        if (combo.isDirty()) {
                            combo.setValue(combo.originalValue);
                            options.params.type = combo.getValue();
                        }
                    }

                    // 보이는건 Youtube지만 실제 전송되는 값은 google이여야 함.
                    if (options.params.type === 'Youtube') {
                        options.params.type = 'google';
                    }
                },
                load : function (store) {
                    var view = Ext.getCmp("springplayer-dataview-view");
                    Ext.getCmp("springplayer-dataview").body.scrollTo('top', 0);
                    // Dirty 채크를 위해서 검색어 저장.
                    var textfield = Ext.getCmp('springplayer-serach-textfield');
                    var combo = Ext.getCmp('springplayer-serach-combo');
                    textfield.originalValue = textfield.getValue();
                    combo.originalValue = combo.getValue();
                    if (!view.dragZone) {
                        view.dragZone = new MovieDragZone(view, {containerScroll: false, ddGroup: 'springfinderpenelDD',scroll:false});
                    }
                }
            }
        });

        this.thumbnailtpl = new Ext.XTemplate(
            '<tpl for="."><div class="thumb-wrap" id={thumbWrap}><table>',
            '<tr><td class="thumb" rowspan="3"><img class="thumb-img" src="{thumbnailURL}" alt="{title}"/></td><td><span><img class="player-icon" src="../../images/apps/springplayer/title.png"/>{title}</span></td></tr>',
            '<tr><td><span><img class="player-icon" src="../../images/apps/springplayer/author.png"/>{author}</span></td></tr>',
            '<tr><td>',
            '<tpl if="this.isPlayerURL(playerURL)"><a href="{playerURL}" class="player-play" title="{title}"><span><img class="player-icon" src="../../images/apps/springplayer/play.png"/>Play</span></a></tpl>',
            '<tpl if="!this.isPlayerURL(playerURL)"><span><img class="player-icon" src="../../images/apps/springplayer/play-disable.png"/>Play</span></tpl>',
            '<a href="{htmlLink}" class="player-link"><span><img class="player-icon" style="padding-right:2px;" src="../../images/apps/springplayer/link.png"/>{source}</span></a>',
            '<tpl if="this.isPlayerURL(playerURL)"><a href="{playerURL}" class="player-me2day"><img class="player-icon" src="../../images/apps/win-icon/springme2day_win_icon.png"/><span>Me2Day</span></a></tpl>',
            '<tpl if="!this.isPlayerURL(playerURL)"><img class="player-icon" src="../../images/apps/springplayer/springme2day-disable.png"/><span>Me2Day</span></tpl>',
            '</table></div></tpl>',
            {
                isPlayerURL : function(playerURL) {
                    return playerURL !== null && playerURL.length !== 0;
                }
            }
        );

        // 동영상 검색 부분
        this.serchePanel = new Ext.Panel({
            id : 'springplayer-serach',
            layout : 'border',

            items: [
                {
                    region : 'center',
                    xtype : 'panel',
                    id : 'springplayer-dataview',
                    autoScroll : true,
                    items : {
                        xtype : 'dataview',
                        id : 'springplayer-dataview-view',
                        store: this.ds,
                        tpl: this.thumbnailtpl,
                        overClass: 'x-view-over',
                        itemSelector: 'div.thumb-wrap',
                        singleSelect: true,
//                        plugins: new Ext.DataView.DragSelector({dragSafe: true}),
                        emptyText: '<div style="padding:10px;">검색된 동영상이 없습니다.</div>',

                        listeners : {
                            click : function (dataview, index, node, e) {
                                e.preventDefault();
                                var springPlayer = this;
                                var target = null;
                                // Player로 전환.
                                if ((target = e.getTarget("a .player-play")) !== null) {
                                    springPlayer.play(target.title, target.href);
                                // 새창에 소스 홈페이지 오픈.
                                } else if ((target = e.getTarget("a .player-link")) !== null) {
                                    window.open(target.href);
                                } else if ((target = e.getTarget("a .player-me2day")) !== null) {
                                    if (!M31.WindowsManager.getInstance().getWindow("springme2day")) {
                                         m31.util.notification({
                                             title: '봄 플레이어',
                                             text: '봄 미투데이가 실행된 상태에서만 보낼 수 있습니다.'
                                        });
                                    } else {
                                        M31.ApplicationRegistry.getInstance().getApp('springme2day').me2DayModule.gateway({
                                            appId: 'springplayer',
                                            url: target.href
                                        });
                                    }
                                }
                            }.createDelegate(this)
                        },

                        prepareData : function (data) {
                            data.thumbWrap = Ext.id();
                            return data;
                        }
                    },

                    tbar : [
                        //  검색 콤보 박스
                        {
                            id: 'springplayer-serach-combo',
                            xtype: 'combo',
                            store: new Ext.data.ArrayStore({
                                fields: ['id', 'name'],
                                data : [
                                    ['google', 'Youtube'],
                                    ['daum', 'Daum']
                                ]
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
                        },
                        '-',
                        // 검색 필드
                        new Ext.app.SearchField({
                            id: 'springplayer-serach-textfield',
                            width: 200,
                            store: this.ds,
                            paramName: 'q'
                        })
                    ],
                    // 페이징 툴바
                    bbar: new Ext.PagingToolbar({
                        pageSize: 10,
                        store : this.ds
                    })
                },
                {
                    title : 'FLASH SHAP',
                    collapsedTitle : 'FLASH SHAP',
                    region : 'south',
                    height : 110,
                    layout : 'fit',
                    id : 'springplayer-explorer-panel',
                    autoScroll : true,
                    items : new M31.app.SpringFinderPanel({
                        height : 110,
                        autoScroll : false,
                        border : false,
                        rootNodeName: 'springplayer',
                        id :'springfinder-panel-springplayer'
                    }),
                    collapsible: true,
                    split: true,
                    listeners: {
                        'afterlayout': { fn:function(sfp, sfpl) {
                            sfp.items.items[0].onResizez(sfp.getHeight());
                        }, scope:this, single:false}
                    }
                }
            ]
        });
    },
    removeWin: function () {
        //console.log("removeWin");
        // this.win = undefined;
    },
    createWindow : function () {
        //console.log("CreateWindow");

        var config;
        config = {
            title : 'Spring Player',
            width: 640,
            height: 480,
            minWidth: 640,
            minHeight: 480,
            constrain : true,
            hideMode : 'display',
            
            layout : 'card',
            activeItem : 0,

            items : [
                this.serchePanel,
                {
                    xtype : 'panel',
                    plugins: new Ext.ux.FlashPlugin(),
                    id : 'springplayer-player',
                    header: false,
                    tbar : [],

                    listeners : {
                        resize : function(win) {this.titleResize();}.createDelegate(this),
                        render : function(cmp) {
                            //console.log("re");
                            var tbar = cmp.getTopToolbar();
                            tbar.add("Title", '-',
                                {
                                    id : 'springplayer-player-title',
                                    xtype : 'tbtext',
                                    text : 'title',
                                    cls : 'overflowhide'

                                }, '->', {
                                    text : "돌아가기",
                                    handler : function () {
                                        var springPlayerWin = Ext.getCmp("springplayer-win");

                                        $(Ext.getCmp("springplayer-player").body.dom).html('<span></span>'); //급해서 제이쿼리로 땜빵..

                                        if(springPlayerWin.resizer.enabled === false) {
                                            if(springPlayerWin.maximized === false) {
                                                springPlayerWin.tools.maximize.show();
                                            } else {
                                                springPlayerWin.tools.restore.show();
                                            }
                                            springPlayerWin.resizer.enabled = true;
                                        }

                                        springPlayerWin.getLayout().setActiveItem(0);
                                }
                            });
                            
                            tbar.enableOverflow = false;

                            tbar.doLayout();
                        }
                    }
                }],

                listeners: {
                    beforeshow : function (cmp) {
                        cmp.setAnimateTarget(null);
                    }
                },

                toggleMaximize : function() {
                    if(Ext.getCmp("springplayer-win").resizer.enabled === true) {
                        return this[this.maximized ? 'restore' : 'maximize']();
                    }
                }
        };
        return config;
    },
    /* 내가 추가한 함수들 */
    /**
     * 플레이어를 호출 한다.
     * @param title
     * @param url
     */
    play : function (title, url) {
        var springPlayer = this;

        //다음 동영상일때는 창크기 고정 시킴.
        if(url.match(/^http:\/\/flvs.daum.net\/flvPlayer.swf/)) {
            springPlayer.win.tools.maximize.hide();
            springPlayer.win.tools.restore.hide();
            springPlayer.win.resizer.enabled = false;
        }

        Ext.getCmp("springplayer-win").getLayout().setActiveItem(1);
        Ext.getCmp("springplayer-player-title").setText(title);
        springPlayer.titleResize();
        Ext.getCmp("springplayer-player").loadFlash({swf : url});
    },
    /**
     * 동영상 타이틀을 Window 크기에 따라서 리사이즈.
     */
    titleResize : function() {
        var title_size = Ext.getCmp("springplayer-player").getTopToolbar().getWidth() - 100;
        //console.log(title_size);
        Ext.getCmp("springplayer-player-title").setSize(title_size);
    }
});

Ext.app.CustomLoadMask = Ext.extend(Ext.LoadMask, {
    /* Override */
    onLoad : function () {
        var self = this;
        window.setTimeout(function () {
            self.el.unmask(self.removeMask);
        }, 500);
    }
});

Ext.ux.FlashPlugin = function () {
    this.init = function (ct) {
        ct.flashTemplate = new Ext.XTemplate(
                '<object id="flash-{id}" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" width="{swfWidth}" height="{swfHeight}">',
                '<param name="movie" value="{swf}" />',
                '<param name="quality" value="high" />',
                '<param name="wmode" value="transparent" />',
                '<param name="flashvars" value="{computedflashvars}" />',
                '<param name="allowScriptAccess" value="domain" />',
                '<param name="align" value="t" />',
                '<param name="salign" value="TL" />',
                '<param name="swliveconnect" value="true" />',
                '<param name="scale" value="showall" />',
                '<embed name="flash-{id}" src="{swf}" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="{computedflashvars}" type="application/x-shockwave-flash" width="{swfWidth}" height="{swfHeight}" wmode="transparent" allowScriptAccess="always" swliveconnect="true" align="t" salign="TL" scale="showall"></embed>',
                '</object>');        
        ct.flashTemplate.compile();
        ct.renderFlash = function () {
            //console.log("render Flash");
            if (this.flashvars && (typeof this.flashvars === 'object')) {
                var tempflashvars = Ext.apply({}, this.flashvars);
                for (var key in tempflashvars) {
                    if (typeof tempflashvars[key] === 'function') {
                        tempflashvars[key] = tempflashvars[key].call(this, true);
                    }
                }
                this.computedflashvars = Ext.urlEncode(tempflashvars);
            }
            //this.swfHeight = this.body.getSize().height -2;
            //this.swfWidth = this.body.getSize().width -2;
            this.swfHeight = "100%";
            this.swfWidth = "100%";
//            if (this.body.first()) {
//                this.flashTemplate.overwrite(this.body.first(), this);
//            } else {
//                this.flashTemplate.insertFirst(this.body, this);
//            }
            this.flashTemplate.overwrite(this.body, this);
        };
        ct.loadFlash = function (config) {
            Ext.apply(this, config);
            this.renderFlash();
        };
        //ct.on('afterlayout',ct.renderFlash, ct);
    };
};

/**
 * Create a DragZone instance for our JsonView
 */
MovieDragZone = function (view, config) {
    this.view = view;
    MovieDragZone.superclass.constructor.call(this, view.getEl(), config);
};
Ext.extend(MovieDragZone, Ext.dd.DragZone, {
    // We don't want to register our image elements, so let's
    // override the default registry lookup to fetch the image
    // from the event instead
    onBeforeDrag : function (data, e) {
        var nodeData = this.view.getRecords(data.nodes);
        var items = [];
        var sw = false;
        Ext.each(nodeData, function (item) {
            if(!(item.data.playerURL)){
                sw = true;
            }
            items.push({
                'fileName': item.data.title,
                'fileAddition': item.data.playerURL
            });
        });
        data.isDragble = sw;
        data.isApp = true;
        data.linkAppId = 'springplayer';
        data.items = items;
    },
    getDragData : function (e) {
        var target = e.getTarget('.thumb-wrap');

        if (target) {
            var view = this.view;
            if (!view.isSelected(target)) {
                view.select(target);
            }
            var selNodes = view.getSelectedNodes();
            var dragData = {
                nodes: selNodes
            };

            if (selNodes.length === 1) {
                dragData.ddel = Ext.fly(target.id).child('img.thumb-img').dom;
                dragData.single = true;
            }

            return dragData;
        }
        return false;
    },
    // the default action is to "highlight" after a bad drop
    // but since an image can't be highlighted, let's frame it
    afterRepair: function () {
        for (var i = 0, len = this.dragData.nodes.length; i < len; i++) {
            Ext.fly(this.dragData.nodes[i]).frame('#8db2e3', 1);
        }
        this.dragging = false;
    },

    // override the default repairXY with one offset for the margins and padding
    getRepairXY : function (e) {
        if (!this.dragData.multi) {
            var xy = Ext.Element.fly(this.dragData.ddel).getXY();
            xy[0] += 3;
            xy[1] += 3;
            return xy;
        }
        return false;
    }
});
/***********************************************************************************************************************
 * 타임 로그
 ***********************************************************************************************************************/
M31Desktop.SpringTimeLog = Ext.extend(M31.app.Module, {
    init : function () {
    },

    beforeCreate : function () {
        // 타임로그 스토어
        this.store = new Ext.data.JsonStore({
            //url : "app/timelog/list",
            root : 'items',
            successProperty: 'success',
            // autoSave : false,

            proxy : new Ext.data.HttpProxy({
                api: {
                    read    : '/app/timelog/list',
                    create  : '/app/timelog/add',
                    update  : '/app/timelog/update',
                    destroy : '/app/timelog/delete'
                }
            }),

            writer : new Ext.data.JsonWriter({
                encode: true,
                writeAllFields: true,
                listful : true
            }),

            idProperty : 'id',

            fields : [
                {
                    name : 'id'
                },
                {
                    name : 'thing'
                },
                {
                    name : 'regDate'
                },
                {
                    name : 'thingID'
                },
                {
                    name : 'memberID',
                    defaultValue : 0
                }
            ]
        });
        
       this.thingStore = new Ext.data.JsonStore({
            root : 'items',
            idProperty : 'id',

            proxy : new Ext.data.HttpProxy({
                api: {
                    read    : '/app/timelog/thing/list',
                    create  : '/app/timelog/thing/add',
                    update  : '/app/timelog/thing/update',
                    destroy : '/app/timelog/thing/delete'
                }
            }),

            writer : new Ext.data.JsonWriter({
                encode: true,
                writeAllFields: true,
                listful : true
            }),

            fields : [
                {
                    name : 'id'
                },
                {
                    name : 'viewOrder'
                },
                {
                    name : 'thing'
                }
            ],

            listeners : {
                write : function (store, action, result, res, rs) {
                    if (action === 'create') {
                        store.load();
                    }
                },
                load : function (store, records, options) {
                    var tbar = Ext.getCmp("timelog-LogGrid").getTopToolbar();
                    if (tbar !== null) {
                        //툴바 초기화.
                        tbar.removeAll(true);

                        // 기본 버튼 생성
                        tbar.add({
                            text : '추가',
                            xtype : 'button',
                            handler : function (b, e) {
                                Ext.MessageBox.prompt('Thing', '새로운 할일:', function (btn, text) {
                                    if (btn === 'ok') {
                                        if (text !== '') {
                                            var record = new store.recordType({
                                                thing : text
                                            });

                                            store.add(record);
                                        } else {
                                            Ext.MessageBox.alert("Alert", "새로운 할일을 잘 못 입력하셨습니다.");
                                        }
                                    }
                                });
                            }}, '-');

                        // Thing 버튼 생성
                        var buutonHandler =  function (b, e, thingID) {
//                                    console.log("Thing 클릭.. : " + thingID);
//                                    console.log(b.getText());
                                    var store = Ext.getCmp("timelog-LogGrid").getStore();

                                    var record = new store.recordType({
                                        thing : b.text,
                                        regDate : new Date().format('Y-m-d H:i:s'),
                                        thingID : thingID,
                                        memberID : 0
                                    });

//                                    console.log(store);

                                    store.add(record);
                                    Ext.getCmp("timelog-LogGrid").doLayout();
                                    //store.commitChanges()
                                    //store.save();
                        };

                        var i;
                        for (i = 0; i < records.length; i++) {
                            tbar.add({
                                text : records[i].get('thing'),
                                xtype : 'button',
                                handler : buutonHandler.createDelegate(tbar, records[i].get('id'), true)
                            });
                        }
                        tbar.doLayout();
                    } else {
                        //console.log("[WRAN] Toptoolbar is not exist.")
                    }
                }
            }
        });

       this.statisticsStore = new Ext.data.JsonStore({
           root : 'items',
           url : '/app/timelog/stat',

           fields : [{
               name : 'thing'
            },{
               name : 'time'
           }],

           listeners : {
               load : function (store, records, options) {
                   var cmp = Ext.getCmp("timelog-statistics");

                   //body 초기화. (구글 차트가 계속 append 됨.)
                   Ext.DomHelper.overwrite(cmp.body, "<span></span>");

                   var data = new google.visualization.DataTable();
                   data.addColumn('string', 'Task');
                   data.addColumn('number', 'Second per Day');

                   for(var i=0; i<records.length; i++) {
                       data.addRow([
                        records[i].get('thing'), records[i].get('time')
                       ]);
                   }

                   // Instantiate and draw our chart, passing in some options.
                   var chart = new google.visualization.PieChart(cmp.body.dom);
                   chart.draw(data, {width: 282, height: 311, is3D: true, legend : 'bottom', pieJoinAngle  : 5});
               }
           }

       });

        // 로그 패널
        this.log = new Ext.grid.GridPanel({
            id : 'timelog-LogGrid',
            border : false,
            loadMask : true,
            disableSelection : true,

            store : this.store,
            colModel : new Ext.grid.ColumnModel({
                columns : [
                    {
                        header : 'Thing',
                        dataIndex : 'thing'
                    },
                    {
                        header : 'Time',
                        dataIndex : 'regDate'
                    }
                ],
                defaults: {
                    menuDisabled: true,
                    sortable: false
                }
            }),

            viewConfig : {
                forceFit:true,
                listeners : {
                    rowsinserted : function(view, firstRow,lastRow ) {
                        view.focusRow(lastRow);
                    }
                }
            },

            // TopToolbar는 동적으로 생성.
            tbar : []
        });

        // 통계패널
        this.statistics = new Ext.Panel({
            id : 'timelog-statistics',
            title: 'statistics',
            layout : 'fit',

            tbar : [{
                xtype: 'datefield',
                id: 'timelog-datefild',
                editable: false,
                format: 'Y-m-d',
                value: new Date(),
                width: 100
            }, '-', {
                text : '통계 보기',
                handler : function () {
                    var player = this;
                    var date = Ext.getCmp('timelog-datefild').getValue();
                    var dateStr = date.format('Y-m-d');
                    player.statisticsStore.load({params: {regDate : dateStr}});
                }.createDelegate(this)
            }]
        });

    },

    createWindow : function () {
        var opt = {
            id : 'timelog',
            layout:'fit',
            width:300,
            height:400,
            maximizable : false,
            constrainHeader:true,
            resizeHandles : 'n s',

            items : new Ext.TabPanel({
                id : 'timelog-tabPanel',
                activeTab : 0,
                items : [
                    {
                        title : 'log',
                        layout : 'fit',
                        items : this.log
                    },
//                    {
//                        title : 'history',
//                        layout : 'fit',
//                        html : 'History'
//                    },
                    this.statistics
                ]
            }),

            listeners : {
                render : function (win) {
                    // Time Log Load
                    this.store.load({
                        params : {
                            regDate : new Date().format('Y-m-d')
                        }
                    });

                    this.thingStore.load();
                }.createDelegate(this),

                close : function (win) {
                    Ext.Ajax.request({
                        url : '/app/timelog/end'
                    });

                }
            }
        };
        return opt;
    },

    createCallback : function (win) {
        //console.log("CreateCallback");
    }
});