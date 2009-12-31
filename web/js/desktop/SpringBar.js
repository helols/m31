/*!
 * Ext JS Library 3.0.3
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

M31.dt.SpringBarContainer = Ext.extend(Ext.Panel, {
    initComponent : function() {
        M31.dt.SpringBarContainer.superclass.initComponent.call(this);

        this.el = Ext.get(this.el) || Ext.getBody();
        this.el.setHeight = Ext.emptyFn;
        this.el.setWidth = Ext.emptyFn;
        this.el.setSize = Ext.emptyFn;
        this.el.setStyle({
            overflow:'hidden',
            margin:'0',
            border:'0 none'
        });
        this.el.dom.scroll = 'no';
        this.allowDomMove = false;
        Ext.EventManager.onWindowResize(this.fireResize, this);
        this.renderTo = this.el;
    },

    fireResize : function(w, h){
        this.fireEvent('resize', this, w, h, w, h);
    }
});

/**
 * @class Ext.ux.BarButtonsPanel
 * @extends Ext.BoxComponent
 */
M31.dt.BarButtonsPanel = Ext.extend(Ext.BoxComponent, {
	activeButton: null,
    buttonWidth: 36,
    minButtonWidth: 36,
    buttonMargin: 2,
    buttonWidthSet: false,

	initComponent : function() {
        M31.dt.BarButtonsPanel.superclass.initComponent.call(this);
        this.items = [];

        this.stripWrap = Ext.get(this.el).createChild({
        	cls: 'm31-barbuttons-strip-wrap',
        	cn: {
            	tag:'ul', cls:'m31-barbuttons-strip'
            }
		});
        this.stripSpacer = Ext.get(this.el).createChild({
        	cls:'m31-barbuttons-strip-spacer'
        });
        this.strip = new Ext.Element(this.stripWrap.dom.firstChild);

        this.edge = this.strip.createChild({
        	tag:'li',
        	cls:'m31-barbuttons-edge'
        });
        this.strip.createChild({
        	cls:'x-clear'
        });
	},

	addButtons : function(appsInfo){
        for (var x in appsInfo) {
            var li = this.strip.createChild({tag:'li'}, this.edge);
            new M31.dt.BarButton(appsInfo[x], li);
        }
//        setTimeout(function(){
//                Ext.get('loading').remove();
//                Ext.get('loading-mask').fadeOut({remove:true});
//            }, 250);
	},

	updateBarButtons : function(btn){

	},

	setActiveButton : function(btn){
		this.activeButton = btn;
	}
});

/**
 * Taskbar 버튼.
 */
M31.dt.BarButton = function(appInfo, el){
    var iconClsSuffix = '-bar-icon';
    M31.dt.BarButton.superclass.constructor.call(this, {
        id : 'btn-'+ appInfo.appId,
        iconCls: appInfo.appId+iconClsSuffix,
//        text: Ext.util.Format.ellipsis(app.appName, 6),
        renderTo: el,
        handler : function(){
            var win = M31.WindowsManager.getInstance().getWindow(appInfo.appId);
            if(!win){
                var app = M31.ApplicationRegistry.getInstance().getApp(appInfo.appId);
                app.beforeCreate();
                win = M31.WindowsManager.getInstance().createWindow(this,
                            Ext.apply(app.createWindow(),{
                                id:appInfo.appId+'-win',
                                title:appInfo.appName,
                                iconCls:appInfo.appId+'-win-icon'
                            })
                        );
                app.createCallback(win);
                win.show();
            }
            else if(win.minimized || win.hidden){
                win.show();
            }else if(win === win.manager.getActive()){
                win.minimize();
            }else{
                win.toFront();
            }
        },
        clickEvent:'mousedown',
        template : new Ext.Template(
                '<div class="bar-btn-icon" style="word-break:break-all;" >',
                    '<button class="{2}" type="{1}"></button>',
                '<span>'+appInfo.appName+'</span>',
                '</div>')
    });

//    remove
};

Ext.extend(M31.dt.BarButton, Ext.Button, {
    onRender : function(){
        M31.dt.BarButton.superclass.onRender.apply(this, arguments);
    }
});

M31.dt.SpringBar = function(){
    var _instance = null;
    var springbartray, sbPanel ,container;
    function init(){
        sbPanel = new M31.dt.BarButtonsPanel({
            el: 'm31-barbuttons-panel',
            id: 'BarButtons'
        });

        container = new M31.dt.SpringBarContainer({
            el: 'm31-springbar',
            layout: 'ux.center',
            border: false,
            items: [sbPanel]
        });
    };
    return {
        getInstance : function(){
            if(_instance === null){
               _instance ={
                    initBarButtons : function(appsInfo){
                        sbPanel.addButtons(appsInfo);
                    },
                    updateBarButtons : function(btn){
                        sbPanel.updateBarButtons(btn);
                    },
                    setActiveButton : function(btn){
                        sbPanel.setActiveButton(btn);
                    }
               }
               init();
            }
            return _instance;
        }
    };
}();