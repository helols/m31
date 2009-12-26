// 봄미투데이
M31Desktop.SpringMe2Day = Ext.extend(M31.app.Module, {
    init : function() {
        console.log("init");
    },
    createCallback : function(win){
		console.log("createCallback");
    	//if(!this.win){
        //    this.win = win;
        //}
		
		//var postConfigPanelCollapsedEl = Ext.get(this.postConfigPanel.id + '-xcollapsed');
    	//postConfigPanelCollapsedEl.titleEl = postConfigPanelCollapsedEl.createChild({style: 'color:#15428b;font:11px/15px tahoma,arial,verdana,sans-serif;padding:2px 5px;', cn: this.postConfigPanel.title});
    	
    	//var writePanelCollapsedEl = Ext.get(this.writePanel.id + '-xcollapsed');
    //	writePanelCollapsedEl.titleEl = writePanelCollapsedEl.createChild({style: 'color:#15428b;font:11px/15px tahoma,arial,verdana,sans-serif;padding:2px 5px;', cn: this.writePanel.title});
    	
    	//console.log(Ext.getDom(this.writePanel.id + '-xcollapsed'));
    	 
		
		// 창이 생성되면 기본 미투데이 글목록을 불러온다
		this.postGrid.store.load();
    },
    beforeCreate : function(){
    	console.log("beforeCreate");
    },
    removeWin: function(){
    	console.log("removeWin");
    	// this.win = undefined;
    },
    createWindow : function(){
        this.postStore = new Ext.data.JsonStore({
        	autoLoad: false,
        	autoDestroy: true,
        	remoteSort: true,
        	proxy: new Ext.data.ScriptTagProxy({
        		url: 'http://me2day.net/me2/topic/entertainment/read.json'
        	}),
            idProperty: 'post_id',
            fields: [
                'post_id',
                'me2dayPage',
                'permalink',
                'contentType',
                'tagText',
                'iconUrl',
                'icon',
                'body',
                'pubDate',
                'metooCount',
                'commentsCount',
                {name:'location', mapping: 'location.name'},
                {name:'writerId', mapping: 'author.id'},
                {name:'writerNick', mapping: 'author.nickname'},
                {name:'face', mapping: 'author.face'}
            ]
        });	
        
        this.postGrid = new Ext.grid.GridPanel({
        	id: 'springme2day-postGrid',
            store: this.postStore,
            cm: new Ext.grid.ColumnModel({
                defaults: {
                    sortable: false,
                    menuDisabled:true
                },
                columns: [
                    {header: 'me2day', dataIndex: 'post_id', align:'right', renderer: function(value, p, record){
                    	return record.data.pubDate + ' (' + record.data.location + ') by ' + record.data.writerNick;
                    }}
                ]
            }),
            viewConfig: {
                autoFill:false, 
				forceFit:true,
				enableRowBody:true,
				deferEmptyText:'', 
				emptyText: '글이 없습니다.',
				showPreview:true,
	            getRowClass : function(record, rowIndex, p, store){
	                if(this.showPreview){
	                	var body = '<table>';
                    	body += '<tr>';
                    	body += '<td width="60"><img src="' + record.data.face + '" alt="' + record.data.writerNick + '님 프로필 사진" width="60" height="60" /></td>';
                    	if(record.data.iconUrl != null){
                    		body += '<td width="50"><img src="' + record.data.iconUrl + '" width="44" height="44" /></td>';
                    	}
                    	else{
                    		body += '<td width="50"><img src="' + record.data.icon + '" width="44" height="44" /></td>';
                    	}
                    	body += '<td><p>'+record.data.body+'</p></td>';
                    	body += '</tr>';
                    	body += '</table>';
                    	
	                    p.body = body;
	                    
	                    return 'x-grid3-row-expanded';
	                }
	                return 'x-grid3-row-collapsed';
	            }
            },
            header: false,
            loadMask: {msg:'글을 불러오는 중 입니다.'},
			tbar: [{
				text: '새로고침',
				handler : function(){Ext.getCmp('springme2day-postGrid').store.reload();}
				}
			]            
        });
    	
    	var config = {
    			layout: 'border', 			
				width:500,
		        height:300,
		        closeAction: 'close',
		        constrainHeader:true,
		        border: false,
		        margins:'1 1 1 1',
		        items:[
                    this.writePanel = new Ext.Panel({
    		        	// 상단 미투 글쓰기판
    		            id: 'me2day-writePanel',
    		            title: '글쓰기',
    		            collapsedTitle: '글쓰기',
    		            region: 'north',
    		            layout: 'border',
    		            height: 81,
    		            plain:true,
                        collapsible: true,
                        titleCollapse: true,
    		            items:[new Ext.Panel({
    		            	region: 'center',
    		            	layout: 'fit',
    		            	border: false,
    		            	margins: { top: 2, right: 2, bottom: 2, left: 2 },
    		            	items:[{
    		            		xtype: 'textarea',
    		            		id: 'springme2day-content-text',
    		            		maxLength: 150,
    		            		maxLengthText: '글이 너무 깁니다.'
    		            	}]
    		            }),new Ext.Panel({
    		            	region: 'east',
    		            	layout: 'fit',
    		            	width:70,
    		            	border: false,
    		            	margins: { top: 2, right: 2, bottom: 2, left: 0 },
    		            	items:[{
			            		xtype: 'combo',
			            		id: 'springme2day-em-combo',
			            		typeAhead: true,
	    		                triggerAction: 'all',
	    		                mode: 'local',
	    		                store: new Ext.data.ArrayStore({
	    		                    id: 0,
	    		                    fields: [
	    		                        'myId',
	    		                        'displayText'
	    		                    ],
	    		                    data: [[1, 'item1'], [2, 'item2']]
	    		                }),
	    		                valueField: 'myId',
	    		                displayField: 'displayText'
    		            	},{
    		            		xtype: 'button',
    		            		id: 'springme2day-send-btn',
    		            		text: 'Send',
    		            		height: 26,
    		            		width: 70,
    		            		style: { marginTop: '2px' },
    		            		handler: function(sender, event){
    		            			// 전송
    		            			Ext.getCmp('springme2day-content-text').setValue('');
    		            		}
        		            }]
    		            })]
                    }),{
                    	region: 'center',
                    	xtype: 'container',
                    	layout: 'fit',          	
                    	margins:'0 0 0 0',
    			        border: false,
    			        items:[this.postGrid]
                    }
                ]
    	};
    	return config;
    }
});

/*Ext.layout.BorderLayout.Region.prototype.getCollapsedEl = Ext.layout.BorderLayout.Region.prototype.getCollapsedEl.createSequence(function() {
	if(!this.collapsedEl.titleEl) {
		console.log("== collapsedEl ==================================================");
		console.log(this.collapsedEl);
		this.collapsedEl.titleEl = this.collapsedEl.createChild({style: 'color:#15428b;font:11px/15px tahoma,arial,verdana,sans-serif;padding:2px 5px;', cn: this.panel.title});
	}
});*/

/*
 * Ext.layout.BorderLayout 의 접기 기능을 통해서 패널을 접으면 타이틀이 보이지 않는다.
 * 오버라이드를 통해서 확장으로 접기 타이틀 기능을 추가한다.
 */
Ext.override(Ext.layout.BorderLayout, {
	// Ext.layout.BorderLayout 의 오리지날 소스를 그대로 들고왔음!
    onLayout : function(ct, target){
	    var collapsed;
	    if(!this.rendered){
	        var items = ct.items.items;
	        collapsed = [];
	        for(var i = 0, len = items.length; i < len; i++) {
	            var c = items[i];
	            var pos = c.region;
	            if(c.collapsed){
	                collapsed.push(c);
	            }
	            c.collapsed = false;
	            if(!c.rendered){
	                c.render(target, i);
	                c.getPositionEl().addClass('x-border-panel');
	            }
	            this[pos] = pos != 'center' && c.split ?
	                new Ext.layout.BorderLayout.SplitRegion(this, c.initialConfig, pos) :
	                new Ext.layout.BorderLayout.Region(this, c.initialConfig, pos);
	            this[pos].render(target, c);
	        }
	        
	        this.rendered = true;
	    }
	    
	    var size = target.getViewSize(false);
	    if(size.width < 20 || size.height < 20){ 
	        if(collapsed){
	            this.restoreCollapsed = collapsed;
	        }
	        return;
	    }else if(this.restoreCollapsed){
	        collapsed = this.restoreCollapsed;
	        delete this.restoreCollapsed;
	    }
	
	    var w = size.width, h = size.height;
	    var centerW = w, centerH = h, centerY = 0, centerX = 0;
	
	    var n = this.north, s = this.south, west = this.west, e = this.east, c = this.center;
	    if(!c && Ext.layout.BorderLayout.WARN !== false){
	        throw 'No center region defined in BorderLayout ' + ct.id;
	    }
	
	    if(n && n.isVisible()){
	        var b = n.getSize();
	        var m = n.getMargins();
	        b.width = w - (m.left+m.right);
	        b.x = m.left;
	        b.y = m.top;
	        centerY = b.height + b.y + m.bottom;
	        centerH -= centerY;
	        n.applyLayout(b);
	    }
	    if(s && s.isVisible()){
	        var b = s.getSize();
	        var m = s.getMargins();
	        b.width = w - (m.left+m.right);
	        b.x = m.left;
	        var totalHeight = (b.height + m.top + m.bottom);
	        b.y = h - totalHeight + m.top;
	        centerH -= totalHeight;
	        s.applyLayout(b);
	    }
	    if(west && west.isVisible()){
	        var b = west.getSize();
	        var m = west.getMargins();
	        b.height = centerH - (m.top+m.bottom);
	        b.x = m.left;
	        b.y = centerY + m.top;
	        var totalWidth = (b.width + m.left + m.right);
	        centerX += totalWidth;
	        centerW -= totalWidth;
	        west.applyLayout(b);
	    }
	    if(e && e.isVisible()){
	        var b = e.getSize();
	        var m = e.getMargins();
	        b.height = centerH - (m.top+m.bottom);
	        var totalWidth = (b.width + m.left + m.right);
	        b.x = w - totalWidth + m.left;
	        b.y = centerY + m.top;
	        centerW -= totalWidth;
	        e.applyLayout(b);
	    }
	    if(c){
	        var m = c.getMargins();
	        var centerBox = {
	            x: centerX + m.left,
	            y: centerY + m.top,
	            width: centerW - (m.left+m.right),
	            height: centerH - (m.top+m.bottom)
	        };
	        c.applyLayout(centerBox);
	    }
	    if(collapsed){
	        for(var i = 0, len = collapsed.length; i < len; i++){
	            collapsed[i].collapse(false);
	        }
	    }
	    
	    // 확장된 함수를 호출한다.
	    this.onCollapsedTitle([n,s,west,e,c]);
	    
	    if(Ext.isIE && Ext.isStrict){ 
	        target.repaint();
	    }
	},
	// 접었을때 보여줄 타이틀의 태그
	collapsedTitleTpl : new Ext.Template('<span id={id}>{title}</span>'),
	onCollapsedTitle : function(configs){
		for(idx=0; idx<configs.length; idx++){
			if(configs[idx]){
				// custom title for collapsed
				// collapsedTitle      : 'string'
				// collapsedTitleCls   : 'string'
				if (typeof configs[idx].collapsedEl != 'undefined' && configs[idx].collapsedTitle){
					var collapsedEl = configs[idx].collapsedEl;
					var titleId = collapsedEl.id+'-title';
					if(!Ext.get(titleId)){
						console.log(configs[idx].collapsedTitle);
						console.log(collapsedEl);
						
						var insertedHtml = this.collapsedTitleTpl.insertFirst(collapsedEl,{ id : titleId, title : configs[idx].collapsedTitle });
						if(configs[idx].collapsedTitleCls) {
							Ext.get(insertedHtml).addClass(configs[idx].collapsedTitleCls);
						}
						else{
							Ext.get(insertedHtml).addClass('x-panel-collapsed-title-text');
						}
					}
				}				
			}
		}
	}
});