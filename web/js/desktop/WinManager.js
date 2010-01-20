/*!
 * Ext JS Library 3.0.3
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
M31.WindowsManager = function() {
    var _instance = null;
    var springbar = null;
    var desktopEl = null;

    var windows = new Ext.WindowGroup();
    var activeWindow;

    function minimizeWin(win) {
        win.minimized = true;
        win.hide();
    };
    function markActive(win) {
        if (activeWindow && activeWindow != win) {
            markInactive(activeWindow);
        }
        //        springbar.setActiveButton(win.barButton);
        activeWindow = win;
        //        Ext.fly(win.barButton.el).addClass('active-win');
        win.minimized = false;
    };

    function markInactive(win) {
        if (win == activeWindow) {
            activeWindow = null;
            //            Ext.fly(win.barButton.el).removeClass('active-win');
        }
    };

    function removeWin(win) {
        M31.ApplicationRegistry.getInstance().getApp(win.id.replace("-win","")).removeWin();
        win.destroy();
        windows.unregister(win);
    };

    function maxWin(win){
//        alert('max')
    };

    return {
        getInstance : function(args) {
            if (_instance === null) {
                desktopEl = args;
                _instance = {
                    createWindow : function(targetId,config, cls) {
                        var win = new (cls || Ext.Window)(
                                Ext.applyIf(config || {}, {
                                    manager: windows,
                                    minimizable: true,
                                    maximizable: true,
                                    constrain:true
                                }));
                        win.render(desktopEl);
//                        win.cmenu = new Ext.menu.Menu({
//                            items: [
//
//                            ]
//                        });
                        if(targetId !== 'springplayer'){
                            win.animateTarget = Ext.getCmp('btn-'+targetId);
                        }


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
                            'maximize' : {
                                fn:maxWin
                            },
                            'close': {
                                fn: removeWin
                            }
                        });
                        return win;
                    },
                    getManager : function() {
                        return windows;
                    },
                    getWindow : function(id) {
                        return windows.get(id+"-win");
                    }
                }
            }
            return _instance;
        }
    };
}();