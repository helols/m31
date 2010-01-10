movingbox = function() {
    var itemEdge = 30;
    var edge = 0;
    var sliderWidth = 0;
    var actItem;
    var r_actItem;
    var actIdx = -1;
    var totalCnt = 0;
    var itemWidth = 236;
    var activeSpot = false;
    var DEMO = "panel_demo", CHANGE = "panel_change" ,  NEW = "panel_newuser";
    var notiUniqeId = [];
    var focusFieldName = null;
    var lastEmailAddress = null;
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


    var spot = new Ext.ux.Spotlight({
        easing: 'easeOut',
        duration: .25
    });

    var spotcallback = function() {
        if (activeSpot) {
            activeSpot = false;
        } else {
            activeSpot = true;
        }
    }
    /**
     * 아이템들의 위치를 정해주는 곳.
     */
    var positionItem = function() {
        Ext.each(Ext.select('div.panel').elements,
                function(item, idx) {
                    var el = Ext.get(item);
                    if (el.getWidth() != itemWidth) {
                        actItem = undefined;
                        r_actItem = el;
                        totalCnt = 1;
                        actIdx = -1;
                        itemMoveAnime(el, edge + (itemWidth + itemEdge) * idx, "N");
                    } else {
                        el.setLeft(edge + (itemWidth + itemEdge) * idx)
                                .setOpacity(.7)
                                .hover(onItemMouseEnter, onItemMouseLeave, this);
                    }
                });
    };
    /**
     * 클릭시 아이템 이동 펑션.
     * @param e
     * @param t
     */
    var onItemMouseDown = function(e, t) {
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
                        r_actItem = actItem;
                        actItem = _self;
                        type = 'L';
                        left = (sliderWidth / 2 ) - (256 / 2);
                        preLeftEdge = sufLeftEdge;
                    } else {
                        if (actIdx === -1) {
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
     * new user 가 활성화 될떄
     * @param el
     */
    var actNewItemFn = function(el) {
        el.down('div.inside')
                .down('div.newuser')
                .scale(256, 192, true);

        el.down('div.addition')
                .setVisible(true)
                .setHeight(40, true);
    };

    /**
     * new user 가 비활성화 될떄.
     * @param el
     */
    var dieNewItemFn = function(el, inside) {
        inside = inside.down('div.newuser').scale(216, 162, true);
        el.down('div.addition')
                .setHeight(-10, true);
    };
    /**
     * new User 메인 페널의 에니메이션이 끝나고 callback.. .
     * @param el
     */
    var cbNewItemFn = function(el) {

    };

    /**
     * Demo 가 활성화 될떄.
     * @param el
     */
    var actDemoItemFn = function(el) {
        el.down('div.addition')
                .setVisible(true)
                .setHeight(40, true)
                .down('input.j_password').dom.value = "springsprout";
    };

    /**
     * Demo 가 비활성화 될떄.
     * @param el
     */
    var dieDemoItemFn = function(el, inside) {
        el.down('div.addition')
                .setHeight(-10, true);
    };

    /**
     * Change 가 활성화 될떄.
     * @param el
     */
    var actChangeItemFn = function(el) {
        el.down('div.addition')
                .setVisible(true)
                .setHeight(70, true)
                .down('input.j_password')
                .addClass('password')
                .prev('input.j_email')
                .addClass('email')
                .up('div.addition')
    };

    /**
     * Change 가 비활성화 될떄.
     * @param el
     */
    var dieChangeItemFn = function(el, inside) {
        el.down('div.addition')
                .setHeight(-10, true);
    };

    /**
     * User 가 활성화 될때.
     * @param el
     */
    var actUserItemFn = function(el) {
        el.down('div.addition')
                .setVisible(true, true)
                .down('img.nextbtn').on('click', signin)
                .prev('input.j_password')
                .addClass('password');
    };

    /**
     * User 가 비활성화 될때.
     * @param el
     */
    var dieUserItemFn = function(el, inside) {
        el.down('div.addition')
                .setHeight(-10, true);
    };
    /**
     * 아이템의 이동 에니메이션 정의
     * @param el
     * @param left
     * @param type
     */
    var itemMoveAnime = function(el, left, type) {
        type = type || 'N';
        var opt = {opactiy:.7,height:162,width:216,top:40};
        if (type === 'L') {
            opt = {opactiy:1,height:232,width:256,top:10};
            el.down('div.inside')
                    .scale(256, el.id === CHANGE ? 162 : 192, true)
                    .child('div.name_text')
                    .setWidth(256, true)
                    .setOpacity(1)
                    .update(el.child('div.addition input.j_username').getValue());
            switch (el.id) {
                case NEW: actNewItemFn(el); break;
                case DEMO:  actDemoItemFn(el); break;
                case CHANGE: actChangeItemFn(el); break;
                default: actUserItemFn(el); break;
            }
        } else if (el.down('div.inside').getWidth() !== 216) {
            var inside = el.down('div.inside').scale(216, 162, true);
            switch (el.id) {
                case NEW: dieNewItemFn(el, inside); break;
                case DEMO: dieDemoItemFn(el, inside); break;
                case CHANGE: dieChangeItemFn(el, inside); break;
                default: dieUserItemFn(el, inside); break;
            }
            inside.child('div.name_text')
                    .setWidth(216, true)
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

    var itemMoveAfterCallback = function(el) {
        if (actItem && el.id === actItem.id) {
            switch (el.id) {
                case NEW: break;
                case DEMO:  break;
                case CHANGE: break;
                default:  break;
            }
        } else if (r_actItem && r_actItem.id === el.id) {
            el.down('div.inside')
                    .child('div.name_text')
                    .setOpacity(.7, true);
            el.down('div.addition')
                    .setVisible(false)
        }
        totalCnt--;
    };

    /**
     * passwordField 포커스가 왓을 경우.. bk css 삭제.
     * @param e
     * @param t
     */
    var focusField = function(e, t) {
        var tel = Ext.fly(t);
        tel.removeClass(tel.hasClass('j_email') ? 'email' : 'password');
        if (tel.hasClass('j_email')) {
            emailSaveNoti();
        }
    };

    /**
     * 자동 email 클릭시 노티..
     * @param e
     * @param t
     */

    var emailSaveNoti = function() {
        m31.util.notification({
            title:'Login Info'
            , text:Ext.get('email_btn').dom.src.indexOf("add") != -1 ? 'E-mail 기억 모드 Off.' : 'E-mail 기억 모드 On.'
            , remove : true
            , time:2500
        });
    };
    /**
     * passwordField에서 focus가 떠났을때... bk css 추가.(값이 있을경우.)
     * @param e
     * @param t
     */
    var blurField = function(e, t) {
        var tel = Ext.fly(t);
        if (tel.getValue().length === 0) {
            tel.addClass(tel.hasClass('j_email') ? 'email' : 'password');
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
        if (edge === 0) {
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

    var loading_remove = function() {
        m31.util.loading_remove(500);
    };

    var moveViewPage = function() {
        window.location.href = "/desktop/view";
    };

    /**
     * signin gogosing..
     * @param e
     * @param t
     */
    var signin = function(e, t) {
        var tEl = Ext.get(this);
        m31.util.loading(true);
        Ext.Ajax.request({
            method:'POST',
            url: '/j_spring_security_check',
            params: {
                j_username: tEl.parent().down("input.j_username").getValue(),
                j_password: tEl.prev('input.j_password').getValue()
            },
            success: function(response, opts) {
                //                loading_remove();
                console.log(response.responseText);
                //                window.location.href="/desktop/view";
                m31.util.notification({title:'signin...',text:'Test'});
            },
            failure: function(response, opts) {
                loading_remove();
            }
        });
    };

    var signup = function() {
        var email = jQuery('#j_username').val();
        m31.util.notificationRemove(notiUniqeId);
        m31.util.loading();
        Ext.Ajax.request({
            method:'POST',
            url: '/main/signup',
            params: {
                j_username: email,
                j_password: jQuery('#j_password').val(),
                j_nickname: jQuery('#j_nickname').val()
            },
            success: function(response, opts) {
                notiUniqeId = [];
                jQuery('div.signup input').removeClass('signupvalidate');
                loading_remove();
                var result = Ext.decode(response.responseText);
                switch (result.signstat) {
                    case 'validate':
                        Ext.each(result.errInfo, function(error, idx) {
                            if (idx === 0) {
                                focusFieldName = error.field;
                            }
                            jQuery('#' + error.field).addClass('signupvalidate');
                            notiUniqeId.push(m31.util.notification({title:'signup validate...',text:error.defaultMessage,time:3000}));
                        });
                        setTimeout(setFocus, 500);
                        break;
                    case 'success':
                        var usersstr = null
                        var users = m31.util.getUserCookie();
                        if (users.length === 0) {
                            usersstr = email;
                        } else {
                            if (users.join(',').indexOf(email) === -1) {
                                users.push(email);
                            }
                            usersstr = users.join(',');
                        }
                        Ext.util.Cookies.set("springsprout", usersstr, new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)), "/");
                        break;
                    case 'fail':
                        m31.util.notification({title:'signup...',text:'signup 도중 오류가 발생했습니다. ㅠㅠ'});
                        break;
                }
                //                window.location.href="/desktop/view";
            },
            failure: function(response, opts) {
                loading_remove();
                m31.util.notification({title:'signup...',text:'signup 도중 오류가 발생했습니다. ㅠㅠ'});
            }
        });
    };
    /**
     * 경고를 딜레이 시키기 위해서....
     */
    var emailconfirmEventDefer = function() {
        setTimeout(emailconfirm, 500);
    };
    /**
     * email 컨펌.하기. 형식과 중복.
     */
    var emailconfirm = function() {
        var email = jQuery('#j_username').val();
        if (email === lastEmailAddress || email.length === 0 || lastEmailAddress === 'not') {
            return false;
        }
        lastEmailAddress = email;
        var p = /[\w\~\-\.]+@[\w\~\-]+(\.[\w\~\-]+)+/;
        if (!p.test(email)) {
            m31.util.notification({title:'signup...',text:'email 형식에 맞지 않는 주소를 입력했습니다.'});
        } else {
            Ext.Ajax.request({
                method:'POST',
                url: '/main/emailconfirm',
                params: {
                    email: email
                },
                success: function(response, opts) {
                    var result = Ext.decode(response.responseText);
                    if (result.emailconfirm) {
                        m31.util.notification({
                            title:'signup'
                            , text:email + '은 이미 가입되어 있는 Email주소입니다.'
                            , remove : true
                            , time:2500
                        });
                    }
                }
            });
        }

    };
    //EXT JS FOCUS 는 IE7에서 동작을 안함. jQuery Foucs 동작함.
    var setFocus = function() {
        jQuery('#' + focusFieldName).focus();
        focusFieldName = null;
    };

    //layer out render!
    var relayer = function() {
        if (!spot.active) {
            var top = Ext.lib.Dom.getViewHeight() / 2 - (Ext.fly('slider').getHeight() / 2);
            Ext.fly('slider').setTop(top);
            Ext.select('.arrow').setTop(top);
            calcEdge();
            positionItem();
        }
    };
    /**
     * 0 : seq number , 1: 그라바타 url , 2. userNAme, 3.email
     * @param users
     */
    var makeUserIcon = function(users) {
        var userIconTemplate = new Ext.Template(' <div class="panel" id="panel_user_{0}"> '
                , '        <div class="inside"> '
                , '            <img src="{1}" '
                , '                 alt="{2} - gravatar"/> '
                , '            <div class="name_text">{2}</div> '
                , '        </div> '
                , '        <div class="addition user-addition"> '
                , '            <input type="hidden" name="j_username" class="j_username" value="{3}"> '
                , '            <input type="hidden" name="j_title" class="j_title" value="{2}"> '
                , '            <input type="password" name="j_password" class="j_password"> '
                , '            <img class="nextbtn" src="/images/main/login.png" title="Login!"/> '
                , '        </div> '
                , '    </div> ');
        userIconTemplate.compile();

    };
    return {
        init: function(users) {
            Ext.select('div.name_text').setOpacity(.7);
            relayer();
            Ext.fly('newNextBtnImg').on('click', function() {
                if (activeSpot) {
                    return false;
                }
                spot.show(NEW, spotcallback);
                $.quickFlip.flip(0);
                Ext.fly('new-addition')
                        .down('#newNextBtnImg').setStyle({display:'none'})
                        .next('img').removeClass('display')
                        .next('img').removeClass('display')
                        .next('img').removeClass('display');
                focusFieldName = 'j_username';
                setTimeout(setFocus, 500);
            });

            Ext.fly('cancleBtnImg').on('click', function() {
                if (!activeSpot) {
                    return false;
                }
                lastEmailAddress = 'not';
                m31.util.notificationRemove();
                spot.hide(spotcallback);
                $.quickFlip.flip(0);
                Ext.fly('new-addition')
                        .down('#newNextBtnImg').setStyle({display:'block'})
                        .next('img').addClass('display')
                        .next('img').addClass('display')
                        .next('img').addClass('display');
                jQuery('#j_username').val('');
                jQuery('#j_password').val('');
                jQuery('#j_nickname').val('');
                jQuery('div.signup input').removeClass('signupvalidate');
            });
            Ext.get('email_btn').on('click', function(e, t) {
                var src = "../../images/main/email-";
                if (this.dom.src.indexOf("add") != -1) {
                    src += "del.png";

                } else {
                    src += "add.png";
                }
                this.dom.src = src;
                emailSaveNoti();
            });

            Ext.select('input.j_password').on('focus', focusField).on('blur', blurField);
            Ext.select('input.j_email').on('focus', focusField).on('blur', blurField);
            Ext.select('div.panel').on('click', onItemMouseDown);
            Ext.select('img.nextbtn').on('click', signin);
            Ext.fly('signupBtnImg').on('click', signup);
            Ext.fly('j_username').on('blur', emailconfirmEventDefer);
            Ext.EventManager.onWindowResize(relayer, this);

            setTimeout(function() {
                Ext.fly('start-mask').fadeOut({
                    endOpacity: 0,
                    easing: 'easeIn',
                    duration: .5,
                    remove: true
                });
            }, 300);
        }
    }
}();