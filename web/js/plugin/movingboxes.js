movingbox = function() {
    //    var totalPanels = $(".scrollContainer").children().size();
    //
    //    var regImgWidth = $(".panel .inside").css("width");
    //    var regImgeheight = $(".panel .inside").css("height");
    //    var regTop = $(".panel .inside").css("top");
    //
    //    var movingDistance = 300;
    //
    //    var curImgWidth = 256;
    //    var curImgheight = 192;
    //    var curTop = 0;
    //
    //    var $panels = $('#slider .scrollContainer > div');
    //    var $container = $('#slider .scrollContainer');
    //
    //    //	$panels.css({'float' : 'left','position' : 'relative'});
    //
    //    $("#slider").data("currentlyMoving", false);
    //
    //    $container
    //            .css('width', ($panels[0].offsetWidth * $panels.length) + 100)
    //            .css('left', ($('#slider').innerWidth() / 2 ) - (($panels[0].offsetWidth * $panels.length) / 2));
    //
    //    function returnToNormal(element) {
    //        $(element).animate({ width: regImgWidth ,height:regImgeheight, top:regTop})
    //                .parent().animate({paddingRight: '10px'}).css("opacity","0.6");
    //    };
    //
    //    function growBigger(element) {
    //        $(element).animate({ width: curImgWidth,height:curImgheight, top:curTop})
    //                .parent().animate({paddingRight: '40px'}).css("opacity","1");
    //
    //    };
    //    //direction true = right, false = left
    //    function change(direction) {
    //
    //        //if not at the first or last panel
    //        if ((direction && !(curPanel < totalPanels)) || (!direction && (curPanel <= 1))) {
    //            return false;
    //        }
    //
    //        //if not currently moving
    //        if (($("#slider").data("currentlyMoving") == false)) {
    //
    //            $("#slider").data("currentlyMoving", true);
    //
    //            var next = direction ? curPanel + 1 : curPanel - 1;
    //            var leftValue = $(".scrollContainer").css("left");
    //            var movement = direction ? parseFloat(leftValue, 10) - movingDistance : parseFloat(leftValue, 10) + movingDistance;
    //
    //            $(".scrollContainer")
    //                    .stop()
    //                    .animate({ "left": movement}, function() {
    //                $("#slider").data("currentlyMoving", false);
    //            });
    //
    //            returnToNormal("#panel_" + curPanel+" .inside");
    //            growBigger("#panel_" + next +" .inside");
    //
    //            curPanel = next;
    //
    //            //remove all previous bound functions
    //            $("#panel_" + (curPanel + 1)).unbind();
    //
    //            //go forward
    //            $("#panel_" + (curPanel + 1)).click(function() {
    //                change(true);
    //            });
    //
    //            //remove all previous bound functions
    //            $("#panel_" + (curPanel - 1)).unbind();
    //
    //            //go back
    //            $("#panel_" + (curPanel - 1)).click(function() {
    //                change(false);
    //            });
    //
    //            //remove all previous bound functions
    //            $("#panel_" + curPanel).unbind();
    //        }
    //    }
    //
    //    // Set up "Current" panel and next and prev
    //    var curPanel = parseInt(Math.ceil($panels.length / 2));
    ////    growBigger("#panel_" + parseInt(Math.ceil($panels.length / 2)));
    //
    //    $("#panel_" + (curPanel + 1)).click(function() {
    //        change(true);
    //    });
    //    $("#panel_" + (curPanel - 1)).click(function() {
    //        change(false);
    //    });
    //
    //    //when the left/right arrows are clicked
    //    //	$(".right").click(function(){ change(true); });
    //    //	$(".left").click(function(){ change(false); });
    //
    //    $(document).keydown(function(event) {
    //        switch (event.keyCode) {
    //            case 37: //left arrow
    //                change(false);
    //                break;
    //            case 39: //right arrow
    //                change(true);
    //                break;
    //        }
    //    });
    //
    //    this.layout = function(){
    //        conslole.log('d')
    //          Ext.fly('slider').setTop(Ext.lib.Dom.getViewHeight() / 2 - (Ext.fly('slider').getHeight() / 2));
    //    }
    var itemEdge = 30;
    var edge = 0;
    var sliderWidth = 0;
    var actItem;
    var actIdx = -1;
    var totalCnt = 0;

    /**
     * 아이템들의 사이즈가 slider 보다 작을때.. 가운데 정렬을 위한 edge 를 구하는 곳.
     */
    var calcEdge = function() {
        var el = Ext.fly('slider');
        sliderWidth = el.getWidth();
        var itemWidth = el.first().getWidth() + itemEdge;
        var itemSize = Ext.select('div.panel').elements.length;
        var totalWidth = itemWidth * itemSize + itemEdge;
        edge = sliderWidth - totalWidth > 0 ? (sliderWidth / 2 ) - (totalWidth / 2) + itemEdge : 0;
    };

    /**
     * 아이템들의 위치를 정해주는 곳.
     */
    var positionItem = function() {
        Ext.each(Ext.select('div.panel').elements,
                function(item, idx) {
                    var el = Ext.fly(item);
                    el.setLeft(edge + (el.getWidth() + itemEdge) * idx)
                            .setOpacity(.7)
                            .hover(onItemMouseEnter, onItemMouseLeave, this)
                            .on('mousedown', onItemMouseDonw, this);
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
            el.down('div.d_password').setVisible(true, true);
            el.down('div.inside').scale(256, 192, true).down('div.name_text').setWidth(256, true).update(el.child('input.j_username').getValue());
        } else {
            el.down('div.inside').scale(216, 162, true).down('div.name_text').setWidth(216, true).update(el.child('input.j_title').getValue());
        }
        el.animate({
            opacity: {to: opt.opactiy, from: .7},
            height: {to: opt.height, from: 0},
            width: {to: opt.width, from: 0},
            top : {to:opt.top, from:0},
            left: {to:left, from:0}
        }, .35, itemMoveAfterCallback);
    };

    var itemMoveAfterCallback = function(el) {
        if (actItem.id !== el.id) {
            el.down('div.d_password').setVisible(false);
        }
        totalCnt--;
    }
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

    return {
        init: function() {
            Ext.select('div.name_text').setOpacity(.6);
            this.layout();
            positionItem();

        },
        layout : function() {
            var top = Ext.lib.Dom.getViewHeight() / 2 - (Ext.fly('slider').getHeight() / 2);
            Ext.fly('slider').setTop(top);
            Ext.select('.arrow').setTop(top);
            calcEdge();
        }
    }
}();