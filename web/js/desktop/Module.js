Ext.ns('Ext.m31.Desktop');
Desktop = function(cfg){
    Ext.apply(this, cfg);
    this.addEvents({
        'ready' : true,
        'beforeunload' : true
    });

    Ext.onReady(this.initDesktop, this);
};
Ext.extend(Desktop, Ext.util.Observable, {
    isReady: false,
    initDesktop : function(){
        console.log('init!!');
    }
});
