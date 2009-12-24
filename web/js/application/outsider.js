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
    lookup : {},
    init : function() {
        console.log("init");
        this.initTemplates();
        this.apiProvider;
        this.searchText;

        this.store = new Ext.data.JsonStore({
        	url: '/gateway/springsee/search',
        	method: 'GET',
            root: 'imgInfo',
            fields: [
                'title', 'thumbnail'
//                {
//                    name:'size',
//                    type: 'float'
//                },
//                {
//                    name:'lastmod',
//                    type:'date',
//                    dateFormat:'timestamp'
//                }
            ],
            listeners: {
                'load': {fn:function() {
                    console.log("store loaded");
                    this.view.select(0);
                }, scope:this, single:true}
            }
        });

        this.view = this.createView();
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
            data.shortName = data.title.ellipse(15);
//            data.sizeString = formatSize(data);
//            data.dateString = new Date(data.lastmod).format("m/d/Y g:i a");
            this.lookup[data.title] = data;
            return data;
        };

        return new Ext.DataView({
            tpl: this.thumbTemplate,
            singleSelect: true,
            overClass:'x-view-over',
            itemSelector: 'div.thumb-wrap',
            emptyText : '<div style="padding:10px;">No images match the specified search</div>',
            store: this.store,
            listeners: {
                'selectionchange': {fn:this.showDetails, scope:this, buffer:100},
                'dblclick'       : {fn:this.runGallery, scope:this},
                'loadexception'  : {fn:this.onLoadException, scope:this},
                'beforeselect'   : {fn:function(view) {
                    return view.store.getRange().length > 0;
                }}
            },
            prepareData: formatData.createDelegate(this)
        });
    },

    /**
     *  해당 app의 window가 제거 될때 호출되는 콜백.
     */
    removeWin: function(){
        this.view = undefined;
        this.win = undefined;
    },

    /**
     *  윈도우를 생성하기 직전에 호출되는 펑션.
     */
    beforeCreate : function() {
        if(!this.view){
            this.view = this.createView();
        }
    },

    /**
     *  윈도우를 생성된후에 호출되는 펑션.
     */
    createCallback : function(win) {
        if(!this.win){
            this.win = win;
        }
        //this.store.load();
    },

    createWindow : function () {
        var otp = {
            layout: 'border',
            width: 640,
            height: 480,
            minWidth: 640,
            minHeight: 480,
            closeAction: 'close',
            constrainHeader:true,
            border: false,
            items:[
                {
                    id: 'springsee-view',
                    region: 'center',
                    autoScroll: true,
                    items: this.view,
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
                            //                        listeners: {
                            //							'select': {fn:this.sortImages, scope:this}
                            //					    }
                        },
                        ' ',
                        '-',
                        {
                            text: 'Search:'
                        },
                        {
                            xtype: 'textfield',
                            id: 'springsee-search',
                            selectOnFocus: true,
                            width: 100,
                            enableKeyEvents: true,
                            listeners: {
//                        		'render': {fn:function(){
//    						    	Ext.getCmp('springsee-search').getEl().on('keypress', function(e, cmp){
//    						    		if (e.keyCode == Ext.EventObject.ENTER) {
//    						    			console.dir(cmp);
//    						    			console.dir(this);
//    						    			tmp.getImages();
//    						    		}
//    						    	});
//                        		}, scope:this},
                        		'keypress'  : {fn:function(cmp, evt){
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
                        }
                    ]
                }
            ],
            keys: {
                key: 27, // Esc key
                handler: function() {
                    this.win.hide();
                },
                scope: this
            }
        };

        return otp;
    },

    initTemplates : function() {
        this.thumbTemplate = new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><img src="{thumbnail}" title="{title}"></div>',
                '<span>{shortName}</span></div>',
                '</tpl>'
                );
        this.thumbTemplate.compile();

        this.detailsTemplate = new Ext.XTemplate(
                '<div class="details">',
                '<tpl for=".">',
                '<img src="{thumbnail}"><div class="details-info">',
                '<b>Image Name:</b>',
                '<span>{title}</span>',
                '<b>Size:</b>',
                '<span>{sizeString}</span>',
                '<b>Last Modified:</b>',
                '<span>{dateString}</span></div>',
                '</tpl>',
                '</div>'
                );
        this.detailsTemplate.compile();
    },

    showDetails : function() {
//        var selNode = this.view.getSelectedNodes();
//        var detailEl = Ext.getCmp('springsee-img-detail-panel').body;
//        if (selNode && selNode.length > 0) {
//            selNode = selNode[0];
//            var data = this.lookup[selNode.id];
//            detailEl.hide();
//            this.detailsTemplate.overwrite(detailEl, data);
//            detailEl.slideIn('l', {stopFx:true,duration:.2});
//        } else {
//            detailEl.update('');
//        }
    },

    onLoadException : function(v, o) {
        this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>');
    },

    //Gallery 실행
    runGallery : function() {
        alert("run Gallery");
    },

    //이미지 검색하기
    getImages : function() {
    	if (Ext.isEmpty(Ext.getCmp('springsee-search').getValue())) {
    		alert("검색어를 입력하세요.");
    		return;
    	}
        this.store.reload({
        	params: {
        		search_type: Ext.getCmp('springsee-api-provider').getValue(), 
        		query: 		 Ext.getCmp('springsee-search').getValue() 
        	}
        });
    }
});

String.prototype.ellipse = function(maxLength) {
    if (this.length > maxLength) {
        return this.substr(0, maxLength - 3) + '...';
    }
    return this;
};
