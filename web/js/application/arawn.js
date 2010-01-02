// 봄미투데이
M31Desktop.SpringMe2Day = Ext.extend(M31.app.Module, {
	springme2dayappkey: 'eb4d74485df2773948ccd8eefdd53ef3',
	loadMask : null, 
	state: null,
	userInfo: null,
	userConfig: null,
    init: function() {
        console.log("init");
    },
    createCallback: function(win){
    	console.log("createCallback");

    	if(!this.win){ this.win = win; }
    	this.win.app = this;
    	
    	this.loadMask = new Ext.LoadMask(win.getEl(), {msg:"봄미투데이를 초기화 중 입니다."});
    	this.loadMask.show();
    	
    	this.springMe2dayReady();
    },
    beforeCreate: function(){
    	console.log("beforeCreate");
    	
    	this.loginModule.loginCheck(this);
    },
    removeWin: function(){
    	console.log("removeWin");
    	
		this.loginModule.loginState = null;
		this.loginModule.authUrl = null;
		this.loginModule.authToken = null;	
    	this.state = null;
    	this.loadMask = null;
    	
    	this.win.destroy();
    	this.win = null;
    },
    createWindow: function(){
    	return {
    		id: 'springme2day-win',
    		width:500,
	        height:300,
	        layout:'fit',
	        constrainHeader:true,
	        closeAction: 'close',
	        border: false,
	        listeners: {
    			show: this.springMe2dayReady.createDelegate(this)
    		}
    	};
    },
    springMe2DayCanvas: new Ext.Container({
		id: 'springme2day-win-canvas', 
		border: false,
		listeners: {
    		resize: function(sender, adjWidth, adjHeight, rawWidth, rawHeight){
    			console.log('springme2day-win-canvas.resize(' + adjWidth + ', ' + adjHeight + ', ' + rawWidth + ', ' + rawHeight + ')');
    		}
    	}
	}), 
    springMe2dayReady: function(){
    	console.log('call springMe2dayReady');
    	
    	if(this.state != null) return;
    	console.log('state : ' + this.state);
    	
    	// 봄미투데이가 준비가 되었는가?
    	if(this.win == null || this.loginModule.loginState == null) return;
    	if(!this.win.isVisible()) return;
    	
    	this.state = 'ready';
    	console.log('state : ' + this.state);
    	
    	this.loadMask.hide();
    	
    	if(!this.loginModule.loginState){
    		// 로그인 패널을 생성하고 미투데이 인증페이지로 이동합니다.
    		this.loginModule.createLoginPanel(this);
    		Ext.getCmp('springme2day-login-iframepanel').setSrc(this.loginModule.authUrl);
    		
    		console.log('미투데이 인증 페이지로 이동합니다. (' + this.loginModule.authUrl + ')');
    	}
    	else{
    		// 미투데이 패널을 생성합니다.
    		this.me2DayModule.createView(this);
    	}
    },
    /* 인증 관련 변수 및 함수 집합! */
    loginModule : {
    	/* 로그인 상태 */
    	loginState: null,
    	/* 미투데이 인증 요청 URL */
    	authUrl: '',
    	/* 미투데이 인증처리용 토큰 */
    	authToken: '',
    	/* 미투데이 로그인 여부 검증 */
    	loginCheck: function(app){
	    	Ext.Ajax.request({
				url: '/app/me2day/isLogin',
				success: this.loginCheckSuccess.createDelegate(app),
				failure: this.loginCheckFailure.createDelegate(app)
			});
    	},
    	/* loginCheck 함수에서 사용하는 콜백 : ajax 성공 */
		loginCheckSuccess: function(response, opts){
	    	try { 
	    		console.log('loginCheckAjaxSuccess : ' + response.responseText);
	    		
	    		var result = Ext.decode(response.responseText);
	
	    		// 로그인 상태
	    		this.loginModule.loginState = result.state;
	    		
	    		if(result.state){
	    			// 사용자 정보
	    			this.userInfo = {
	    				id: result.authenticationInfo.user_id
	    			};
	    			// 사용자 환경설정
	    			this.userConfig = {
	    				myPostView: true,
	    				friendPostView: true,
	    				commentView: true
	    			};
	    		}
	    		else{
	    			// 인증 요청 url
	    			this.loginModule.authUrl = result.authUrl.url + "&akey=" + this.springme2dayappkey; 
	    			this.loginModule.authToken = result.authUrl.token;    			
	    		}
	    		
	    		console.log('loginModule.loginState : ' + this.loginModule.loginState);
	    		console.log('loginModule.authUrl : ' + this.loginModule.authUrl);
	    		console.log('loginModule.authToken : ' + this.loginModule.authToken);
	    	}
			catch(e){}
			
			this.springMe2dayReady();
    	},
    	/* loginCheck 함수에서 사용하는 콜백 : ajax 실패 */
    	loginCheckFailure: function(response, opts){
    		console.log('loginCheckAjaxSuccess : ' + response.responseText);
    		this.loginModule.loginState = false;
    	},
    	/* 로그인 패널 생성 함수 */
    	createLoginPanel: function(app){
    		this.loginPanel = new Ext.Panel({
            	id: 'springme2day-login-panel',
            	layout:'fit',
            	hideBorders: true,
            	listeners: {
            		resize: function(sender, adjWidth, adjHeight, rawWidth, rawHeight){
            			// console.log('springme2day-login-panel.resize(' + adjWidth + ', ' + adjHeight + ', ' + rawWidth + ', ' + rawHeight + ')');
            		}
            	},
    	        items:[{
    	        	id: 'springme2day-login-iframepanel',
    	            xtype: 'iframepanel',
    	            header: false,
    	            loadMask : {hideOnReady:true, msg:'미투데이 로그인 페이지로 이동 중 입니다.'},
    	            frameConfig: {autoCreate:{id: 'frameSpringMe2DayLogin'}},
    	            listeners: {
                		resize: function(sender, adjWidth, adjHeight, rawWidth, rawHeight){
                			// console.log('springme2day-login-iframepanel.resize(' + adjWidth + ', ' + adjHeight + ', ' + rawWidth + ', ' + rawHeight + ')');
                		}
                	}
    	        }],
	            tbar:[{
	            	id: 'springme2day-login-txt',
	            	xtype: 'tbtext',
	            	text: '미투데이 인증절차가 완료된 후 우측 버튼을 눌러주세요. ☞ '
	            },{
	            	id: 'springme2day-login-btn',
	            	xtype: 'button',
	            	text: '봄미투데이 로그인 진행...',
	            	handler: this.me2DayLoginComplete.createDelegate(app)
	            },{
	            	id: 'springme2day-login-yes-btn',
	            	xtype: 'button',
	            	text: '예',
	            	hidden: true,
	            	handler: this.me2DayLoginComplete.createDelegate(app)
	            },'-',{
	            	id: 'springme2day-login-no-btn',
	            	xtype: 'button',
	            	text: '아니요',
	            	hidden: true,
	            	handler: this.me2DayLoginComplete.createDelegate(app)
	            }]    	        
            });
    		
    		app.win.add(this.loginPanel);
    		app.win.doLayout();
    		
    		return this.loginPanel;
    	},
    	/* 미투데이 인증페이지에서 인증 후 봄미투데이 로그인을 계속 진행한다. */
    	me2DayLoginComplete: function(sender, button){
    		console.log('loginModule.me2DayLoginComplete()');
    		
    		// 로그인 진행 버튼 클릭
    		if(sender.id == 'springme2day-login-btn'){
        		this.loadMask = new Ext.LoadMask(
        				Ext.getCmp('springme2day-login-iframepanel').getEl(), 
        				{msg:"봄미투데이 로그인 절차를 진행 중 입니다."});
            	this.loadMask.show();
            	
            	Ext.getCmp('springme2day-login-txt').setText('미투데이 인증 절차를 마치셨습니까? ☞ ');
        		Ext.getCmp('springme2day-login-btn').hide();
        		Ext.getCmp('springme2day-login-yes-btn').show();
        		Ext.getCmp('springme2day-login-no-btn').show();
    		}
    		else{
    			if(sender.id == 'springme2day-login-yes-btn'){
    				// 예
    				// 봄미투데이에서 인증 작업을 진행합니다.
    				Ext.Ajax.request({
    	    			url: '/app/me2day/isAuthentication',
    	    			params: {'authToken':this.loginModule.authToken},
    	    			success: this.loginModule.me2DayAuthenticationSuccess.createDelegate(this),
    	    			failure: this.loginModule.me2DayAuthenticationFailure.createDelegate(this)
    	    		});
    			}
    			else{
    				// 아니오
    				Ext.getCmp('springme2day-login-txt').setText('미투데이 인증절차가 완료된 후 우측 버튼을 눌러주세요. ☞');
            		Ext.getCmp('springme2day-login-btn').show();
            		Ext.getCmp('springme2day-login-yes-btn').hide();
            		Ext.getCmp('springme2day-login-no-btn').hide();
            		
    				this.loadMask.hide();
    			}
    		}
    		
        	/*Ext.MessageBox.show({
        		title:'봄미투데이 로그인...',
        		msg: '미투데이 인증 절차를 마치셨습니까?',
        		buttons: Ext.Msg.YESNO,
        		fn: this.loginModule.springMe2DayLoginProcess.createDelegate(this),
        		icon: Ext.MessageBox.QUESTION
        	});*/
    	},
    	/* 미투데이 로그인 후 봄미투데이 인증 ajax 콜백함수 */
    	me2DayAuthenticationSuccess: function(response, opts){
    		console.log('me2DayAuthenticationSuccess : ' + response.responseText);
    		
    		try { 
    			var result = Ext.decode(response.responseText);
    			console.log(result.springMe2DayUserSession);
    			console.log(result.springMe2DayUserSession.userId);
    			this.userInfo = {
    				id: result.springMe2DayUserSession.userId
    			};
	    		
	    		// 로그인 패널이 있으면..
	    		if(this.win.get('springme2day-login-panel')){
	    			this.win.get('springme2day-login-panel').destroy();
	    		}
	    		
	    		this.me2DayModule.createView(this);
	    	}
			catch(e){}
			
			this.loadMask.hide();
    	},
    	/* 미투데이 로그인 후 봄미투데이 인증 ajax 콜백함수 */
    	me2DayAuthenticationFailure: function(response, opts){
    		console.log('me2DayAuthenticationFailure : ' + response.responseText);    		
    	}    	
    },
    me2DayModule: {
    	apiUrl: '/app/me2day/',
    	get_posts: function(config){
    		var url = this.apiUrl + 'postList';
    		if(config.post_id){
    			url += '?post_id=' + config.post_id;
    		}
    		else{
    			url += '?id=' + config.userId;
    			if(config.myPostView){ url += '&myPostView=true'; }
    			if(config.friendPostView){ url += '&friendPostView=true'; }
    			if(config.commentView){ url += '&commentView=true'; }
    		}
    		
    		console.log('me2DayModule.get_posts() : ' + url);
    		
    		return url;
    	},
    	createView: function(app){
    		console.log('me2DayModule.createView()');
    		
	        // 글쓰기 패널
	        this.writePanel = new Ext.Panel({
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
	            		id: 'springme2day-post-send-btn',
	            		text: 'Send',
	            		height: 26,
	            		width: 70,
	            		style: { marginTop: '2px' },
	            		handler: this.postSend.createDelegate(app)
		            }]
	            })]
	        });
        
	    	// 글목록에 사용한 dataStore 선언
	        this.postStore = new Ext.data.JsonStore({
	        	autoLoad: false,
	        	autoDestroy: true,
	        	remoteSort: true,
	        	// 'http://me2day.net/me2/topic/entertainment/read.json'
	        	proxy: new Ext.data.HttpProxy({
	        		url: this.get_posts(Ext.apply({userId:app.userInfo.id}, app.userConfig))
	        	}),
	            idProperty: 'post_id',
	            root: 'postList',
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
	        
	        
	        // 글목록 그리드
	        this.postGrid = new Ext.grid.GridPanel({
	        	id: 'springme2day-postGrid',
	        	region: 'center',
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
					xtype: 'button',
					text: '새로고침',
					handler: this.postListRefrash.createDelegate(app)
					},'-',{
		            	xtype: 'button',
		            	text: '필터설정',
		            	handler: this.postListFilter.createDelegate(app)
		            }
				]            
	        });
	        
        	this.postPanel = new Ext.Container({
            	id: 'springme2day-postbody-panel',
            	layout: 'border',
    	        border: false,
    	        listeners: {
            		resize: function(sender, adjWidth, adjHeight, rawWidth, rawHeight){
            			console.log('springme2day-postbody-panel resize');
            		}
            	},
    	        items:[
                    this.writePanel,
                    this.postGrid
                ]
            });

        	app.win.add(this.postPanel);
        	app.win.doLayout();
        	
        	// 글목록 부르기!
        	this.postStore.load();
    		
        	return this.postPanel;
    	},
    	/** 글쓰기 */
        postSend: function(sender, event){
        	// 전송
    		this.loadMask = new Ext.LoadMask(this.me2DayModule.postPanel.getEl(), {msg:"미투데이에 글을 전송 중 입니다."});
        	this.loadMask.show();
        	
        	Ext.getCmp('springme2day-content-text').setValue('');
        	
        	this.loadMask.hide();
        },
        /** 새로고침 : 버튼이벤트 */
        postListRefrash: function(sender, event){
        	this.me2DayModule.postStore.proxy.setUrl(this.me2DayModule.get_posts(
        			Ext.apply({userId:this.userInfo.id}, this.userConfig)));
        	this.me2DayModule.postStore.load();
        },
        /** 필터설정 버튼 */
        postListFilter: function(sender, event){
        	var dlg = new Ext.Window({
        		id: 'springme2day-filterconfig-panel',
                // autoCreate : true,
                title:'필터설정',
                // 설정창은 모달로!
                modal: true,
                // 설정창이 봄미투데이 밖으로 못빠져 나가게 막아라
                constrain:true,
                // 크기 조절은 없다!
                resizable:false,
                // constrainHeader:true,
                // 최소화, 최대화, 닫기 버튼은 없다!
                minimizable : false,
                maximizable : false,
                closable:false,
                // buttonAlign:"center",
                width:300,
                height:200,
                bodyStyle: 'padding:3px;',
                items:[new Ext.FormPanel({
                	id: 'springme2day-filter-form-panel',
                	header: false,
                    border: false,
                    items:[{
                    	 xtype: 'fieldset',
                         title: '모아보는 설정',
                         autoHeight: true,
                         layout: 'form',
                         items: [{
                             xtype: 'checkboxgroup',
                             hideLabel: true,
                             columns: 3,
                             items: [
                                 {boxLabel: '나는', name: 'myPostView', checked: true},
                                 {boxLabel: '모는 친구', name: 'friendPostView', checked: true},
                                 {boxLabel: '댓글', name: 'commentView', checked: true}
                             ]
                         }]                         
                    }]
                })],
				tbar: [{
					xtype: 'button',
					text: '적용',
					handler : this.me2DayModule.postListFilterCommand.createDelegate(this)
					},'-',{
		            	xtype: 'button',
		            	text: '닫기',
		            	handler: this.me2DayModule.postListFilterCommand.createDelegate(this)
		            }
				]
            });
            dlg.render(this.win.body);
            dlg.show();
        },
        postListFilterCommand: function(sender, event){
        	if(sender.text == '적용'){
        		var values = Ext.getCmp('springme2day-filter-form-panel').getForm().getValues();
        		
        		this.userConfig.myPostView = values["myPostView"] == 'on' ? true : false;
        		this.userConfig.friendPostView = values["friendPostView"] == 'on' ? true : false;
        		this.userConfig.commentView = values["commentView"] == 'on' ? true : false;
        		
        		this.me2DayModule.postStore.proxy.setUrl(this.me2DayModule.get_posts(
            			Ext.apply({userId:this.userInfo.id}, this.userConfig)));
            	this.me2DayModule.postStore.load();
        	}
			
			// 설정 패널 파괴
			Ext.getCmp('springme2day-filterconfig-panel').destroy();
        },
        postListFilterCancle: function(sender, event){
        	this.loadMask.hide();
        }
    }
});

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

/*
 * 
 */
/*Ext.MessageBox.getDialog = Ext.override.createInterceptor(function(){
	return getDialog(arguments);
});*/

/*Ext.override(, function(){
	return {
		test: function(titleText){
			console.log(titleText);
		}
	};
});*/

//Ext.apply(Ext.MessageBox.getDialog, function(test){console.log(test);});

//Ext.override(Ext.MessageBox.getDialog, function(test){console.log(test);});