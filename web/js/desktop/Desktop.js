Ext.ns("Ext.m31");

Ext.m31.Desktop = function(cfg) {
    Ext.apply(this, cfg);
    this.addEvents({
        'ready' : true,
        'beforeunload' : true
    });
    Ext.onReady(this.initDesktop, this);
};
Ext.extend(Ext.m31.Desktop, Ext.util.Observable, {
    isReady: false,
    initDesktop : function() {
        this.init();
    },
    init : function() {
        Ext.QuickTips.init();
    },
    chageBackground : function(){
      Ext.fly('desktopBody').setStyle('background', '#3d71b8 url(../../images/desktop/wallpapers/desktop.jpg) no-repeat left top', true);
    }
});
