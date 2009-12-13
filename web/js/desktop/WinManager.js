/*!
 * Ext JS Library 3.0.3
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
M31.WindowsManager = function(desktop){
    this.taskbar = desktop.getTaskBar();
    var taskbar = this.taskbar;

    var windows = new Ext.WindowGroup();
    var activeWindow;

    function minimizeWin(win){
        win.minimized = true;
        win.hide();
    }

    function markActive(win){
        if(activeWindow && activeWindow != win){
            markInactive(activeWindow);
        }
        taskbar.setActiveButton(win.taskButton);
        activeWindow = win;
        Ext.fly(win.taskButton.el).addClass('active-win');
        win.minimized = false;
    }

    function markInactive(win){
        if(win == activeWindow){
            activeWindow = null;
            Ext.fly(win.taskButton.el).removeClass('active-win');
        }
    }

    function removeWin(win){
    	taskbar.removeTaskButton(win.taskButton);
    }

    this.createWindow = function(config, cls){
    	var win = new (cls||Ext.Window)(
            Ext.applyIf(config||{}, {
                manager: windows,
                minimizable: true,
                maximizable: true
            })
        );
        win.render(desktopEl);
        win.taskButton = taskbar.addTaskButton(win);

        win.cmenu = new Ext.menu.Menu({
            items: [

            ]
        });

        win.animateTarget = win.taskButton.el;

        win.on({
        	'activate': {
        		fn: markActive
        	},
        	'beforeshow': {
        		fn: markActive
        	},
        	'deactivate': {
        		fn: markInactive
        	},
        	'minimize': {
        		fn: minimizeWin
        	},
        	'close': {
        		fn: removeWin
        	}
        });

        return win;
    };

    this.getManager = function(){
        return windows;
    };

    this.getWindow = function(id){
        return windows.get(id);
    }

    
//    this.getWinWidth = function(){
//		var width = Ext.lib.Dom.getViewWidth();
//		return width < 200 ? 200 : width;
//	}
//
//	this.getWinHeight = function(){
//		var height = (Ext.lib.Dom.getViewHeight()-taskbarEl.getHeight());
//		return height < 100 ? 100 : height;
//	}
//
//	this.getWinX = function(width){
//		return (Ext.lib.Dom.getViewWidth() - width) / 2
//	}
//
//	this.getWinY = function(height){
//		return (Ext.lib.Dom.getViewHeight()-taskbarEl.getHeight() - height) / 2;
//	}
};
