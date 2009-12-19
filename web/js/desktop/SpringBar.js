/*!
 * Ext JS Library 3.0.3
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * @class Ext.ux.TaskBar
 * @extends Ext.util.Observable
 */
M31.dt.SpringBar = function(desktop){
    this.desktop = desktop;
    this.init();
}

Ext.extend(M31.dt.SpringBar, Ext.util.Observable, {
    init : function(){
        var trayWidth = 200;
        this.springbartray = new Ext.BoxComponent({
			el: 'm31-springbar-tray',
	        id: 'SpringBarTray',
			region:'east',
			width: trayWidth
		});
		
		this.sbPanel = new M31.dt.BarButtonsPanel({
			el: 'm31-barbuttons-panel',
			id: 'BarButtons',
			region:'center'
		});
				
        var container = new M31.dt.SpringBarContainer({
			el: 'm31-springbar',
			layout: 'border',
			items: [this.sbPanel,this.springbartray]
		});

//        this.addBarButtons(this.desktop.modules);
		return this;
    },
    
    initBarButtons : function(apps){
        this.sbPanel.addButtons(apps);
        
	},
	
	removeTaskButton : function(btn){
		this.sbPanel.removeButton(btn);
	},
	
	setActiveButton : function(btn){
		this.sbPanel.setActiveButton(btn);
	}
});

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
	
	addButtons : function(apps){
        var _self = this;
        this.items = apps;
        console.log(apps)
        for(var i = 0 ; i < apps.length;i++){
            var li = _self.strip.createChild({tag:'li'}, _self.edge);
            new M31.dt.BarButton(apps[i], li);
        }

//		this.setActiveButton(btn);
	},
	
	removeButton : function(btn){

	},
	
	setActiveButton : function(btn){
		this.activeButton = btn;
	}
});

/**
 * Taskbar 버튼.
 */
M31.dt.BarButton = function(appOpt, el){
    var _self = this;
    this.opt = appOpt;
    this.app = undefined;
    this.win = undefined;
    this.open = false;
    var iconClsSuffix = '-bar-icon';
    M31.dt.BarButton.superclass.constructor.call(this, {
        iconCls: appOpt.id+iconClsSuffix,
//        text: Ext.util.Format.ellipsis(app.appName, 6),
        renderTo: el,
        handler : function(){
            if(!_self.open && !_self.win){
                _self.app = Ext.apply(eval(_self.opt.app),_self.opt);
                _self.win = _self.app.createWindow();
                _self.win.show();
                _self.open = true;
            }
            else if(_self.win.minimized || _self.win.hidden){
                _self.win.show();
            }else if(_self.win == _self.win.manager.getActive()){
                _self.win.minimize();
            }else{
                _self.win.toFront();
            }
        },
        clickEvent:'mousedown',
        template : new Ext.Template(
                '<div class="bar-btn-icon">',
                    '<button class="{2}" type="{1}"></button>',
                '</div>')
    });
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