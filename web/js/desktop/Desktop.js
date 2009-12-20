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
    initDesktop : function(){
        this.desktopEl = this.desktopEl || Ext.get('m31-desktop');
        this.springbarEl = this.springbarEl || Ext.get('m31-springbar');
        this.springbar = M31.dt.SpringBar.getInstance(this);
        M31.WindowsManager.getInstance(this.desktopEl);
        Ext.EventManager.on(window, 'beforeunload', this.onUnload, this);
        this.fireEvent('ready', this);
        this.isReady = true;
        Ext.EventManager.onDocumentReady(this.layout,this);
//        Ext.EventManager.onDocumentReady(addReflections,this);
        Ext.EventManager.onWindowResize(this.layout,this);
    },
    init : Ext.emptyFn,

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
            this.springbarEl.setStyle({width:this.minWidth+'px'});
        }else{
            this.desktopEl.setWidth(Ext.lib.Dom.getViewWidth());
            this.springbarEl.setStyle({width:Ext.lib.Dom.getViewWidth()+'px'});
        }
    }
});