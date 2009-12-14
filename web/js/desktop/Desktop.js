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

    Ext.onReady(this.initDesktop, this);
};

Ext.extend(M31.Desktop, Ext.util.Observable, {
    isReady: false,
    startMenu: null,
    modules: null,
    initDesktop : function(){
        this.desktopEl = this.desktopEl || Ext.get('x-desktop');
        this.taskbarEl = this.taskbarEl || Ext.get('ux-taskbar');
    	this.startConfig = this.startConfig || this.getStartConfig();
        this.taskbar = new M31.dt.TaskBar(this);
        this.windowsManager = new M31.WindowsManager(this);

		this.launcher = this.taskbar.startMenu;

		this.modules = this.getModules();
        if(this.modules){
            this.initModules(this.modules);
        }

        this.init();

        Ext.EventManager.on(window, 'beforeunload', this.onUnload, this);
		this.fireEvent('ready', this);
        this.isReady = true;
        Ext.EventManager.onDocumentReady(this.layout,this);
        Ext.EventManager.onWindowResize(this.layout,this);
    },

    getModules : Ext.emptyFn,
    init : Ext.emptyFn,

    initModules : function(ms){
		for(var i = 0, len = ms.length; i < len; i++){
            var m = ms[i];
            this.launcher.add(m.launcher);
            m.desktop = this;
        }
    },

    getModule : function(name){
    	var ms = this.modules;
    	for(var i = 0, len = ms.length; i < len; i++){
    		if(ms[i].id == name || ms[i].appType == name){
    			return ms[i];
			}
        }
        return '';
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

    getTaskBar : function(){
        return this.taskbar;
    },

    onUnload : function(e){
        if(this.fireEvent('beforeunload', this) === false){
            e.stopEvent();
        }
    },

    layout : function(){
        if(Ext.lib.Dom.getViewHeight()-this.taskbarEl.getHeight() <= this.minHeight){
            this.desktopEl.setHeight(this.minHeight);
        }else{
            this.desktopEl.setHeight(Ext.lib.Dom.getViewHeight()-this.taskbarEl.getHeight());
        }
        if(Ext.lib.Dom.getViewWidth() <= this.minWidth){
            this.desktopEl.setWidth(this.minWidth);
        }else{
            this.desktopEl.setWidth(Ext.lib.Dom.getViewWidth());
        }
    }
});