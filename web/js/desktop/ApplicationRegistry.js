ApplicationRegistry = function(){
    var applicationList = [
             {appId :'setting', app : 'new M31Desktop.GridWindow()'}
            ,{appId :'springsee', app : 'new M31Desktop.SpringSee()'}
        ];

    this.getApp = function(appId){
        for(var i = 0 ; i < applicationList.length ; i++){
            if(appId === applicationList[i].appId){
                return applicationList[i].app;
            }
        }
    }
};