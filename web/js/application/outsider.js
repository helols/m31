/**
 * @author outsider
 */

// Spring See
M31Desktop.SpringSee = Ext.extend(M31.app.Module, {
    source : [
        ['all', "통합검색"],
        ['google', 'Google'],
        ['daum', 'Daum'],
        ['naver', 'Naver'],
        ['flickr', 'Flickr']
    ],
    currentPage:1,
    lookup : {},
    init : function() {
        //필요한 JS
        m31.util.requiredJS("pirobox");
        
        this.initTemplates();

        this.store = new Ext.data.JsonStore({
        	url: '/gateway/springsee/search',
        	method: 'GET',
            root: 'imgInfo',
            autoload: true,
            fields: [
                'title', 'thumbnail', 'image'
//                {
//                    name:'size',
//                    type: 'float'
//                },
//                {
//                    name:'lastmod',
//                    type:'date',
//                    dateFormat:'timestamp'
//                }
            ],
            listeners: {
                'load': {fn:function() {
                    console.log("store loaded");
                    this.view.select(0);
                    //m31.showImage();
                    this.dragZone = new ImageDragZone(this.view, {containerScroll:true, ddGroup: 'explorerDD'});
                    //initializePatientDragZone(Ext.get('springsee-view').select('div.thumb'));
                }, scope:this, single:false}
            }
        });

        this.view = this.createView();
    },
    
    createView : function() {
        var formatSize = function(data) {
            if (data.size < 1024) {
                return data.size + " bytes";
            } else {
                return (Math.round(((data.size * 10) / 1024)) / 10) + " KB";
            }
        };

        var formatData = function(data) {
            data.shortName = data.title.ellipse(15);
//            data.sizeString = formatSize(data);
//            data.dateString = new Date(data.lastmod).format("m/d/Y g:i a");
            this.lookup[data.title] = data;
            return data;
        };

        return new Ext.DataView({
            tpl: this.thumbTemplate,
            singleSelect: true,
            overClass:'x-view-over',
            itemSelector: 'div.thumb-wrap',
            multiSelect: true,
            emptyText : '<div style="padding:10px;">No images match the specified search</div>',
            plugins: new Ext.DataView.DragSelector({dragSafe:true}),
            store: this.store,
            listeners: {
                //'selectionchange': {fn:this.showDetails, scope:this, buffer:100},
                //'dblclick'       : {fn:this.runGallery, scope:this},
                'loadexception'  : {fn:this.onLoadException, scope:this},
                'beforeselect'   : {fn:function(view) {
                    return view.store.getRange().length > 0;
                }}
            },
            prepareData: formatData.createDelegate(this)
        });
    },
    
    /**
     *  해당 app의 window가 제거 될때 호출되는 콜백.
     */
    removeWin: function(){
        this.view = undefined;
        this.win = undefined;
    },

    /**
     *  윈도우를 생성하기 직전에 호출되는 펑션.
     */
    beforeCreate : function() {
        if(!this.view){
            this.view = this.createView();
        }
    },

    /**
     *  윈도우를 생성된후에 호출되는 펑션.
     */
    createCallback : function(win) {
        if(!this.win){
            this.win = win;
        }
        Ext.getCmp('springsee-explorer-panel').collapse();
    },

    createWindow : function () {
        var otp = {
            layout: 'border',
            width: 640,
            height: 480,
            minWidth: 640,
            minHeight: 480,
            closeAction: 'close',
            constrainHeader:true,
            border: false,
            items:[
                {
                    id: 'springsee-view',
                    region: 'center',
                    autoScroll: true,
                    items: this.view,
                    tbar:[
                        {
                            id: 'springsee-api-provider',
                            xtype: 'combo',
                            store: new Ext.data.ArrayStore({
                                fields: ['id', 'name'],
                                data : this.source
                            }),
                            displayField:'name',
                            typeAhead: true,
                            width: 100,
                            mode: 'local',
                            editable: false,
                            displayField: 'name',
                            valueField: 'id',
                            forceSelection: true,
                            lazyInit: false,
                            triggerAction: 'all',
                            value: 'all'
                            //                        listeners: {
                            //							'select': {fn:this.sortImages, scope:this}
                            //					    }
                        },
                        ' ',
                        '-',
                        'Search:',
                        {
                            xtype: 'textfield',
                            id: 'springsee-search',
                            selectOnFocus: true,
                            width: 100,
                            enableKeyEvents: true,
                            listeners: {
//                        		'render': {fn:function(){
//    						    	Ext.getCmp('springsee-search').getEl().on('keypress', function(e, cmp){
//    						    		if (e.keyCode == Ext.EventObject.ENTER) {
//    						    			console.dir(cmp);
//    						    			console.dir(this);
//    						    			tmp.getImages();
//    						    		}
//    						    	});
//                        		}, scope:this},
                        		'keypress'  : {fn:function(cmp, evt){
		                        	if (evt.keyCode == Ext.EventObject.ENTER) {
		                        		this.getImages();
						    		}
		    				    }, scope:this}
                        	}
                        },
                        {
                            id: 'springsee-send-btn',
                            xtype: 'button',
                            text: 'Send',
                            handler: this.getImages,
                            scope: this
                        },
                        {xtype: 'tbfill'},
                        {
                            id: 'springsee-prev-btn',
                            xtype: 'button',
                            text: 'Prev',
                            disabled: true,
                            handler: this.getImages.createDelegate(this, [-1], true),
                            scope: this
                        },
                        {
                            id: 'springsee-Next-btn',
                            xtype: 'button',
                            text: 'Next',
                            disabled: true,
                            handler: this.getImages.createDelegate(this, [1], true),
                            scope: this
                        }
                    ]
                },
                {
                    region: 'south',
                    title: '탐색기',
                    xtype: 'panel',
                    collapsedTitle: '탐색기',
                    id: 'springsee-explorer-panel',
                    autoScroll: true,
                    collapsible: true,
                    ddGroup: 'explorerDD',
                    split: true,
                    margins: '0 0 0 0',
                    cmargins: '2 2 2 2',
                    height: 100,
                    html: "Drag Images to here...",
                    listeners: {
                		'render': {fn:function() {
                            //initializeHospitalDropZone(this.view);
                        }, scope:this}
                	}
                }
            ]
        };
        
        return otp;
    },

    initTemplates : function() {
        this.thumbTemplate = new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><a href="{image}" class="pirobox_gall" title="{title}"><img src="{thumbnail}" title="{title}"></a></div>',
                '</div>',
                //'<span>{shortName}</span></div>',
                '</tpl>'
                );
        this.thumbTemplate.compile();

        this.detailsTemplate = new Ext.XTemplate(
                '<div class="details">',
                '<tpl for=".">',
                '<a href="{img}" class="pirobox_gall" title="{title}">',
                '<img src="{thumbnail}"><div class="details-info">',
                '</a>',
                '<b>Image Name:</b>',
                '<span>{title}</span>',
                '<b>Size:</b>',
                '<span>{sizeString}</span>',
                '<b>Last Modified:</b>',
                '<span>{dateString}</span></div>',
                '</tpl>',
                '</div>'
                );
        this.detailsTemplate.compile();
    },

    onLoadException : function(v, o) {
        this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>');
    },

    //이미지 검색하기
    getImages : function(button, event, cmd) {
    	if (Ext.isEmpty(Ext.getCmp('springsee-search').getValue())) {
    		alert("검색어를 입력하세요.");
    		return;
    	}
    	if (cmd) {
    		this.currentPage += parseInt(cmd);
    	} else {
    		this.currentPage = 1;
    	}
    	if (this.currentPage < 1) {
    		this.currentPage = 1;
    		return;
    	}
    	new Ext.LoadMask(Ext.getCmp('springsee-view').getEl(), {store: this.store, msg:"Loading Images..."});
        this.store.reload({
        	params: {
        		search_type: Ext.getCmp('springsee-api-provider').getValue(), 
        		query: 		 Ext.getCmp('springsee-search').getValue(),
        		pageNo:		 this.currentPage
        	}
        });
        
        Ext.getCmp('springsee-prev-btn').enable();
    	Ext.getCmp('springsee-Next-btn').enable();
    }
});

String.prototype.ellipse = function(maxLength) {
    if (this.length > maxLength) {
        return this.substr(0, maxLength - 3) + '...';
    }
    return this;
};

m31.showImage = function() {
	$(".piro_overlay").remove();
	$(".pirobox_content").remove();
	
	$().piroBox({
		my_speed: 600, //animation speed
		bg_alpha: 0.5, //background opacity
		radius: 4, //caption rounded corner
		scrollImage : false, // true == image follows the page, false == image remains in the same open position
		pirobox_next : 'piro_next', // Nav buttons -> piro_next == inside piroBox , piro_next_out == outside piroBox
		pirobox_prev : 'piro_prev',// Nav buttons -> piro_prev == inside piroBox , piro_prev_out == outside piroBox
		close_all : '.piro_close',// add class .piro_overlay(with comma)if you want overlay click close piroBox
		slideShow : 'slideshow', // just delete slideshow between '' if you don't want it.
		slideSpeed : 4 //slideshow duration in seconds(3 to 6 Recommended)
	});
};

/**
 * Create a DragZone instance for our JsonView
 */
ImageDragZone = function(view, config){
    this.view = view;
    ImageDragZone.superclass.constructor.call(this, view.getEl(), config);
};
Ext.extend(ImageDragZone, Ext.dd.DragZone, {
    // We don't want to register our image elements, so let's 
    // override the default registry lookup to fetch the image 
    // from the event instead
    getDragData : function(e){
		console.log("call getDragData");
        var target = e.getTarget('.thumb-wrap');
        if(target){
            var view = this.view;
            if(!view.isSelected(target)){
                view.onClick(e);
            }
            var selNodes = view.getSelectedNodes();
            var dragData = {
                nodes: selNodes
            };
            if(selNodes.length == 1){
                dragData.ddel = target;
                dragData.single = true;
            }else{
                var div = document.createElement('div'); // create the multi element drag "ghost"
                div.className = 'multi-proxy';
                for(var i = 0, len = selNodes.length; i < len; i++){
                    div.appendChild(selNodes[i].firstChild.firstChild.cloneNode(true)); // image nodes only
                    if((i+1) % 3 == 0){
                        div.appendChild(document.createElement('br'));
                    }
                }
                var count = document.createElement('div'); // selected image count
                count.innerHTML = i + ' images selected';
                div.appendChild(count);
                
                dragData.ddel = div;
                dragData.multi = true;
            }
            return dragData;
        }
        return false;
    },

    // this method is called by the TreeDropZone after a node drop
    // to get the new tree node (there are also other way, but this is easiest)
    getTreeNode : function(){
        var treeNodes = [];
        var nodeData = this.view.getRecords(this.dragData.nodes);
        for(var i = 0, len = nodeData.length; i < len; i++){
            var data = nodeData[i].data;
            treeNodes.push(new Ext.tree.TreeNode({
                text: data.name,
                icon: '../view/'+data.url,
                data: data,
                leaf:true,
                cls: 'image-node'
            }));
        }
        return treeNodes;
    },
    
    // the default action is to "highlight" after a bad drop
    // but since an image can't be highlighted, let's frame it 
    afterRepair:function(){
        for(var i = 0, len = this.dragData.nodes.length; i < len; i++){
            Ext.fly(this.dragData.nodes[i]).frame('#8db2e3', 1);
        }
        this.dragging = false;    
    },
    
    // override the default repairXY with one offset for the margins and padding
    getRepairXY : function(e){
        if(!this.dragData.multi){
            var xy = Ext.Element.fly(this.dragData.ddel).getXY();
            xy[0]+=3;xy[1]+=3;
            return xy;
        }
        return false;
    }
});

Ext.DataView.DragSelector = function(cfg){
	console.log("DragSelector");
    cfg = cfg || {};
    var view, proxy, tracker;
    var rs, bodyRegion, dragRegion = new Ext.lib.Region(0,0,0,0);
    var dragSafe = cfg.dragSafe === true;

    this.init = function(dataView){
        view = dataView;
        view.on('render', onRender);
    };

    function fillRegions(){
        rs = [];
        view.all.each(function(el){
            rs[rs.length] = el.getRegion();
        });
        bodyRegion = view.el.getRegion();
    }

    function cancelClick(){
        return false;
    }

    function onBeforeStart(e){
        return !dragSafe || e.target == view.el.dom;
    }

    function onStart(e){
    	console.log("onStart");
        view.on('containerclick', cancelClick, view, {single:true});
        if(!proxy){
            proxy = view.el.createChild({cls:'x-view-selector'});
        }else{
            if(proxy.dom.parentNode !== view.el.dom){
                view.el.dom.appendChild(proxy.dom);
            }
            proxy.setDisplayed('block');
        }
        fillRegions();
        view.clearSelections();
    }

    function onDrag(e){
        var startXY = tracker.startXY;
        var xy = tracker.getXY();

        var x = Math.min(startXY[0], xy[0]);
        var y = Math.min(startXY[1], xy[1]);
        var w = Math.abs(startXY[0] - xy[0]);
        var h = Math.abs(startXY[1] - xy[1]);

        dragRegion.left = x;
        dragRegion.top = y;
        dragRegion.right = x+w;
        dragRegion.bottom = y+h;

        dragRegion.constrainTo(bodyRegion);
        proxy.setRegion(dragRegion);

        for(var i = 0, len = rs.length; i < len; i++){
            var r = rs[i], sel = dragRegion.intersect(r);
            if(sel && !r.selected){
                r.selected = true;
                view.select(i, true);
            }else if(!sel && r.selected){
                r.selected = false;
                view.deselect(i);
            }
        }
    }

    function onEnd(e){
        if (!Ext.isIE) {
            view.un('containerclick', cancelClick, view);    
        }        
        if(proxy){
            proxy.setDisplayed(false);
        }
    }

    function onRender(view){
        tracker = new Ext.dd.DragTracker({
            onBeforeStart: onBeforeStart,
            onStart: onStart,
            onDrag: onDrag,
            onEnd: onEnd
        });
        tracker.initEl(view.el);
    }
};