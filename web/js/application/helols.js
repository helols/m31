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
            items: [
                {
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
                            handler: function(t, e) {
                                m31.util.loading();
                                setTimeout('window.location.href="/j_spring_security_logout"', 500);
                            }
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
                            handler: function(t, e) {
                                getApp('signout').win.close();
                            }
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
    }
});


/**
 * springfinder ...
 */

M31Desktop.Springfinder = Ext.extend(M31.app.Module, {
    createCallback :function(win) {
        if (!this.win) {
            this.win = win;
        }
    },
    getTreePanel : function() {
        var url = '/app/springfinder/getTree';
        var tree = new Ext.tree.TreePanel({
            // tree
            animate:true,
            enableDD:true,
            expandable:false,
            containerScroll: true,
            //            ddGroup: 'organizerDD',
            rootVisible:true,
            region:'west',
            width:200,
            split: true,
            title : 'springfinder',
            collapsible: true,
            height : 600,
            autoScroll:true,
            loader : new Ext.tree.TreeLoader({
				 url:url				
			}),
            root: {
                    nodeType: 'async',
                    text: '/',
                    draggable: false,
                    allowDrag:false,
                    allowDrop:false,
                    id: 1
            },
            margins: '0'
        });
        return tree;
    },
    createWindow : function() {
        var _self = this;
        var opt = {
            layout: 'border',
            width:800,
            height:600,
            shim:false,
            animCollapse:false,
            constrainHeader:true,
            items :[_self.getTreePanel(),
                {
                    region:'center' ,
                    layout:'fit',
                    html:'야호.' ,
                    width : 200 ,
                    heigth :600
                }
            ]
        };
        return opt;
    }
});

Ext.override(Ext.tree.TreeLoader,{
    processResponse : function(response, node, callback, scope){
        var json = response.responseText;
        try {
            var o = response.responseData || Ext.decode(json).treeList;
            node.beginUpdate();
            for(var i = 0, len = o.length; i < len; i++){
                var n = this.createNode(o[i]);
                if(n){
                    node.appendChild(n);
                }
            }
            node.endUpdate();
            this.runCallback(callback, scope || node, [node]);
        }catch(e){
            this.handleFailure(response);
        }
    }
})