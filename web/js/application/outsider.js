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

        console.log("before initTemplates");
        this.initTemplates();

        this.store = new Ext.data.JsonStore({
            url: '/sandbox/images', //this.config.url,
            root: 'images',
            fields: [
                'name', 'url',
                {
                    name:'size',
                    type: 'float'
                },
                {
                    name:'lastmod',
                    type:'date',
                    dateFormat:'timestamp'
                }
            ],
            listeners: {
                'load': {fn:function() {
                    console.log("store loaded");
                    this.view.select(0);
                }, scope:this, single:true}
            }
        });

        var formatSize = function(data) {
            console.log("formatSize");
            if (data.size < 1024) {
                return data.size + " bytes";
            } else {
                return (Math.round(((data.size * 10) / 1024)) / 10) + " KB";
            }
        };

        var formatData = function(data) {
            console.log("formatData");
            data.shortName = data.name.ellipse(15);
            data.sizeString = formatSize(data);
            data.dateString = new Date(data.lastmod).format("m/d/Y g:i a");
            this.lookup[data.name] = data;
            return data;
        };

        this.view = new Ext.DataView({
            tpl: this.thumbTemplate,
            singleSelect: true,
            overClass:'x-view-over',
            itemSelector: 'div.thumb-wrap',
            emptyText : '<div style="padding:10px;">No images match the specified filter</div>',
            store: this.store,
            listeners: {
                'selectionchange': {fn:this.showDetails, scope:this, buffer:100},
                'dblclick'       : {fn:this.runGallery, scope:this},
                'loadexception'  : {fn:this.onLoadException, scope:this},
                'beforeselect'   : {fn:function(view) {
                    //return view.store.getRange().length > 0;
                }}
            },
            prepareData: formatData.createDelegate(this)
        });


        //this.reset();
    },
    createCallback : function() {
        console.log("store!!")
        this.store.load();
    },
    createWindow : function (){
        var otp = {
            layout: 'border',
            width: 640,
            height: 480,
            minWidth: 640,
            minHeight: 480,
            closeAction: 'hide',
            border: false,
            items:[
                {
                    region: 'center',
                    autoScroll: true,
                    items: this.view,
                    tbar:[
                        {
                            id: 'source',
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
                            forceSelection: true,
                            lazyInit: false,
                            triggerAction: 'all',
                            value: '통합검색'
                            //                        listeners: {
                            //							'select': {fn:this.sortImages, scope:this}
                            //					    }
                        },
                        {
                            text: 'Search:'
                        },
                        {
                            xtype: 'textfield',
                            id: 'search',
                            selectOnFocus: true,
                            width: 100,
                            listeners: {
                                'render': {fn:function() {
                                    Ext.getCmp('search').getEl().on('keyup', function() {
                                        this.filter();
                                    }, this, {buffer:500});
                                }, scope:this}
                            }
                        },
                        ' ',
                        '-',
                        {
                            text: 'Sort By:'
                        },
                        {
                            id: 'sortSelect',
                            xtype: 'combo',
                            typeAhead: true,
                            triggerAction: 'all',
                            width: 100,
                            editable: false,
                            mode: 'local',
                            displayField: 'desc',
                            valueField: 'name',
                            lazyInit: false,
                            value: 'name',
                            store: new Ext.data.ArrayStore({
                                fields: ['name', 'desc'],
                                data : [
                                    ['name', 'Name'],
                                    ['size', 'File Size'],
                                    ['lastmod', 'Last Modified']
                                ]
                            }),
                            listeners: {
                                'select': {fn:this.sortImages, scope:this}
                            }
                        },
                        {
                            id: 'send',
                            xtype: 'button',
                            value: 'Send'
                        }
                    ]
                },
                {
                    id: 'img-detail-panel',
                    region: 'east',
                    split: true,
                    width: 150,
                    minWidth: 150,
                    maxWidth: 250
                }
            ],
            keys: {
                key: 27, // Esc key
                handler: function() {
//                    this.win.hide();
                },
                scope: this
            }
        };
            //this.store.load();
            //this.reset(win);

            //return win;
        return otp;
    },
    initTemplates : function() {
        console.log("in initTemplates");
        this.thumbTemplate = new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><img src="{url}" title="{name}"></div>',
                '<span>{shortName}</span></div>',
                '</tpl>'
                );
        this.thumbTemplate.compile();

        this.detailsTemplate = new Ext.XTemplate(
                '<div class="details">',
                '<tpl for=".">',
                '<img src="{url}"><div class="details-info">',
                '<b>Image Name:</b>',
                '<span>{name}</span>',
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
        console.log("showDetails");
        var selNode = this.view.getSelectedNodes();
        var detailEl = Ext.getCmp('img-detail-panel').body;
        if (selNode && selNode.length > 0) {
            selNode = selNode[0];
            var data = this.lookup[selNode.id];
            detailEl.hide();
            this.detailsTemplate.overwrite(detailEl, data);
            detailEl.slideIn('l', {stopFx:true,duration:.2});
        } else {
            detailEl.update('');
        }
    },

    filter : function() {
        console.log("filter");
        var filter = Ext.getCmp('filter');
        this.view.store.filter('name', filter.getValue());
        this.view.select(0);
    },

    sortImages : function() {
        console.log("sortImages");
        var v = Ext.getCmp('sortSelect').getValue();
        this.view.store.sort(v, v == 'name' ? 'asc' : 'desc');
        this.view.select(0);
    },

    reset : function(arg) {
        console.log("reset");

    },

    onLoadException : function(v, o) {
        console.log("onLoadException");
        this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>');
    },

    //Gallery 실행
    runGallery : function() {
        alert("run Gallery")
    },

    // 검색 소스 고르기
    selectSource : function() {
        alert(Ext.getCmp('source').getValue());
    }
});

String.prototype.ellipse = function(maxLength) {
    if (this.length > maxLength) {
        return this.substr(0, maxLength - 3) + '...';
    }
    return this;
};