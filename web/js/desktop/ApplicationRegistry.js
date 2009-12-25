M31.ApplicationRegistry = function() {
    var _instance = null;
    var appInfo = {
        setting : {app : 'new M31Desktop.Setting()'},
        springsee :{app : 'new M31Desktop.SpringSee()'},
        springme2day :{app : 'new M31Desktop.SpringMe2Day()'}
    };
    var loaded = false;
    var applicationStore = new Ext.data.JsonStore({
        autoDestroy: true,
        url: '/application/appList',
        storeId: 'appsStore',
        restful:true,
        root: 'appList',
        idProperty: 'appId',
        fields: [ 'id','appName','appId','appDesc','appInstallYn'],
        listeners: {
            beforeload:{fn:function(){loaded = true;}},
            load: {
                fn: function(store, records, options) {
                    console.log(' applicationStore load');
                    store.each(function(item) {
                        Ext.apply(appInfo[item.data.appId], {
                            appId : item.data.appId,
                            appName:item.data.appName,
                            appDesc:item.data.appDesc,
                            appInstallYn:item.data.appInstallYn
                        });
                    });
                    M31.dt.SpringBar.getInstance().initBarButtons(appInfo);
                }
            }
        }
    });
    if(!loaded){
        applicationStore.load();
    }
    return {
        getInstance : function() {
            if (_instance === null) {             
                _instance = {
                    getApp : function(appId) {
                        var app = appInfo[appId].app;
                        if (typeof(app) === 'string') {
                            app = eval(app);
                            appInfo[appId].app = Ext.apply(app,{id:appId});
                        }
                        return app;
                    },
                    loadApplicationStore : function(){
                        if(!loaded){
                            applicationStore.load();
                        }
                    }
                };
            }
            return _instance;
        }
    }
}();