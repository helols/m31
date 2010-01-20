SpringDock = function() {
    var _instance = null;
    var springdock,springdockcontainer;
    var addDockBtn = function(appInfo) {
        return new M31.dt.DockButton({
            appId     : appInfo.appId
            , appName   : appInfo.appName
        }, springdockcontainer.el);
    };
    return {
        getInstance : function() {
            if (_instance === null) {
                _instance = {
                    init : function () {
                        springdockcontainer = new M31.dt.SpringDockContainer({
                            id:'springdock-container',
                            el :'m31-springdock-container',
                            border: false,
                            itemMaxWidth: 10,
                            itemWidth: 50,
                            itemWidthEdge : 58,
                            proximity: 50
                        });

                        var opt = {
                            id:'springdock',
                            el: 'm31-springdock',
                            //            layout: 'fit',
                            border: false,
                            frame:false,
                            items:[springdockcontainer] // dock-container 넣어주기 ?
                        };
                        springdock = new M31.dt.SpringDock(opt);
                        return _instance;
                    },
                    build : function() {
                        springdockcontainer.springdock = springdock;
                        springdockcontainer.pos = m31.util.getPosition(springdock.el);
                        return _instance;
                    },
                    initDockButton : function(appInfos) {
                        $("#processbar").progressBar(70);
                        for (var x in appInfos) {
                            if (appInfos[x].appInstallYn === "Y") {
                                springdockcontainer.dockbtns.push(addDockBtn(appInfos[x]));
                            }
                        }
                        Ext.select('.m31-springdock-item-img').setOpacity(.7);
                        springdockcontainer.positionContainer(0);
                        springdockcontainer.el.addClass('container');
                        springdockcontainer.positionItems();
                        $("#processbar").progressBar(80);
                        setTimeout(function(){
                            $("#processbar").progressBar(100);
                        }, 150);
                        setTimeout(function(){
                                Ext.get('booting-view').remove();
                                Ext.get('booting-mask').fadeOut({remove:true});
                                var userInfo = M31.ApplicationRegistry.getInstance().initData();
                                console.dir(userInfo);
                                if(userInfo[0] === true){
                                    m31.util.notification({title:'환영인사!',text:'Demo User입니다.. 봄가이드를 보시고 즐기세요~~',remove:true});
                                }else{
                                    m31.util.notification({title:'환영인사!',text:userInfo[1]+'님이 접속하셨네요~',remove:true});
                                    if(userInfo[2]){
                                        m31.util.openWindow('springguide');
                                    }
                                }
                            }, 700);
                    },
                    add : function(appInfo) {
                        springdockcontainer.dockbtns.push(addDockBtn(appInfo));
                        springdockcontainer.positionContainer(0);
                        springdockcontainer.positionItems();
                    },
                    getSpringDock : function() {
                        return springdock;
                    }
                }
            }
            return _instance;
        }
    }
}();

M31.dt.SpringDock = Ext.extend(Ext.Container, {
    initComponent : function() {
        M31.dt.SpringDock.superclass.initComponent.call(this);
        this.el.setHeight = Ext.emptyFn;
        this.el.setWidth = Ext.emptyFn;
        this.el.setSize = Ext.emptyFn;
        this.allowDomMove = false;
        this.renderTo = this.el;
    }
});

M31.dt.SpringDockContainer = Ext.extend(Ext.BoxComponent, {
    initComponent : function() {
        M31.dt.SpringDockContainer.superclass.initComponent.call(this);
        Ext.fly(this.el).hover(this.onMouseEnter, this.onMouseLeave, this);
        Ext.fly(this.el).on('mousemove', this.onMouseMove, this);
        Ext.EventManager.onWindowResize(this.fireResize, this);
        this.dockbtns = [];
    },
    onMouseLeave : function(e) {
        e.preventDefault();
        this.positionItems(this.el);
        this.positionContainer(0);
    },
    onMouseEnter : function(e) {
    },
    onMouseMove : function(e) {
        var _self = this;
        var pointer = e.getXY();
        var toAdd = 0;
        var posx =
                pointer[0] - _self.pos.x -
                (_self.springdock.getWidth() - _self.itemWidth * _self.dockbtns.length) / 2 - _self.itemWidth / 2;

        var posy = Math.pow(pointer[1] - _self.pos.y - _self.springdock.getHeight() / 2, 2);
        Ext.each(_self.dockbtns,
                function(item, idx) {
                    distance = Math.sqrt(
                            Math.pow(posx - idx * _self.itemWidthEdge, 2)
                                    + posy
                            );
                    distance -= _self.itemWidth / 2;

                    distance = distance < 0 ? 0 : distance;
                    distance = distance > _self.proximity ? _self.proximity : distance;
                    distance = _self.proximity - distance;

                    extraWidth = _self.itemMaxWidth * distance / _self.proximity;
                    item.el.setStyle({
                        width: _self.itemWidth + extraWidth + 'px',
                        left:  (_self.itemWidthEdge * idx) + 10 + + toAdd + 'px'
                    });
                    toAdd += extraWidth;
                });
        this.positionContainer(toAdd);
    },
    positionItems : function() {
        var _self = this;
        Ext.each(_self.dockbtns,
                function(item, idx) {
                    item.el.setStyle({
                        width: _self.itemWidth + 'px',
                        left:_self.itemWidthEdge * idx + 10 + 'px'
                    });
                });
    }
    ,
    positionContainer : function(r_edge, r_width) {
        var f_width = r_width || this.springdock.getWidth();
        var edge = r_edge === undefined ? this.itemMaxWidth * 2 : r_edge;
        var itemSize = this.dockbtns.length;
        var left = (f_width - this.itemWidthEdge * itemSize) / 2 - edge / 2 + 'px';
        var width = (this.itemWidthEdge * itemSize) + edge + 'px';
        this.setPosition(left, 0);
        this.setWidth(width);
    }
    ,
    fireResize : function(w, h) {
        this.pos = m31.util.getPosition(this.springdock.el);
        this.positionContainer(0, w);
        this.positionItems(this.springdock);
    }
})
        ;

/**
 * Taskbar 버튼.
 */
M31.dt.DockButton = function(appInfo, el) {

    M31.dt.DockButton.superclass.constructor.call(this, {
        id : 'btn-' + appInfo.appId,
        imgId : appInfo.appId,
        actImgId : appInfo.appId + '_act',
        itemText : appInfo.appName,
        renderTo: el,
        iconCls:'m31-springdock-item-img',
        buttonSelector : 'img',
        handler : function(t, e) {
            var win = M31.WindowsManager.getInstance().getWindow(appInfo.appId);
            if (appInfo.appId === 'signout') {
                var app = M31.ApplicationRegistry.getInstance().getApp(appInfo.appId);
                app.beforeCreate();
                win = M31.WindowsManager.getInstance().createWindow(appInfo.appId,
                        Ext.apply(app.createWindow(), {
                            id:appInfo.appId + '-win',
                            title:appInfo.appName,
                            iconCls:appInfo.appId + '-win-icon'
                        }));
                app.createCallback(win);
                win.show();
            }
            else if (!win) {
                var options = {
                    url : '/desktop/checkSignin'
                    ,method: 'GET'
                    ,scope:this
                    ,success:function() {
                        var app = M31.ApplicationRegistry.getInstance().getApp(appInfo.appId);
                        app.beforeCreate();
                        win = M31.WindowsManager.getInstance().createWindow(appInfo.appId,
                                Ext.apply(app.createWindow(), {
                                    id:appInfo.appId + '-win',
                                    title:appInfo.appName,
                                    iconCls:appInfo.appId + '-win-icon'
                                }));
                        app.createCallback(win);
                        win.show();
                    }
                };
                Ext.Ajax.request(options);


            }
            else if (win.minimized || win.hidden) {
                win.show();
            } else if (win === win.manager.getActive()) {
                win.minimize();
            } else {
                win.toFront();
            }
        },
        clickEvent:'click',
        template : new Ext.Template(
                '<span id="{0}" class="m31-springdock-item">',
                '<img class="{3}" src="{1}" alt="{2}"/>',
                '<span class="m31-springdock-item-text">{2}</span>',
                '</span>')
    });

    //    remove
};

Ext.extend(M31.dt.DockButton, Ext.Button, {
    initComponent : function() {
        M31.dt.DockButton.superclass.initComponent.call(this);
    },
    onRender : function() {
        M31.dt.DockButton.superclass.onRender.apply(this, arguments);
        Ext.fly(this.id).hover(this.onMouseEnter, this.onMouseLeave, this);
    },
    onMouseLeave : function() {
        this.toggleBtn(this.id, 'L');
    },

    onMouseEnter : function() {
        this.toggleBtn(this.id, 'E');
    },

    toggleBtn : function(cmp_id, type) {
        Ext.fly(cmp_id).select('.m31-springdock-item-text').setStyle('display', type === 'E' ? 'block' : 'none');
        Ext.fly(cmp_id).select('.m31-springdock-item-img').setOpacity(type === 'E' ? 1 : .7);

    }

});

/**
 * Dock 버튼을 위한 button 클래스 오버라이드
 * 0 : id
 * 1 : imgSrc
 * 2 : itemText 리턴.
 */
Ext.override(M31.dt.DockButton, {
    getTemplateArgs : function() {
        return [this.id,'../../images/desktop/springdock/' + this.imgId + '.png', this.itemText,this.iconCls];
    }
});