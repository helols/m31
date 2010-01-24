M31Desktop.Setting = Ext.extend(M31.app.Module, {
    init : function() {

    },
    removeWin:function(){
        this.northMenu.destroy();
        this.menuView.destroy();
        this.cardPanel.destroy();
    },
    createCallback :function(win) {
        if (!this.win) {
            this.win = win;
        }
        this.menuView.select(0);
    },
    beforeCreate : function() {
        var menuData = [
            ['배경관리','/images/desktop/springdock/setting.png'],
            ['프로그램관리','/images/desktop/springdock/setting.png'],
            ['위젯관리','/images/desktop/springdock/setting.png'],
            ['기타','/images/desktop/springdock/setting.png'],
            ['사용자정보','/images/desktop/springdock/setting.png']
        ];
        var store = new Ext.data.ArrayStore({
            fields: [
                {
                    name: 'menuname'
                },
                {
                    name: 'imgsrc'
                }
            ]
        });
        store.loadData(menuData);
        this.menuView = new Ext.DataView({
            tpl : new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div class="menu-wrap">',
                    '<img src="{imgsrc}"/>',
                    '<br/><span>{menuname}</span>',
                    '</div>',
                    '</tpl>',
                    '<div class="x-clear"></div>'
                    ),
            height : 80,
            id : 'setting-dataview' ,
            store :store,
            overClass:'x-view-over',
            itemSelector:'div.menu-wrap',
            emptyText: '',
            singleSelect: true,
            layout:'fit'
        });
        this.northMenu = new Ext.Panel({
            region : 'north',
            height : 90,
            collapsible: false,
            split: false,
            autoScroll : false,
            border: false,
            id : 'menu-panel',
            layout:'fit',
            items:[this.menuView]
        });
        this.cardPanel = new Ext.Panel({
            title: '프로그램관리',
            collapsible:false,
            titleCollapse: false,
            header: false,
            bodyBorder : false,
            border : false,
            layout:'card',
            margins: '3 0 0 0',
            region:'center',
            html:'프로그램관리'
        });
    },
    createWindow : function() {
        var northMenu = this.northMenu;
        var cardPanel = this.cardPanel;
        var opt = {
            width:640,
            height:480,
            minHeight:480,
            minWidth:640,
            boder : false,
            layout: 'border',
            items :[
                northMenu,
                cardPanel
            ]
        };
        return opt;
    }
});


/**
 * signout ...
 */
M31Desktop.Signout = Ext.extend(M31.app.Module, {
    createCallback :function(win) {
        if (!this.win) {
            this.win = win;
        }
    },
    createWindow : function(options) {
        options = options || {};
        this.win = undefined;
        var opt = {
            width:280,
            height:100,
            modal:true,
            shim:false,
            resizable:false,
            animCollapse:false,
            minimizable: false,
            maximizable: false,
            constrainHeader:true,
            layout: 'border',
            bodyBorder: false,
            items: [
                {
                    region: 'north',
                    height: 35,
                    layout : 'fit',
                    border:false,
                    cls:'signout-fit',
                    padding: '10px 5px 5px 5px',
                    html: options.msg || '봄 Web DeskTop을 종료 하시겠습니까?'
                },
                {
                    height: 20,
                    region: 'center',
                    layout: 'column',
                    border:false,
                    items: [
                        {
                            xtype: 'spacer'
                            ,
                            columnWidth:.25
                            ,
                            height:20
                        },
                        {
                            xtype: 'button',
                            text: '예',
                            columnWidth:.22,
                            handler: options.yesClick || this.yesClick
                        },
                        {
                            xtype: 'spacer'
                            ,
                            columnWidth:.06
                            ,
                            height:20
                        },
                        {
                            xtype: 'button',
                            text: '아니오',
                            columnWidth:.22,
                            handler: options.noClick || this.noClick
                        },
                        {
                            xtype: 'spacer'
                            ,
                            columnWidth:.25
                            ,
                            height:20
                        }
                    ]
                }
            ]
        };
        return opt;
    },
    yesClick : function() {
        //        m31.util.loading(false,'signout... plz wait...');
        window.location.href = "/j_spring_security_logout";
        //        setTimeout('window.location.href="/j_spring_security_logout"', 500);
    },
    noClick : function() {
        getApp('signout').win.close();
    }
});


/**
 * springfinder ...
 */

M31Desktop.Springfinder = Ext.extend(M31.app.Module, {
    init : function() {
        //        m31.util.requiredJS("springfindertree");
    },
    createCallback :function(win) {
        if (!this.win) {
            this.win = win;
        }
    },
    createWindow : function() {
        var springfinderDataPanel = new M31.app.SpringFinderPanel({
            height : 500,
            border : false,
            rootNodeId : 1,
            id : 'springfinder-panel'
        });

        var springfinderPanel = new Ext.Panel({
            region : 'center',
            height : 500,
            collapsible: false,
            split: true,
            autoScroll : true,
            border: false,
            id : 'springfinder-main-panel',
            layout:'fit',
            listeners: {
                'afterlayout': { fn:function(sfp, sfpl) {
                    sfp.items.items[0].onResizez(sfp.getHeight());
                }, scope:this, single:false}
            },
            items:[springfinderDataPanel],
            tools:[
                {
                    id:'refresh',
                    qtip: '새로고침',
                    // hidden:true,
                    handler: function(event, toolEl, panel) {
                        panel.get(0).getStore().reload();
                    }
                }
            ]
        });

        var springfinderTree = new M31.app.SpringFinderTree({finderpanel:springfinderDataPanel});
        springfinderDataPanel.springfinderTree = springfinderTree;

        var opt = {
            layout: 'border',
            width:800,
            height:500,
            minHeight : 250,
            minWidth : 400,
            items :[
                springfinderTree,
                springfinderPanel
            ]
        };
        return opt;
    }
});

M31.app.Grid = Ext.extend(Ext.grid.GridPanel, {
      mode : null // wallpapers or themes
    , ownerModule : null

    , constructor : function(config){
        // constructor pre-processing
        config = config || {};

        this.ownerModule = config.ownerModule;
        this.mode = config.mode;

        var reader = new Ext.data.JsonReader({
            fields: ['group', 'id', 'name', 'pathtothumbnail', 'pathtofile']
            , id: 'id'
            , root: this.mode //'wallpapers'
        });

        var largeIcons = new Ext.Template(
            '<div class="x-grid3-row ux-explorerview-item ux-explorerview-large-item" unselectable="on">'+
            '<table class="ux-explorerview-icon" cellpadding="0" cellspacing="0">'+
            '<tr><td align="center"><img src="{pathtothumbnail}"></td></tr></table>'+
            '<div class="ux-explorerview-text"><div class="x-grid3-cell x-grid3-td-name" unselectable="on">{name}</div></div></div>'
        );

        // this config
        Ext.applyIf(config, {
            columns: [
                {header: 'Group', width: 40, sortable: true, dataIndex: 'group'}
                , {header: 'Name', sortable: true, dataIndex: 'name'}
            ]
            , enableDragDrop: false
            , hideHeaders: true
            , sm: new Ext.grid.RowSelectionModel({
                listeners: {
                    'rowselect': { fn: this.onRowSelect, scope: this }
                }
                , singleSelect: true
            })
            , store: new Ext.data.GroupingStore({
                baseParams: {
                    action: (this.mode === 'themes' ? 'viewThemes' : 'viewWallpapers')
                    , moduleId: this.ownerModule.moduleId
                }
                , groupField: 'group'
                , listeners: {
                    'load': { fn: this.selectRecord, scope: this }
                }
                , reader: reader
                , sortInfo: {field: 'name', direction: 'ASC'}
                , url: config.ownerModule.app.connection

            })
            , view: new Ext.ux.grid.GroupingExplorerView({
                rowTemplate: largeIcons
                , forceFit: true
                , groupTextTpl: '{text} ({[values.rs.length]})'
                , showGroupName: false
            })
        });

        M31.app.Grid.superclass.constructor.apply(this, [config]);

        this.desktop = this.ownerModule.app.getDesktop();
    }

    // added methods

    , onRowSelect : function(sm, index, record){
        var r = record;
        var d = r.data;
        var id;

        if(this.mode === 'themes'){
            id = this.ownerModule.app.styles.theme.id;
        }else{
            id = this.ownerModule.app.styles.wallpaper.id;
        }

        if(parseInt(id) !== parseInt(r.id)){
            if(r && r.id && d.name && d.pathtofile){
                config = {
                    id: r.id
                    , name: d.name
                    , pathtofile: d.pathtofile
                };

                if(this.mode === 'themes'){
                    this.desktop.setTheme(config);
                }else{
                    this.desktop.setWallpaper(config);
                }
            }
        }
    }

    , selectRecord : function(){
        var id;

        if(this.mode === 'themes'){
            id = this.ownerModule.app.styles.theme.id;
        }else{
            id = this.ownerModule.app.styles.wallpaper.id;
        }

        this.selModel.selectRecords([this.store.getById(id)]);
    }
});
