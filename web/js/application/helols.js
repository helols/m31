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
    createCallback :function(win) {
        if (!this.win) {
            this.win = win;
        }
    },
    createWindow : function(options) {
        options = options||{};
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
            items: [
                {
                    region: 'north',
                    height: 35,
                    layout : 'fit',
                    border:false,
                    cls:'signout-fit',
                    padding: '10px 5px 5px 5px',
                    html: options.msg||'봄 Web DeskTop을 종료 하시겠습니까?'
                },
                {
                    height: 20,
                    region: 'center',
                    layout: 'column',
                    border:false,
                    items: [
                        {
                            xtype: 'spacer'
                            ,
                            columnWidth:.25
                            ,
                            height:20
                        },
                        {
                            xtype: 'button',
                            text: '예',
                            columnWidth:.22,
                            handler: options.yesClick||this.yesClick
                        },
                        {
                            xtype: 'spacer'
                            ,
                            columnWidth:.06
                            ,
                            height:20
                        },
                        {
                            xtype: 'button',
                            text: '아니오',
                            columnWidth:.22,
                            handler: options.noClick||this.noClick
                        },
                        {
                            xtype: 'spacer'
                            ,
                            columnWidth:.25
                            ,
                            height:20
                        }
                    ]
                }
            ]
        };
        return opt;
    },
    yesClick : function(){
//        m31.util.loading(false,'signout... plz wait...');
        window.location.href="/j_spring_security_logout";
//        setTimeout('window.location.href="/j_spring_security_logout"', 500);
    },
    noClick : function(){
         getApp('signout').win.close();
    }
});


/**
 * springfinder ...
 */

M31Desktop.Springfinder = Ext.extend(M31.app.Module, {
    init : function() {
        //        m31.util.requiredJS("springfindertree");
    },
    createCallback :function(win) {
        if (!this.win) {
            this.win = win;
        }
    },
    createWindow : function() {
        var springfinderDataPanel = new M31.app.SpringFinderPanel({
            height : 500,
            border : false,
            rootNodeId : 1
        });

        var springfinderPanel = new Ext.Panel({
            region : 'center',
            height : 500,
            collapsible: false,
            split: true,
            border: false,
            layout:'fit',
            items:[springfinderDataPanel],
            tools:[
                {
                    id:'refresh',
                    qtip: '새로고침',
                    // hidden:true,
                    handler: function(event, toolEl, panel) {
                        panel.get(0).getStore().reload();
                    }
                }
            ]
        });

        var springfinderTree = new M31.app.SpringFinderTree({finderpanel:springfinderDataPanel});
        springfinderDataPanel.springfinderTree = springfinderTree;


        var opt = {
            layout: 'border',
            width:800,
            height:500,
            items :[
                springfinderTree,
                springfinderPanel
            ]
        };
        return opt;
    }
});
