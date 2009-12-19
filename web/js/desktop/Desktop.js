/*!
 * Ext JS Library 3.0.3
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
M31.Desktop = function(cfg){
    Ext.apply(this, cfg);
    this.addEvents({
        'ready' : true,
        'beforeunload' : true
    });
    Ext.QuickTips.init();
    Ext.onReady(this.initDesktop, this);
};

Ext.extend(M31.Desktop, Ext.util.Observable, {
    isReady: false,
    modules: [{appName:'setting',appIconCls:'app-setting-bar-icon',appId:'app-setting'}],
    initDesktop : function(){
        this.desktopEl = this.desktopEl || Ext.get('m31-desktop');
        this.springbarEl = this.springbarEl || Ext.get('m31-springbar');
        this.springbar = new M31.dt.SpringBar(this);
        this.initApplicationStore();
        this.windowsManager = new M31.WindowsManager(this);

//        this.modules = this.getModules();
//        if(this.modules){
//            this.initModules(this.modules);
//        }
        this.appReg = new ApplicationRegistry();
        Ext.EventManager.on(window, 'beforeunload', this.onUnload, this);
		this.fireEvent('ready', this);
        this.isReady = true;
        Ext.EventManager.onDocumentReady(this.layout,this);
//        Ext.EventManager.onDocumentReady(addReflections,this);
        Ext.EventManager.onWindowResize(this.layout,this);
    },

//    getModules : Ext.emptyFn,
    init : Ext.emptyFn,
    initApplicationStore : function(){
        var _self = this;
        if(!_self.applicationStore){
            _self.applicationStore = new Ext.data.JsonStore({
                autoDestroy: true,
//                autoLoad:true,
                url: '/application/appList',                
                storeId: 'appsStore',
                restful:true,
                root: 'appList',
                idProperty: 'appId',
                fields: [ 'id','appName','appId','appDesc','appInstallYn'],
                listeners: {
                   load: {
                       fn: function(store, records, options){
                            var apps = [];
                            store.each(function(item){
//                                var app = _self.getApp(item.id);
                                apps.push(Ext.apply(_self.getApp(item.data.appId), {
                                    id : item.data.appId,
                                    appName:item.data.appName,
                                    appDesc:item.data.appDesc,
                                    appInstallYnL:item.data.appInstallYn,
                                    winManager:_self.windowsManager
                                }));

                            });
                           _self.springbar.initBarButtons(apps);
                           }
                       }
                   }
            });
        }else{
            _self.applicationStore.reload();
        }

        _self.applicationStore.load();
    },

//
//    initModules : function(ms){
//		for(var i = 0, len = ms.length; i < len; i++){
//            var m = ms[i];
//            m.desktop = this;
//        }
//    },
//
//    getModule : function(name){
//    	var ms = this.modules;
//    	for(var i = 0, len = ms.length; i < len; i++){
//    		if(ms[i].id == name || ms[i].appType == name){
//    			return ms[i];
//			}
//        }
//        return '';
//    },
    getApp : function(appId){
        return this.appReg.getApp(appId);
    },
    onReady : function(fn, scope){
        if(!this.isReady){
            this.on('ready', fn, scope);
        }else{
            fn.call(scope, this);
        }
    },

    getWinManager : function(){
        return this.windowsManager;
    },

    getSpringBar : function(){
        return this.springbar;
    },

    onUnload : function(e){
        if(this.fireEvent('beforeunload', this) === false){
            e.stopEvent();
        }
    },

   layout : function(){
        if(Ext.lib.Dom.getViewHeight()-this.springbarEl.getHeight() <= this.minHeight){
            this.desktopEl.setHeight(this.minHeight);
        }else{
            this.desktopEl.setHeight(Ext.lib.Dom.getViewHeight()-this.springbarEl.getHeight());
        }
        if(Ext.lib.Dom.getViewWidth() <= this.minWidth){
            this.desktopEl.setWidth(this.minWidth);
            console.log(this.minWidth)
            this.springbarEl.setStyle({width:this.minWidth+'px'});
            console.log(this.springbarEl.getWidth());
        }else{
            this.desktopEl.setWidth(Ext.lib.Dom.getViewWidth());
            this.springbarEl.setStyle({width:Ext.lib.Dom.getViewWidth()+'px'});
        }
    }
});