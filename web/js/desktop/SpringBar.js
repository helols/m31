/*!
 * Ext JS Library 3.0.3
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

M31.dt.SpringBarContainer = Ext.extend(Ext.Container, {
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
//        this.cmenu = new Ext.menu.Menu({
//            items: [{
//                text: 'Restore',
//                handler: function(){
//                    if(!this.win.isVisible()){
//                        this.win.show();
//                    }else{
//                        this.win.restore();
//                    }
//                },
//                scope: this
//            },{
//                text: 'Minimize',
//                handler: this.win.minimize,
//                scope: this.win
//            },{
//                text: 'Maximize',
//                handler: this.win.maximize,
//                scope: this.win
//            }, '-', {
//                text: 'Close',
//                handler: this.closeWin.createDelegate(this, this.win, true),
//                scope: this.win
//            }]
//        });
//
//        this.cmenu.on('beforeshow', function(){
//            var items = this.cmenu.items.items;
//            var w = this.win;
//            items[0].setDisabled(w.maximized !== true && w.hidden !== true);
//            items[1].setDisabled(w.minimized === true);
//            items[2].setDisabled(w.maximized === true || w.hidden === true);
//        }, this);

//        this.el.on('contextmenu', function(e){
//            e.stopEvent();
//            if(!this.cmenu.el){
//                this.cmenu.render();
//            }
//            var xy = e.getXY();
//            xy[1] -= this.cmenu.el.getHeight();
//            this.cmenu.showAt(xy);
//        }, this);
    },

    closeWin : function(cMenu, e, win){
		if(!win.isVisible()){
			win.show();
		}else{
			win.restore();
		}
		win.close();
	}
});

M31.dt.SpringBar = function(){
    var _instance = null;
    var springbartray, sbPanel ,container;
    var _desktop = null;
    function init(desktop){
         _desktop = desktop;
        var trayWidth = 200;
        springbartray = new Ext.BoxComponent({
            el: 'm31-springbar-tray',
            id: 'SpringBarTray',
            region:'east',
            width: trayWidth
        });

        sbPanel = new M31.dt.BarButtonsPanel({
            el: 'm31-barbuttons-panel',
            id: 'BarButtons',
            region:'center'
        });

        container = new M31.dt.SpringBarContainer({
            el: 'm31-springbar',
            layout: 'border',
            items: [sbPanel,springbartray]
        });
        return this;
    };
    return {
        getInstance : function(args){
            if(_instance === null){
               _instance ={
                    getDesktop:function(){
                       return _desktop;
                    },
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
               init(args);
            }
            return _instance;
        }       
    };
}();