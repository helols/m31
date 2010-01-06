movingbox = function() {
    var itemEdge = 30;
    var edge = 0;
    var sliderWidth = 0;
    var actItem;
    var actIdx = -1;
    var totalCnt = 0;
    var itemWidth = 236;
    var DEMO = "panel_demo" ,
            CHANGE = "panel_change" ,
            NEW = "panel_newuser",
            LOGIN_AFT = "LA",
            CHANGE_AFT = "CA",
            NEW_AFT = "NA";
    /**
     * 아이템들의 사이즈가 slider 보다 작을때.. 가운데 정렬을 위한 edge 를 구하는 곳.
     */
    var calcEdge = function() {
        var el = Ext.fly('slider');
        sliderWidth = el.getWidth();
        var itemSize = Ext.select('div.panel').elements.length;
        var totalWidth = (itemWidth + itemEdge) * itemSize + itemEdge;
        edge = sliderWidth - totalWidth > 0 ? (sliderWidth / 2 ) - (totalWidth / 2) + itemEdge : 0;
    };

    /**
     * 아이템들의 위치를 정해주는 곳.
     */
    var positionItem = function() {
        Ext.each(Ext.select('div.panel').elements,
                function(item, idx) {
                    var el = Ext.get(item);
                    if (el.getWidth() != itemWidth) {
                        actItem = undefined;
                        totalCnt = 1;
                        actIdx = -1;
                        itemMoveAnime(el, edge + (itemWidth + itemEdge) * idx, "N");
                    } else {
                        el.setLeft(edge + (itemWidth + itemEdge) * idx)
                                .setOpacity(.7)
                                .hover(onItemMouseEnter, onItemMouseLeave, this)
                                .on('mousedown', onItemMouseDonw, this);
                    }
                });
    };
    /**
     * 클릭시 아이템 이동 펑션.
     * @param e
     * @param t
     */
    var onItemMouseDonw = function(e, t) {
        var el = Ext.get(this);
        if (actItem === this || totalCnt != 0) {
            //            e.preventDefault();
            return false;
        }
        var clickIdx = -1;
        var _self = this;
        Ext.each(Ext.select('div.panel').elements, function(item, idx) {
            if (_self === this) {
                clickIdx = idx;
            }
            totalCnt = idx + 1;
        });
        var preLeftEdge = ((sliderWidth / 2 ) - (256 / 2)) - el.getLeft();
        var sufLeftEdge = 40 + preLeftEdge;
        Ext.each(Ext.select('div.panel').elements,
                function(item, idx) {
                    var type = "N";
                    var left = 0;
                    var iel = Ext.get(item);
                    if (_self === this) {
                        actItem = _self;
                        type = 'L';
                        left = (sliderWidth / 2 ) - (256 / 2);
                        preLeftEdge = sufLeftEdge;
                    } else {
                        if (actIdx == -1) {
                            left = iel.getLeft() + preLeftEdge;
                        } else {
                            var iLeft = iel.getLeft();
                            if (actIdx > clickIdx && actIdx < idx) {
                                iLeft -= 40;
                            } else if (actIdx < clickIdx && actIdx >= idx && clickIdx > idx) {
                                iLeft += 40;
                            }
                            left = iLeft + preLeftEdge;
                        }
                    }
                    itemMoveAnime(iel, left, type);
                });
        actIdx = clickIdx;
    };

    /**
     * 아이템의 이동 에니메이션 정의
     * @param el
     * @param left
     * @param type
     */
    var itemMoveAnime = function(el, left, type) {
        type = type || 'N';
        var opt = {opactiy:.7,height:162,width:216,top:30};
        if (type === 'L') {
            opt = {opactiy:1,height:232,width:256,top:0};
            //            var cssName = 'password';
            //            if(el.id == 'panel_chage') {cssName = 'email'} else if(el.id == 'panel_newuser') {cssName = ''}
            if (el.id === NEW) {
                el.down('div.addition').setVisible(true, true);
            } else if (el.id === DEMO) {
                el.down('div.addition').setVisible(true, true)
                        .down('img.nextbtn').on('mousedown', signin)
                        .prev('input.j_password').dom.value = "springsprout";
            } else {
                el.down('div.addition')
                        .setVisible(true, true)
                        .down('img.nextbtn').on('mousedown', signin)
                        .prev('input.j_password')
                        .addClass(el.id === CHANGE ? 'email' : 'password')
                        .on('focus', focusField)
                        .on('blur', blurField);
            }
            el.down('div.inside')
                    .scale(256, 192, true)
                    .down('div.name_text')
                    .setWidth(256, true)
                    .setOpacity(1)
                    .update(el.child('input.j_username').getValue());
        } else {
            el.down('div.inside')
                    .scale(216, 162, true)
                    .down('div.name_text')
                    .setWidth(216, true)
                    .setOpacity(.7)
                    .update(el.child('input.j_title').getValue());
        }
        el.animate({
            opacity: {to: opt.opactiy, from: .7},
            height: {to: opt.height, from: 0},
            width: {to: opt.width, from: 0},
            top : {to:opt.top, from:0},
            left: {to:left, from:0}
        }, .35, itemMoveAfterCallback);
    };
    /**
     * item 이동 에니메이션 끝나고 콜백.
     * @param el
     */

    var spot = new Ext.ux.Spotlight({
        easing: 'easeOut',
        duration: .3
    });
    var itemMoveAfterCallback = function(el) {
        if ((!actItem) || actItem.id !== el.id) {
            if (el.id === NEW) {
                el.child('div.addition').setVisible(false);
            } else {
                el.child('input.j_password').dom.value = '';
                el.child('input.j_password')
                        .removeClass(el.id === CHANGE ? 'email' : 'password')
                        .un('focus', focusField)
                        .un('blur', blurField)
                        .up('div.addition')
                        .setVisible(false)
                        .down('img.nextbtn').un('mousedown', signin);
            }
        }
        totalCnt--;
    }
    /**
     * 넘어오는 값에 따라 .... child 에 대한 ACTION을 결정함.
     * @param el
     * @param actionTpye
     */
    var childAction = function(el, actionTpye) {
        switch (actionTpye) {
            case DEMO :

                break;

        }
    };
    /**
     * passwordField 포커스가 왓을 경우.. bk css 삭제.
     * @param e
     * @param t
     */
    var focusField = function(e, t) {
        var tel = Ext.fly(t);
        tel.removeClass(tel.hasClass('password') ? 'password' : 'email');
    };

    /**
     * passwordField에서 focus가 떠났을때... bk css 추가.(값이 있을경우.)
     * @param e
     * @param t
     */
    var blurField = function(e, t) {
        var tel = Ext.fly(t);
        if (tel.getValue().length == 0) {
            tel.addClass(tel.up('#' + CHANGE, 2) ? 'email' : 'password');
        }
    };

    /**
     * 아이템위에 마우스가 올라왔을때.
     */
    var onItemMouseEnter = function(e) {
        if (actItem === this) {
            return false;
        } else {
            Ext.fly(this).setOpacity(.9);
        }
    };
    /**
     * 아이템에서 마우스가 떠났을때.
     */
    var onItemMouseLeave = function(e) {
        if (actItem === this) {
            return false;
        } else {
            Ext.fly(this).setOpacity(.7);
        }
    };

    /**
     * 페이징 형식의 화살표 컨트럴.
     */
    var arrowctr = function() {
        if (edge == 0) {
            Ext.each(Ext.select('a.arrow').elements,
                    function(item, idx) {
                        Ext.fly(item).hover(onArrowMouseEnter, onArrowMouseLeave, this);
                    });
        }
    };

    var onArrowMouseEnter = function() {
        var arrow = '&gt';
        if (Ext.fly(this).hasClass('arrowleft')) {
            arrow = '&lt';
        }
        Ext.fly(this).update(arrow);
    };
    var onArrowMouseLeave = function() {
        Ext.fly(this).update('&nbsp;');
    };

    var loading_remove = function(){
        m31.util.loading_remove(500);
    };
    var signin = function(e, t) {
        m31.util.notification({title:'signin...',text:'Test'});
//        var tEl = Ext.get(this);
//        m31.util.loading('../../images',true);
//        Ext.Ajax.request({
//            method:'POST',
//            url: '/j_spring_security_check',
//            params: {
//                j_username: tEl.parent().down("input.j_username").getValue(),
//                j_password: tEl.prev('input.j_password').getValue()
//            },
//            success: function(response, opts) {
////                window.location.href="/desktop/view";
//            },
//            failure: function(response, opts) {
//                loading_remove();
//            }
//        });
    };
    return {
        init: function() {
            Ext.select('div.name_text').setOpacity(.7);
            this.layout();
            positionItem();
            Ext.fly('newNextBtnImg').on('mousedown', function() {
                spot.show(NEW)
            });
            Ext.EventManager.onWindowResize(movingbox.layout, this);
            m31.util.loading_remove(500);

        },
        layout : function() {
            var top = Ext.lib.Dom.getViewHeight() / 2 - (Ext.fly('slider').getHeight() / 2);
            Ext.fly('slider').setTop(top);
            Ext.select('.arrow').setTop(top);
            //            Ext.fly('arrow').setTop(top+30);
            calcEdge();
            positionItem();
        }
    }
}();