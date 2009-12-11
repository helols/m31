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
    initDesktop : function(){
        Ext.QuickTips.init();
        this.changeBackground();
    },
    
    changeBackground : function(opt){
      opt = opt||{
              url:'/images/desktop/wallpapers/desktop.jpg'
            , color:'#3d71b8'
            , repeat:'repeat center'
            ,width:Ext.lib.Dom.getViewWidth()
            ,height:Ext.lib.Dom.getViewHeight()
        };
      Ext.fly('x-desktop').setStyle({
              'background': opt.color+' '+'url('+opt.url+') '+opt.repeat
            , 'width' : opt.width
            , 'height': opt.height
        }, true);
        Ext.fly
    }
});
