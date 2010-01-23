/**
 * @author outsider
 */

// Spring See
M31Desktop.SpringSee = Ext.extend(M31.app.Module, {
    source : [
        ['all', "통합검색"],
        ['google', 'Google'],
        ['daum', 'Daum'],
        ['naver', 'Naver'],
        ['flickr', 'Flickr']
    ],
    currentPage:1,
    lookup : {},
    init : function() {
        //필요한 JS
//        m31.util.requiredJS("pirobox");
    },

    createView : function() {
        var formatSize = function(data) {
            if (data.size < 1024) {
                return data.size + " bytes";
            } else {
                return (Math.round(((data.size * 10) / 1024)) / 10) + " KB";
            }
        };

        var formatData = function(data) {
            this.lookup[data.title] = data;
            return data;
        };

        return new Ext.DataView({
            tpl: this.thumbTemplate,
            id: 'springsee-dataview',
            singleSelect: true,
            overClass:'x-view-over',
            itemSelector: 'div.thumb-wrap',
            emptyText : '<div style="padding:10px;">No images match the specified search</div>',
            plugins: new Ext.DataView.DragSelector({dragSafe:true}),
            store: this.store,
            listeners: {
                'loadexception'  : {fn:this.onLoadException, scope:this},
                'beforeselect'   : {fn:function(view) {
                    return view.store.getRange().length > 0;
                }}
            },
            prepareData: function(data) {
                this.lookup[data.title] = data;
                return data;
            }.createDelegate(this)
        });
    },

    /**
     *  해당 app의 window가 제거 될때 호출되는 콜백.
     */
    removeWin: function() {
        this.view = undefined;
        this.win = undefined;
        this.dragZone = undefined;
        this.store = undefined;
    },

    /**
     *  윈도우를 생성하기 직전에 호출되는 펑션.
     */
    beforeCreate : function() {
        if (!this.view) {
            this.view = this.createView();
        }

        this.initTemplates();

        this.store = new Ext.data.JsonStore({
            url: '/gateway/springsee/search',
            method: 'GET',
            root: 'imgInfo',
            autoload: true,
            fields: [
                'title', 'thumbnail', 'image'
            ],
            listeners: {
                beforeload : function(store, options) {
                    store.loadMask.show();
                },
                'load': { fn:function() {
                    Ext.getCmp("springsee-view").body.scrollTo('top', 0);
                    Ext.getCmp("springsee-api-provider").originalValue = Ext.getCmp("springsee-api-provider").getValue();
                    Ext.getCmp("springsee-search").originalValue = Ext.getCmp("springsee-search").getValue();
                    this.view.select(0);
                    m31.showImage();
                    $("#springsee-view-body div.x-panel-body div:first").height($("#springsee-view-body").height());
                    if (!this.dragZone) {
                        this.dragZone = new ImageDragZone(this.view, {containerScroll:false, ddGroup: 'springfinderpenelDD',scroll:false});
                    }
                }, scope:this, single:false
                }
            }
        });

        this.view = new Ext.DataView({
            tpl: this.thumbTemplate,
            id: 'springsee-dataview',
            singleSelect: true,
            overClass:'x-view-over',
            itemSelector: 'div.thumb-wrap',
            emptyText : '<div style="padding:10px;">No images match the specified search</div>',
            plugins: new Ext.DataView.DragSelector({dragSafe:true}),
            store: this.store,
            listeners: {
                'loadexception'  : {fn:this.onLoadException, scope:this},
                'beforeselect'   : {fn:function(view) {
                    return view.store.getRange().length > 0;
                }}
            },
            prepareData: function(data) {
                M31.ApplicationRegistry.getInstance().getApp('springsee').lookup[data.title] = data;
                return data;
            }
        });
        this.view.on("contextmenu", this.onContextClick, this);
        this.view.on("containercontextmenu", this.onContainerContextClick, this);
    },

    /**
     *  윈도우를 생성된후에 호출되는 펑션.
     */
    createCallback : function(win) {
        if (!this.win) {
            this.win = win;
        }

        this.store.loadMask = new Ext.LoadMask(Ext.getCmp('springsee-view').getEl(), {store: this.store, msg:"Loading Images..."});
        setTimeout(function() {
            $("#springsee-search").focus();
        }, 800);
    },

    createWindow : function () {
        var otp = {
            layout: 'border',
            width: 680,
            height: 480,
            minWidth: 680,
            minHeight: 480,
            closeAction: 'close',
            constrainHeader:true,
            border: false,
            listeners: {
                'resize'  : {fn:function(win, width, height) {
                    $("#springsee-view-body div.x-panel-body div:first").height(0);
                }, scope:this},
                'afterlayout'  : {fn:function(win, width, height) {
                    var toHeight = $("#springsee-view").height();
                    if ($("#springsee-view-body").height() < toHeight) {
                        toHeight -= 32;
                    }
                    $("#springsee-view-body div.x-panel-body div:first").height(toHeight);
                }, scope:this, single:false}
            },
            items:[
                {
                    id: 'springsee-view',
                    region: 'center',
                    autoScroll: true,
                    items: {
                        xtype: 'panel',
                        id: 'springsee-view-body',
                        items:this.view
                    },
                    tbar:[
                        {
                            id: 'springsee-api-provider',
                            xtype: 'combo',
                            store: new Ext.data.ArrayStore({
                                fields: ['id', 'name'],
                                data : this.source
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
                            value: 'all'
                        },
                        ' ',
                        '-',
                        'Search:',
                        {
                            xtype: 'textfield',
                            id: 'springsee-search',
                            selectOnFocus: true,
                            width: 100,
                            enableKeyEvents: true,
                            listeners: {
                                'keypress'  : {fn:function(cmp, evt) {
                                    if (evt.keyCode == Ext.EventObject.ENTER) {
                                        this.getImages();
                                    }
                                }, scope:this}
                            }
                        },
                        {
                            id: 'springsee-send-btn',
                            xtype: 'button',
                            text: 'Send',
                            handler: this.getImages,
                            scope: this
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            id: 'springsee-prev-btn',
                            xtype: 'button',
                            text: 'Prev',
                            disabled: true,
                            handler: this.getImages.createDelegate(this, [-1], true),
                            scope: this
                        },
                        {
                            id: 'springsee-Next-btn',
                            xtype: 'button',
                            text: 'Next',
                            disabled: true,
                            handler: this.getImages.createDelegate(this, [1], true),
                            scope: this
                        }
                    ]
                },
                {
                    region: 'south',
                    title: '봄씨 앨범',
                    xtype: 'panel',
                    layout:'fit',
                    collapsedTitle: '봄씨 앨범',
                    autoScroll : true,
                    id: 'springsee-explorer-panel',
                    collapsible: true,
                    collapsed:false,
                    split: true,
                    height: 110,
                    items: new M31.app.SpringFinderPanel({
                        height : 110,
                        border : false,
                        rootNodeName: 'springsee',
                        id :'springfinder-panel-springsee'

                    }),
                    listeners: {
                        'afterlayout': { fn:function() {
                            Ext.getCmp('springsee-explorer-panel').items.items[0].onResizez(Ext.fly('springsee-explorer-panel').getSize().height);
                        }, scope:this, single:false}
                   }
                }
            ]
        };

        return otp;
    },

    initTemplates : function() {
        this.thumbTemplate = new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><a href="{image}" class="pirobox_gall" title="{title}"><img src="{thumbnail}" title="{title}"></a></div>',
                '</div>',
                '</tpl>'
                );
        this.thumbTemplate.compile();
    },

    onLoadException : function(v, o) {
        this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>');
    },
    alertCB : function(){
        jQuery('springsee-search').focus();
    },
    //이미지 검색하기
    getImages : function(button, event, cmd) {
        var combo = Ext.getCmp('springsee-api-provider');
        var search = Ext.getCmp('springsee-search');

        if (Ext.isEmpty(Ext.getCmp('springsee-search').getValue())) {
//            alert("검색어를 입력하세요.");
            Ext.Msg.alert('봄씨', '검색어를 입력하세요.',this.alertCB);
            return;
        }
        if (cmd) {
            this.currentPage += parseInt(cmd);
        } else {
            this.currentPage = 1;
        }
        if (this.currentPage < 1) {
            this.currentPage = 1;
            return;
        }
        //검색조건이 변경되었으면, 다시 검색함.
        if (combo.isDirty() || search.isDirty()) {
            this.currentPage = 1;
        }

        this.store.reload({
            params: {
                search_type: combo.getValue(),
                query:          search.getValue(),
                pageNo:         this.currentPage
            }
        });

        Ext.getCmp('springsee-prev-btn').enable();
        Ext.getCmp('springsee-Next-btn').enable();
    },

    // contextMenu
    onContextClick : function(view, index, obj, evt) {
        this.linkUrl = this.store.getAt(index).data.image;
        this.checkClipboard = false;

        if (!this.menu) { // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                id:'springsee-ctx',
                items: [
                    {
                        iconCls: 'new-win',
                        text: '새창으로 이미지 보기',
                        scope:this,
                        handler: function() {
                            window.open(this.linkUrl);
                        }
                    },
                    {
                        iconCls: 'new-win',
                        id: 'springsee-copymenu',
                        text: '이미지주소 복사하기',
                        scope:this
                    },
                    '-',
                    {
                        text:'봄미투데이로 전송하기',
                        scope:this,
                        handler: function() {
                            if (!M31.WindowsManager.getInstance().getWindow("springme2day")) {
                                m31.util.notification({
                                    title: '봄씨',
                                    text: '봄 미투데이가 실행된 상태에서만 보낼 수 있습니다.'
                                });
                            } else {
                                M31.ApplicationRegistry.getInstance().getApp('springme2day').me2DayModule.gateway({
                                    appId: 'springsee',
                                    url: this.linkUrl
                                });
                            }
                        }
                    },
                    {
                        text:'봄트위터로 전송하기',
                        scope:this,
                        handler: function() {
                            if (!M31.WindowsManager.getInstance().getWindow("springtwitter")) {
                                m31.util.notification({
                                    title: '봄씨',
                                    text: '봄트위터가 실행된 상태에서만 보낼 수 있습니다.'
                                });
                            } else {
                                M31.ApplicationRegistry.getInstance().getApp('springtwitter').receiveURL(this.linkUrl);
                            }
                        }
                    },
                    {
                        text:'배경화면 지정하기',
                        scope:this,
                        handler: function() {
                            m31.util.notification({title:'봄씨',text:'준비중입니다...',remove:true});
                        }
                    }
                ]
            });
            this.menu.on('hide', function() {
                setTimeout("M31.ApplicationRegistry.getInstance().getApp('springsee').clipboard.destroy();", 500);
            }, this);
        }
        evt.stopEvent();
        this.menu.showAt(evt.getXY());

        this.clipboard = new ZeroClipboard.Client();
        this.clipboard.glue('x-menu-el-springsee-copymenu');
        this.clipboard.setText(this.store.getAt(index).data.image);
        this.clipboard.addEventListener('onMouseOver', function(client) {
            $("#x-menu-el-springsee-copymenu").addClass("x-menu-item-active");
        });
        this.clipboard.addEventListener('onMouseOut', function(client) {
            $("#x-menu-el-springsee-copymenu").removeClass("x-menu-item-active");
        });
    },
    onContainerContextClick : function(view, e) {
        e.stopEvent();
    }

});

m31.showImage = function() {
    $().piroBox({
    	target: 'springsee-dataview',
        eventName:'dblclick',
        my_speed: 600, //animation speed
        bg_alpha: 0.5, //background opacity
        radius: 4, //caption rounded corner
        scrollImage : false, // true == image follows the page, false == image remains in the same open position
        pirobox_next : 'piro_next', // Nav buttons -> piro_next == inside piroBox , piro_next_out == outside piroBox
        pirobox_prev : 'piro_prev',// Nav buttons -> piro_prev == inside piroBox , piro_prev_out == outside piroBox
        slideShow : 'slideshow', // just delete slideshow between '' if you don't want it.
        slideSpeed : 4 //slideshow duration in seconds(3 to 6 Recommended)
    });
};

/**
 * Create a DragZone instance for our JsonView
 */
ImageDragZone = function(view, config) {
    this.viewClone = view;
    ImageDragZone.superclass.constructor.call(this, view.getEl(), config);
};
Ext.extend(ImageDragZone, Ext.dd.DragZone, {
    onBeforeDrag : function(data, e) {
        var nodeData = this.viewClone.getRecords(data.nodes);
        var items = new Array();
        Ext.each(nodeData, function(item) {
            items.push({
                'fileName': item.data.title,
                'fileAddition': item.data.image
            });
        });

        data.isApp = true;
        data.linkAppId = 'springsee';
        data.items = items;
    },
    getDragData : function(e) {
        var target = e.getTarget('.thumb-wrap');
        if (target) {
            var view = this.viewClone;
            if (!view.isSelected(target)) {
                view.onClick(e);
            }
            var selNodes = view.getSelectedNodes();
            var dragData = {
                nodes: selNodes
            };

            if (selNodes.length == 1) {
                dragData.ddel = target;
                dragData.single = true;
            } else {
                var div = document.createElement('div'); // create the multi element drag "ghost"
                div.className = 'multi-proxy';
                for (var i = 0, len = selNodes.length; i < len; i++) {
                    div.appendChild(selNodes[i].firstChild.firstChild.cloneNode(true)); // image nodes only
                    if ((i + 1) % 3 == 0) {
                        div.appendChild(document.createElement('br'));
                    }
                }
                var count = document.createElement('div'); // selected image count
                count.innerHTML = i + ' images selected';
                div.appendChild(count);

                dragData.ddel = div;
                dragData.multi = true;
            }

            return dragData;
        }
        return false;
    },
    afterRepair:function() {
        for (var i = 0, len = this.dragData.nodes.length; i < len; i++) {
            Ext.fly(this.dragData.nodes[i]).frame('#8db2e3', 1);
        }
        this.dragging = false;
    },
    getRepairXY : function(e) {
        if (!this.dragData.multi) {
            var xy = Ext.Element.fly(this.dragData.ddel).getXY();
            xy[0] += 3;
            xy[1] += 3;
            return xy;
        }
        return false;
    }
});
/*
 ************************
 *	봄트위터
 **************************
 */
M31Desktop.SpringTwitter = Ext.extend(M31.app.Module, {
    init : function() {
    },

    //  해당 app의 window가 제거 될때 호출되는 콜백.
    removeWin: function() {
        this.win = undefined;
        if(this.startForm)this.startForm.destroy();
        if(this.authGuide)this.authGuide.destroy();
        if(this.writeForm)this.writeForm.destroy(); 
        this.loadTimeline = undefined;
        this.loadMentions = undefined;
        this.loadDM = undefined;
        
        if (this.timer !== null) {
        	clearTimeout(this.timer);
        	this.timer = null;
        }
        if (this.intervalID !== null) {
            clearInterval(this.intervalID);
            this.intervalID
        }
    },

    //  윈도우를 생성하기 직전에 호출되는 펑션.
    beforeCreate : function() {
    	// JsonStore
    	this.loadTimeline = new Ext.data.JsonStore({
            url: '/app/twitter/timeline',
            method: 'GET',
            root: 'timeline',
            autoload: true,
            fields: [
                'id', 'url', 'screenName', 'createAt', 'profileImageUrl', 'source', 'text'
            ],
            sortInfo: {
                field: 'createAt',
                direction: 'DESC'
            },
            listeners: {
                'load': { fn:function() {
                    var self = M31.ApplicationRegistry.getInstance().getApp('springtwitter');
                    self.reloadStatus++;
                    if (self.reloadStatus >= 3) {
                        Ext.getCmp("springtwitter-statusReload").hide();
                        self.reloadStatus = 0;
                        self.setTimer();
                    }
                }, scope:this, single:false
                }
            }
        });

        this.loadMentions = new Ext.data.JsonStore({
            url: '/app/twitter/mentions',
            method: 'GET',
            root: 'mentions',
            fields: [
                'url', 'screenName', 'createAt', 'profileImageUrl', 'source', 'text'
            ],
            listeners: {
                'load': { fn:function() {
                    var self = M31.ApplicationRegistry.getInstance().getApp('springtwitter');
                    self.reloadStatus++;
                    if (self.reloadStatus >= 3) {
                        Ext.getCmp("springtwitter-statusReload").hide();
                        self.reloadStatus = 0;
                        self.setTimer();
                    }
                }, scope:this, single:false
                }
            }
        });

        this.loadDM = new Ext.data.JsonStore({
            url: '/app/twitter/directMessages',
            method: 'GET',
            root: 'directMessages',
            fields: [
                'url', 'screenName', 'createAt', 'profileImageUrl', 'source', 'text'
            ],
            listeners: {
                'load': { fn:function() {
                    var self = M31.ApplicationRegistry.getInstance().getApp('springtwitter');
                    self.reloadStatus++;
                    if (self.reloadStatus >= 3) {
                        Ext.getCmp("springtwitter-statusReload").hide();
                        self.reloadStatus = 0;
                        self.setTimer();
                    }
                }, scope:this, single:false
                }
            }
        });
    	
        this.startForm = this.createStartForm();
        this.authGuide = this.createAuthGuide();
        this.writeForm = this.createWriteForm();
    },

    // 윈도우를 생성된후에 호출되는 펑션.
    createCallback : function(win) {
        if (!this.win) {
            this.win = win;
        }
        
        this.startForm.getForm().submit({
            url:'/app/twitter/requestAuthorization',
            waitMsg:'Loading...',
            timeout: 15
        });
    },

    createWindow : function() {
        var otp = {
            layout: 'card',
            width: 400,
            height: 200,
            head: false,
            maximizable: false,
            resizeHandles: 'n s',
            closeAction: 'close',
            constrainHeader:true,
            border: false,
            activeItem: 0,
            items:[
                this.startForm,
                this.authGuide,
                new Ext.Panel({
                    id : 'springtwitter-panel',
                    layout: 'border',
                    items: [
                        this.writeForm,
                        new Ext.TabPanel({
                            id: 'springtwitter-view',
                            activeTab: 0,
                            region: 'center',
                            padding: '5px 5px 5px 5px',
                            defaults:{autoScroll: true},
                            items:[
                                {
                                    title: 'All Friends',
                                    xtype: 'panel',
                                    id: 'springtwitter-view-friends',

                                    items: [
                                        {
                                            xtype : 'dataview',
                                            id: "springtwitter-friends-dataview",
                                            tpl: this.timelineTemplate,
                                            singleSelect: true,
                                            overClass:'x-view-over',
                                            region: 'center',
                                            itemSelector: 'div.springtwitter-tweet',
                                            emptyText : '',
                                            store: this.loadTimeline,
                                            prepareData: function(data) {
                                                data.createAt = new Date(data.createAt).toLocaleString();
                                                data.category = "timeline";
                                                data.rowText = data.text;
                                                data.text = m31.util.replaceURLtoLink(data.text);
                                                data.text = M31.ApplicationRegistry.getInstance().getApp('springtwitter').addLinktoText(data.text);
                                                return data;
                                            }
                                        }
                                    ],
                                    listeners: {
                                        beforerender: function() {
                                        },
                                        beforeshow: function() {
                                        },
                                        'afterrender': {fn:function() {

                                            Ext.select("#springtwitter-view-friends").on('click', function(e, t) {
                                                if (t.tagName.toLowerCase() === "a" || $(t).parent()[0].tagName.toLowerCase() === "a") {
                                                    if (t.href) {
                                                        window.open(t.href);
                                                    } else {
                                                        window.open($(t).parent().attr("href"));
                                                    }
                                                } else if (t.className === "twitter-morebtn") {
                                                    M31.ApplicationRegistry.getInstance().getApp('springtwitter').reloadStatus = 2;
                                                    Ext.getCmp("springtwitter-statusReload").show();
                                                    M31.ApplicationRegistry.getInstance().getApp("springtwitter").loadTimeline.load({
                                                        add:true,
                                                        params:{
                                                            pageno: ++M31.ApplicationRegistry.getInstance().getApp("springtwitter").diretMessageCurrentPage,
                                                            count: 20
                                                        }
                                                    });
                                                } else if (t.className === "springtwitter-reply") {
                                                    var target = Ext.getCmp("springtwitter-writeTweet");

                                                    if (target.collapsed) {
                                                        target.toggleCollapse(true);
                                                    }
                                                    var selectedData = Ext.getCmp("springtwitter-friends-dataview").getSelectedRecords()[0].data;
                                                    var postTarget = $("#springtwitter-tweetPost");
                                                    postTarget.val("@" + selectedData.screenName + " " + postTarget.val());
                                                    setTimeout(function() {
                                                        $("#springtwitter-tweetPost").focus();
                                                    }, 500);
                                                    Ext.getCmp("springtwitter-replyToId").setValue(selectedData.id);
                                                    Ext.getCmp("springtwitter-postSend").setText("Reply");
                                                    M31.ApplicationRegistry.getInstance().getApp('springtwitter').replyTag = Ext.fly('springtwitter-tweetPost').getValue().length;
                                                } else if (t.className === "springtwitter-retweet") {
                                                    var target = Ext.getCmp("springtwitter-writeTweet");

                                                    if (target.collapsed) {
                                                        target.toggleCollapse(true);
                                                    }
                                                    var selectedData = Ext.getCmp("springtwitter-friends-dataview").getSelectedRecords()[0].data;
                                                    var postTarget = $("#springtwitter-tweetPost");
                                                    postTarget.val("RT @" + selectedData.screenName + " " + selectedData.rowText);
                                                    M31.ApplicationRegistry.getInstance().getApp('springtwitter').bodyTextLengthUpdate();
                                                    setTimeout(function() {
                                                        $("#springtwitter-tweetPost").focus();
                                                    }, 800);
                                                    Ext.getCmp("springtwitter-replyToId").setValue(0);
                                                    Ext.getCmp("springtwitter-postSend").setText("Update");
                                                } else if (t.className === "springtwitter-message") {
                                                    var target = Ext.getCmp("springtwitter-writeTweet");

                                                    if (target.collapsed) {
                                                        target.toggleCollapse(true);
                                                    }
                                                    var selectedData = Ext.getCmp("springtwitter-friends-dataview").getSelectedRecords()[0].data;
                                                    var postTarget = $("#springtwitter-tweetPost");
                                                    postTarget.val("d " + selectedData.screenName + " ");
                                                    M31.ApplicationRegistry.getInstance().getApp('springtwitter').bodyTextLengthUpdate();
                                                    setTimeout(function() {
                                                        $("#springtwitter-tweetPost").focus();
                                                    }, 800);
                                                    Ext.getCmp("springtwitter-replyToId").setValue(0);
                                                    Ext.getCmp("springtwitter-postSend").setText("Update");
                                                }
                                            });
                                        }, scope:this, single:true}
                                    }
                                },
                                {
                                    title: 'Mentions',
                                    xtype: 'panel',
                                    id: 'springtwitter-view-mentions',
                                    items: [
                                        {
                                            xtype : 'dataview',
                                            id: "springtwitter-mentions-dataview",
                                            tpl: this.timelineTemplate,
                                            singleSelect: true,
                                            overClass:'x-view-over',
                                            itemSelector: 'div.springtwitter-tweet',
                                            emptyText : '',
                                            store: this.loadMentions,
                                            prepareData: function(data) {
                                                data.createAt = new Date(data.createAt).toLocaleString();
                                                data.category = "mentions";
                                                data.text = m31.util.replaceURLtoLink(data.text);
                                                data.text = M31.ApplicationRegistry.getInstance().getApp('springtwitter').addLinktoText(data.text);
                                                return data;
                                            }
                                        }
                                    ],
                                    listeners: {
                                        beforerender: function(sender, adjWidth, adjHeight, rawWidth, rawHeight) {
                                        },
                                        beforeshow: function(sender, adjWidth, adjHeight, rawWidth, rawHeight) {
                                        },
                                        'afterrender': {fn:function(sender, adjWidth, adjHeight, rawWidth, rawHeight) {
                                            Ext.select("#springtwitter-view-mentions").on('click', function(e, t) {
                                                if (t.tagName.toLowerCase() === "a" || $(t).parent()[0].tagName.toLowerCase() === "a") {
                                                    if (t.href) {
                                                        window.open(t.href);
                                                    } else {
                                                        window.open($(t).parent().attr("href"));
                                                    }
                                                } else if (t.className === "twitter-morebtn") {
                                                    M31.ApplicationRegistry.getInstance().getApp('springtwitter').reloadStatus = 2;
                                                    Ext.getCmp("springtwitter-statusReload").show();
                                                    M31.ApplicationRegistry.getInstance().getApp("springtwitter").loadMentions.load({
                                                        add:true,
                                                        params:{
                                                            pageno: ++M31.ApplicationRegistry.getInstance().getApp("springtwitter").diretMessageCurrentPage,
                                                            count: 20
                                                        }
                                                    });
                                                } else if (t.className === "springtwitter-reply") {
                                                    var target = Ext.getCmp("springtwitter-writeTweet");

                                                    if (target.collapsed) {
                                                        target.toggleCollapse(true);
                                                    }
                                                    var selectedData = Ext.getCmp("springtwitter-mentions-dataview").getSelectedRecords()[0].data;
                                                    var postTarget = $("#springtwitter-tweetPost");
                                                    postTarget.val("@" + selectedData.screenName + " " + postTarget.val());
                                                    setTimeout(function() {
                                                        $("#springtwitter-tweetPost").focus();
                                                    }, 500);
                                                    Ext.getCmp("springtwitter-replyToId").setValue(selectedData.id);
                                                    Ext.getCmp("springtwitter-postSend").setText("Reply");
                                                    M31.ApplicationRegistry.getInstance().getApp('springtwitter').replyTag = Ext.fly('springtwitter-tweetPost').getValue().length;
                                                } else if (t.className === "springtwitter-retweet") {
                                                    var target = Ext.getCmp("springtwitter-writeTweet");

                                                    if (target.collapsed) {
                                                        target.toggleCollapse(true);
                                                    }
                                                    var selectedData = Ext.getCmp("springtwitter-mentions-dataview").getSelectedRecords()[0].data;
                                                    var postTarget = $("#springtwitter-tweetPost");
                                                    postTarget.val("RT @" + selectedData.screenName + " " + selectedData.rowText);
                                                    M31.ApplicationRegistry.getInstance().getApp('springtwitter').bodyTextLengthUpdate();
                                                    setTimeout(function() {
                                                        $("#springtwitter-tweetPost").focus();
                                                    }, 800);
                                                    Ext.getCmp("springtwitter-replyToId").setValue(0);
                                                    Ext.getCmp("springtwitter-postSend").setText("Update");
                                                } else if (t.className === "springtwitter-message") {
                                                    var target = Ext.getCmp("springtwitter-writeTweet");

                                                    if (target.collapsed) {
                                                        target.toggleCollapse(true);
                                                    }
                                                    var selectedData = Ext.getCmp("springtwitter-mentions-dataview").getSelectedRecords()[0].data;
                                                    var postTarget = $("#springtwitter-tweetPost");
                                                    postTarget.val("d " + selectedData.screenName + " ");
                                                    M31.ApplicationRegistry.getInstance().getApp('springtwitter').bodyTextLengthUpdate();
                                                    setTimeout(function() {
                                                        $("#springtwitter-tweetPost").focus();
                                                    }, 800);
                                                    Ext.getCmp("springtwitter-replyToId").setValue(0);
                                                    Ext.getCmp("springtwitter-postSend").setText("Update");
                                                }
                                            });
                                        }, scope:this, single:true}
                                    }
                                },
                                {
                                    title: 'Direct Message',
                                    xtype: 'panel',
                                    id: 'springtwitter-view-dm',
                                    items: [
                                        {
                                            xtype : 'dataview',
                                            id: "springtwitter-direcmessage-dataview",
                                            tpl: this.timelineTemplate,
                                            singleSelect: true,
                                            overClass:'x-view-over',
                                            itemSelector: 'div.springtwitter-tweet',
                                            emptyText : '',
                                            store: this.loadDM,
                                            prepareData: function(data) {
                                                data.createAt = new Date(data.createAt).toLocaleString();
                                                data.category = "directmessage";
                                                data.text = m31.util.replaceURLtoLink(data.text);
                                                data.text = M31.ApplicationRegistry.getInstance().getApp('springtwitter').addLinktoText(data.text);
                                                return data;
                                            }
                                        }
                                    ],
                                    listeners: {
                                        beforerender: function(sender, adjWidth, adjHeight, rawWidth, rawHeight) {
                                        },
                                        'beforeshow': {fn:function(sender, adjWidth, adjHeight, rawWidth, rawHeight) {
                                        }, scope:this, single:true},
                                        'afterrender': {fn:function(sender, adjWidth, adjHeight, rawWidth, rawHeight) {
                                            Ext.select("#springtwitter-view-dm").on('click', function(e, t) {
                                                if (t.tagName.toLowerCase() === "a" || $(t).parent()[0].tagName.toLowerCase() === "a") {
                                                    if (t.href) {
                                                        window.open(t.href);
                                                    } else {
                                                        window.open($(t).parent().attr("href"));
                                                    }
                                                } else if (t.className === "twitter-morebtn") {
                                                    M31.ApplicationRegistry.getInstance().getApp('springtwitter').reloadStatus = 2;
                                                    Ext.getCmp("springtwitter-statusReload").show();
                                                    M31.ApplicationRegistry.getInstance().getApp("springtwitter").loadDM.load({
                                                        add:true,
                                                        params:{
                                                            pageno: ++M31.ApplicationRegistry.getInstance().getApp("springtwitter").diretMessageCurrentPage,
                                                            count: 20
                                                        }
                                                    });
                                                } else if (t.className === "springtwitter-message") {
                                                    var target = Ext.getCmp("springtwitter-writeTweet");

                                                    if (target.collapsed) {
                                                        target.toggleCollapse(true);
                                                    }
                                                    var selectedData = Ext.getCmp("springtwitter-direcmessage-dataview").getSelectedRecords()[0].data;
                                                    var postTarget = $("#springtwitter-tweetPost");
                                                    postTarget.val("d " + selectedData.screenName + " ");
                                                    M31.ApplicationRegistry.getInstance().getApp('springtwitter').bodyTextLengthUpdate();
                                                    setTimeout(function() {
                                                        $("#springtwitter-tweetPost").focus();
                                                    }, 800);
                                                    Ext.getCmp("springtwitter-replyToId").setValue(0);
                                                    Ext.getCmp("springtwitter-postSend").setText("Update");
                                                }
                                            });
                                        }, scope:this, single:true}
                                    }
                                }
                            ]
                        })
                    ]
                })
            ],
            bbar: new Ext.Toolbar({
                hidden: true,
                id: 'springtwitter-view-status',
                items: [
                    {
                        xtype: 'button',
                        html: '<img src="/images/apps/springtwitter/reload.png" alt="새로고침"/>',
                        handler : this.reloadAll,
                        scope: this
                    },
                    {
                        id: 'springtwitter-view-statusMessage',
                        xtype: 'tbtext',
                        text: ''
                    },
                    {
                        xtype: 'tbfill'
                    },
                    {
                        id: 'springtwitter-statusReload',
                        tbtext: 'tbtext',
                        hidden: true,
                        html: '<img src="/images/apps/springsee/loading.gif" />'
                    }
                ]
            }),
            listeners: {
                resize: function() {
                }
            }
        };

        return otp;
    },

    // Layout 정의
    createWriteForm : function() {
        var writeForm = new Ext.form.FormPanel({
            title: 'What’s happening?',
            collapsedTitle: 'What’s happening?',
            id: 'springtwitter-writeTweet',
            xtype: 'form',
            region: 'north',
            collapsible: true,
            collapsed:false,
            margins: '0 0 0 0',
            padding: '0 0 0 0',
            height: 150,
            buttons:[
                {
                    id:'springtwitter-charcount',
                    xtype: 'displayfield',
                    value: 140
                },
                {
                    id:'springtwitter-postLoading',
                    xtype: 'displayfield',
                    hidden: true,
                    html: '<img src="/images/apps/springsee/loading.gif" />'
                },
                {
                    id: 'springtwitter-postSend',
                    text: 'Update',
                    handler: function() {
	                	if (Ext.fly('springtwitter-tweetPost').getValue().trim().length == 0) {
	                		m31.util.notification({title:'봄트위터',text:'내용을 입력하세요.',remove:true});
	                		return false;
	                	}
                		if (Ext.fly('springtwitter-tweetPost').getValue().length > 140) {
                			m31.util.notification({title:'봄트위터',text:'140자 이상은 작성할 수 없습니다.',remove:true});
                			return false;
                		}
                        M31.ApplicationRegistry.getInstance().getApp('springtwitter').writeForm.getForm().submit({
                            url: '/app/twitter/update'
                        });
                    }
                }
            ],
            defaults: {
                anchor: 'border',
                layout: 'form',
                padding: '0 0 0 0',
                width: 382,
                height: 90,
                hideLabel: true
            },
            defaultType: 'textarea',
            items: [
                {
                    id: 'springtwitter-tweetPost',
                    name: 'statusText',
                    maxLength: 140,
                    maxLengthText: '140자 이상은 작성할 수 없습니다.',
                    enableKeyEvents: true,
                    disableKeyFilter: true,
                    allowBlank: false,
                    blankText: '내용을 입력하세요.',
                    validationEvent : 'keydown',
                    listeners: {
                        keyup : function(sender, event) {
                            M31.ApplicationRegistry.getInstance().getApp('springtwitter').clearIntrvalFF();
                            M31.ApplicationRegistry.getInstance().getApp('springtwitter').bodyTextLengthUpdate();
                        },
                        keydown: function(sender, event) {
                            if (event.getKey() == 229 & Ext.isGecko) {
                                var self = M31.ApplicationRegistry.getInstance().getApp('springtwitter');
                                if (self.intervalID == null) {
                                    self.intervalID = setInterval(self.bodyTextLengthUpdate, 300);
                                } else {
                                    self.clearIntrvalFF();
                                    self.intervalID = setInterval(self.bodyTextLengthUpdate, 300);
                                }
                                event.stopEvent();
                            }
                        },
                        blur : function(sender, event) {
                            M31.ApplicationRegistry.getInstance().getApp('springtwitter').clearIntrvalFF();
                        },
                        'keypress'  : {fn:function(cmp, evt) {
                            if (evt.keyCode == Ext.EventObject.ENTER) {
                                M31.ApplicationRegistry.getInstance().getApp('springtwitter').writeForm.getForm().submit({
                                    url: '/app/twitter/update'
                                });
                            }
                        }, scope:this}
                    }
                },
                {
                    id: 'springtwitter-replyToId',
                    name: 'replyId',
                    inputType: 'textfield',
                    value: 0,
                    hidden: true
                }
            ],
            listeners: {
                actioncomplete: function(form, action) {
                    var result = Ext.decode(action.response.responseText);
                    if (result.success) {
                        var self = M31.ApplicationRegistry.getInstance().getApp('springtwitter');
                        $("#springtwitter-tweetPost").val("");
                        $("#springtwitter-charcount").text("140");
                        self.reloadStatus = 2;
                        self.loadTimeline.reload();
                        Ext.getCmp("springtwitter-postLoading").hide();
                        m31.util.notification({title:'봄트위터',text:'전송되었습니다.',remove:true});
                    }
                },
                actionfailed: function(form, action) {
                	m31.util.notification({title:'봄트위터',text:'전송에 실패했습니다.',remove:true});
                },
                beforeaction: function(form, action) {
                    if (!form.isValid()) {
                        return false;
                    } else {
                        Ext.getCmp("springtwitter-postLoading").show();
                    }
                }
            }
        });
        return writeForm;
    },

    createStartForm: function() {
        var startForm = new Ext.form.FormPanel({
            layout: 'form',
            border: false,
            header: false,
            padding: 10,
            id: 'springtwitter-start',
            labelWidth: 60,
            align: 'bottom',
            labelAlign: 'right',
            waitMsgTarget: true,

            // configs apply to child items
            defaults: {
                anchor: 'border',
                layout: 'form',
                boxMinWidth : 100
            }, // provide some room on right for validation errors
            listeners: {
                actioncomplete: function(form, action) {
                    var result = Ext.decode(action.response.responseText);
                    var self = M31.ApplicationRegistry.getInstance().getApp('springtwitter');
                    if (!result.auth && result.success) {
                        $("#springtwitter-authguideurl").attr("href", result.authURL);
                        self.cardNavigation(1);
                    } else if (result.auth && result.success) {
                    	self.initTimelineView(result.userName);
                    } else {
                        //    				console.log("fail getting AuthURL");
                    }
                }.createDelegate(this),
                actionfailed: function(form, action) {
                	m31.util.notification({title:'봄트위터',text:'Twitter가 응답하지 않습니다. <br/>잠시 후 다시 실행해 주세요.',remove:true});
                }
            }
        });
        return startForm;
    }  ,

    createAuthGuide: function() {
        var authGuide = new Ext.Panel({
            id: 'springtwitter-authGuide',
            layout:'fit',
            html: '<div><span>봄트위터를 사용하려면 트위터에서 인증이 필요합니다.</span><span>게스트계정일 경우에는 인증토큰을 저장하지 않습니다.</span><a href="" id="springtwitter-authguideurl" target="_blank"><img src="/images/apps/springtwitter/auth-btn.gif" alt="인증받기"/></a></div>',
            hideBorders: true
        });
        return authGuide;
    },

    // XTemplate
    timelineTemplate: new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="springtwitter-tweet" id="{name}">',
            	'<div class="springtwitter-contents-thumb"><a href="http://twitter.com/{screenName}"><img src="{profileImageUrl}" title="{screenName}" alt="{screenName}" width="48" height="48" /></a></div>',
            	'<div class="springtwitter-contents" id="{name}">',
            		'<div class="springtwitter-contents-top"><h4>{screenName}</h4></div>',
            		'<div class="springtwitter-contents-middle">{text}<div class="springtwitter-info">{createAt} via {source}</div></div>',
            		'<div class="springtwitter-contents-bottom">',
	            		'<tpl if="this.isNotMine(screenName)">',
		                	'<tpl if="!this.isDerectMessage(category)">',
		                		'<div class="springtwitter-btn">',
			                		'<img src="/images/apps/springtwitter/reply.png" alt="Reply" class="springtwitter-reply" ext:qwidth="60" ext:qtip="Reply" />',
			                		'<img src="/images/apps/springtwitter/retweet.png" alt="Retweet" class="springtwitter-retweet" ext:qwidth="60" ext:qtip="Retweet" />',
			                		'<img src="/images/apps/springtwitter/diretmessage.png" alt="Direct Message" class="springtwitter-message" ext:qwidth="60" ext:qtip="Message" />',
		                		'</div>',
		                	'</tpl>',
		                	'<tpl if="this.isDerectMessage(category)">',
		                		'<div class="springtwitter-btn"><img src="/images/apps/springtwitter/diretmessage.png" alt="Direct Message" class="springtwitter-message" ext:qwidth="60" ext:qtip="Message" /></div>',
		                	'</tpl>',
		                '</tpl>',
            		'</div>',
            	'</div>',
            '</div>',
            '</tpl>',
            '<div class="twitter-morebtn">더보기</div>',
    {
        isNotMine: function(name) {
            if (M31.ApplicationRegistry.getInstance().getApp('springtwitter').myScreenName == name) {
                return false;
            } else {
                return true;
            }
        },
        isDerectMessage: function(t) {
            if (t == "timeline" || t == "mentions") {
                return false;
            } else {
                return true;
            }
        }
    }
            ),

    timelineCurrentPage: 1,
    mentionsCurrentPage: 1,
    diretMessageCurrentPage: 1,
    reloadStatus: 0,
    timer: null,
    intervalID: null,
    tcnt: 10000, //무한 이벤트 방지용.  300 * (10000/300) 초 정도.. 대기 해줌.
    replyTag: null,
    myScreenName: "",

    reloadAll: function() {
        Ext.getCmp("springtwitter-statusReload").show();
        var self = M31.ApplicationRegistry.getInstance().getApp('springtwitter');
        self.loadTimeline.reload();
        self.loadMentions.reload();
        self.loadDM.reload();
    },

    setTimer: function() {
        clearTimeout(M31.ApplicationRegistry.getInstance().getApp('springtwitter').timer);
        M31.ApplicationRegistry.getInstance().getApp('springtwitter').timer = setTimeout("M31.ApplicationRegistry.getInstance().getApp('springtwitter').reloadAll()", 180000); // 3분 

    },
    
    initTimelineView: function(screenName) {
//    	console.log(screenName);
    	var self = M31.ApplicationRegistry.getInstance().getApp('springtwitter');
    	self.win.setSize(400, 500);
		self.myScreenName = screenName;
        self.reloadAll();
        self.cardNavigation(2);
        Ext.getCmp('springtwitter-view-status').show();
        Ext.getCmp('springtwitter-writeTweet').show();
    },

    /**
     * f/f 229  한글 글자 수 관련 setInterval시에 생성된 ID 제거.
     */
    clearIntrvalFF: function() {
        if (this.intervalID !== null) {
            clearInterval(this.intervalID);
            this.tcnt = 10000;
        }
    },

    /**
     * 카운트 해주는 곳. 기존 text와 현제 length 가 같다면 update 안하고 skip.. 이것도 f/f 를 대비해서 넣은 코드.
     */
    bodyTextLengthUpdate: function() {
        this.tcnt--;
        if (M31.ApplicationRegistry.getInstance().getApp('springtwitter').replyTag && Ext.fly('springtwitter-tweetPost').getValue().length < M31.ApplicationRegistry.getInstance().getApp('springtwitter').replyTag) {
            Ext.getCmp("springtwitter-replyToId").setValue(0);
            Ext.getCmp("springtwitter-postSend").setText("Update");
            M31.ApplicationRegistry.getInstance().getApp('springtwitter').replyTag = null;
        }
        if (parseInt(jQuery('#springtwitter-charcount').text()) !== (140 - Ext.fly('springtwitter-tweetPost').getValue().length)) {
            Ext.get('springtwitter-charcount')
                    .update(140 - Ext.fly('springtwitter-tweetPost').getValue().length);
        }
        if (this.tcnt < 0) {
            clearIntrvalFF();
        }
    },

    receiveURL: function(url) {
        M31.WindowsManager.getInstance().getWindow("springtwitter").show();
        M31.WindowsManager.getInstance().getWindow("springtwitter").toFront();
        var target = Ext.getCmp("springtwitter-writeTweet");
        if (target.collapsed) {
            target.toggleCollapse(true);
        }
        $("#springtwitter-tweetPost").val($("#springtwitter-tweetPost").val() + " " + url);
    },

    // utility
    cardNavigation: function(idx) {
        var l = M31.ApplicationRegistry.getInstance().getApp('springtwitter').win.getLayout();
        l.setActiveItem(idx);
    },

    addLinktoText: function(str) {
        var regExpName = /(@)([A-Za-z0-9_]+)/g;
        return str.replace(regExpName, '$1<a href="http://twitter.com/$2">$2</a>');
    }

});