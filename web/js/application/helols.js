M31Desktop.Setting = Ext.extend(M31.app.Module, {
    init : function() {
    },

    createWindow : function() {
        var opt = {
            width:640,
            height:480,
            html : '<p>Something useful would be in here.</p>',
            shim:false,
            animCollapse:false,
            constrainHeader:true
        };
        return opt;
    }
});

/**
 * signout ...
 */ 
M31Desktop.Signout = Ext.extend(M31.app.Module, {
    createCallback :function(win){
         if(!this.win){
            this.win = win;
        }
    },
    createWindow : function() {
        this.win = undefined;
        var opt = {
            width:280,
            height:100,
            modal:true,
            shim:false,
            resizable:false,
            animCollapse:false,
            minimizable: false,
            maximizable: false,
            constrainHeader:true,
            layout: 'border',
            bodyBorder: false,
            items: [{
                    region: 'north',
                    height: 35,
                    layout : 'fit',
                    border:false,
                    cls:'signout-fit',
                    padding: '10px 5px 5px 5px',
                    html: '봄 Web DestTop을 종료 하시겠습니까?'
                },
                {
                    height: 20,
                    region: 'center',
                    layout: 'column',
                    border:false,
                    items: [{
                            xtype: 'spacer'
                          , columnWidth:.25
                          , height:20
                        },
                        {
                            xtype: 'button',
                            text: '예',
                            columnWidth:.22,
                            handler: function(t, e) {
                                m31.util.loading();
                                setTimeout('window.location.href="/j_spring_security_logout"',500);
                            }
                        },
                        {
                            xtype: 'spacer'
                          , columnWidth:.06
                          , height:20
                        },
                        {
                            xtype: 'button',
                            text: '아니오',
                            columnWidth:.22,
                            handler: function(t, e) {
                                getApp('signout').win.close();
                            }
                        },
                        {
                            xtype: 'spacer'
                          , columnWidth:.25
                          , height:20
                        }
                    ]
                }]
        };
        return opt;
    }
});


/**
 * springfinder ...
 */

M31Desktop.Springfinder = Ext.extend(M31.app.Module, {
    createCallback :function(win){
         if(!this.win){
            this.win = win;
        }
    },
    createWindow : function() {
          var opt = {
            width:640,
            height:480,
            html : '<p>Something useful would be in here.</p>',
            shim:false,
            animCollapse:false,
            constrainHeader:true
        };
        return opt;
    }
});