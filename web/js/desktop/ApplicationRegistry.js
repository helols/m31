M31.ApplicationRegistry = function() {
    var _instance = null;
    var guest = null;
    var nickName = null;
    var first = null;
    var appInfos = {
        setting : {app : 'new M31Desktop.Setting()'},
        springsee :{app : 'new M31Desktop.SpringSee()'},
        springme2day :{app : 'new M31Desktop.SpringMe2Day()'},
        springplayer :{app : 'new M31Desktop.SpringPlayer()'},
        springtwitter :{app : 'new M31Desktop.SpringTwitter()'},
        signout :{app : 'new M31Desktop.Signout()'},
        springfinder :{app : 'new M31Desktop.Springfinder()'},
        springbook :{app : 'new M31Desktop.SpringBook()'},
        springtimelog:{app : 'new M31Desktop.SpringTimeLog()'},
        springguide:{app : 'new M31Desktop.SpringGuide()'}
    };
    var loaded = false;
    var appOrderSort = function(a,b){
        if(a.appOrder == b.appOrder) {
            return 0;
        }
        return a.appOrder > b.appOrder?1:-1;
    }
    var applicationStore = new Ext.data.JsonStore({
        autoDestroy: true,
        url: '/application/appList',
        storeId: 'appsStore',
        restful:true,
        root: 'appList',
        idProperty: 'appId',
        fields: [ 'id','appName','appId','appDesc','appInstallYn','appOrder'],
        listeners: {
            beforeload:{fn:function(){loaded = true; $("#processbar").progressBar(50);}},
            load: {
                fn: function(store, records, options) {
                    nickName = store.reader.jsonData.nickName;
                    guest  = store.reader.jsonData.isGuest;
                    first  = store.reader.jsonData.isFirst;
                    $("#processbar").progressBar(60);
                    store.each(function(item) {
                        Ext.apply(appInfos[item.data.appId], {
                            appId : item.data.appId,
                            appName:item.data.appName,
                            appDesc:item.data.appDesc,
                            appInstallYn:item.data.appInstallYn,
                            appOrder:item.data.appOrder
                        });
                    });
                    var tArry = [];
                    for (var x in appInfos) {
                        tArry.push(appInfos[x]);
                    }
                    tArry.sort(appOrderSort);
                    appInfos = {};
                    Ext.each(tArry,function(item){
                       appInfos[item.appId] = item;
                    });
                    SpringDock.getInstance().initDockButton(appInfos);
                }
            }
        }
    });
    return {
        getInstance : function() {
            if (_instance === null) {             
                _instance = {
                    getApp : function(appId) {
                        if(appId === undefined){
                            return {};
                        }
                        var app = appInfos[appId].app;
                        if (typeof(app) === 'string') {
                            app = eval(app);
                            appInfos[appId].app = Ext.apply(app,{id:appId});
                        }
                        return app;
                    },
                    loadApplicationStore : function(){
                        if(!loaded){
                            applicationStore.load();
                        }
                    },
                    initData : function(){
                        return [guest,nickName,first];
                    }
                };
            }
            return _instance;
        }
    }
}();