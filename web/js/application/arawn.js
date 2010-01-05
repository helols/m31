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
    	
    	this.loadMask = new Ext.LoadMask(this.win.body, {msg:"봄미투데이를 초기화 중 입니다."});
    	this.loadMask.show();
    	
    	this.springMe2dayReady();
    },
    beforeCreate: function(){
    	console.log("beforeCreate");
    	
    	this.loginModule.initializing(this);
    },
    removeWin: function(){
    	console.log("removeWin");
    	
		this.loginModule.loginState = null;
		this.loginModule.authUrl = null;
		this.loginModule.authToken = null;	
    	this.state = null;
    	this.loadMask = null;
    	
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
    	initializing: function(app){
	    	Ext.Ajax.request({
				url: '/app/me2day/initializing',
				success: this.initializingSuccess.createDelegate(app),
				failure: this.initializingFailure.createDelegate(app)
			});
    	},
    	/* loginCheck 함수에서 사용하는 콜백 : ajax 성공 */
    	initializingSuccess: function(response, opts){
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
	    			
	    			console.log(result.person);
	    	        this.me2DayModule.iconStore.loadData(result.person.postIcons, false);
	    		}
	    		else{
	    			// 인증 요청 url
	    			this.loginModule.authUrl = result.authUrl.url + "&akey=" + this.springme2dayappkey; 
	    			this.loginModule.authToken = result.authUrl.token;    			
	    		}
	    		
	    		console.log('loginModule.loginState : ' + this.loginModule.loginState);
	    		console.log('loginModule.authUrl : ' + this.loginModule.authUrl);
	    		console.log('loginModule.authToken : ' + this.loginModule.authToken);
	    		
	    		this.springMe2dayReady();
	    	}
			catch(e){
				console.log('초기화 중 오류가 발생했습니다. (' + e + ')');
				
				this.loadMask.hide();
				this.loadMask = new Ext.LoadMask(this.win.body, {msg:"초기화 중 오류가 발생했습니다.\n봄미투데이를 다시 시작해주세요."});
		    	this.loadMask.show();
			}
    	},
    	/* initializing 함수에서 사용하는 콜백 : ajax 실패 */
    	initializingFailure: function(response, opts){
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
        iconStore: new Ext.data.JsonStore({
        	autoLoad: false,
        	autoDestroy: true,
        	remoteSort: false,
            fields: [
                'iconIndex',
                'iconType',
                'description',
                'url'
            ]
        }),    	
        /** 글목록 가져오기 url 생성 : config 는 object 형식으로 PostSearchParam.java 의 값 참조 */
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
    	/** 미투데이 패널 생성 : 글쓰기 and 글목록 */
    	createView: function(app){

            var intervalID = null;
            var tcnt = 10000; //무한 이벤트 방지용.  300 * (10000/300) 초 정도.. 대기 해줌.
            /**
             * f/f 229  한글 글자 수 관련 setInterval시에 생성된 ID 제거.
             */
            var clearIntrvalFF = function(){
                if(intervalID !== null) {
                    clearInterval(intervalID);
                    tcnt = 10000;
                }
            };

            /**
             * 카운트 해주는 곳. 기존 text와 현제 length 가 같다면 update 안하고 skip.. 이것도 f/f 를 대비해서 넣은 코드.
             */
            var bodyTextLengthUpdate = function(){
                tcnt--;
                if(parseInt(jQuery('#springme2day-form-body-length').text()) !== (150-Ext.fly('springme2day-form-body').getValue().length)){
                     Ext.get('springme2day-form-body-length')
                        .update(150-Ext.fly('springme2day-form-body').getValue().length);
                }
                if(tcnt < 0){
                    clearIntrvalFF();
                }
            };
    		console.log('me2DayModule.createView()');
    		
	        // 글쓰기 패널
	        this.postFormPanel = new Ext.form.FormPanel({
	            id: 'springme2day-form-panel',
	            title: '글쓰기',
	            collapsedTitle: '글쓰기',
	            region: 'north',
	            layout: 'border',
	            height: 100,
	            plain:true,
	            waitMsgTarget: true,
	            collapsible: true,
	            titleCollapse: true,
	            items:[ new Ext.Panel({
	            	region: 'center',
	            	layout: 'border',
	            	border: false,
	            	margins: { top: 2, right: 2, bottom: 2, left: 2 },
	            	items:[{
	            		region: 'center',
	            		xtype: 'textarea',
	            		id: 'springme2day-form-body',
	            		name: 'body',
	            		emptyText: '현재 기분을 150자로 내로 남겨주세요!',
	            		allowBlank: false,
	            		blankText: '최소 한자 이상의 글을 남기셔야합니다.',
	            		maxLength: 150,
	            		maxLengthText: '글이 너무 깁니다!',
	            		enableKeyEvents: true,
	            		disableKeyFilter: true,
                        validationEvent : 'keydown',
	            		listeners: {
                            keyup : function(sender,event){
                              clearIntrvalFF();
                              bodyTextLengthUpdate();
                            },
                            keydown: function(sender,event){
                                if(event.getKey() == 229 & Ext.isGecko){
                                    if(intervalID == null){
                                        intervalID = setInterval(bodyTextLengthUpdate,300);
                                    }else{
                                        clearIntrvalFF();
                                        intervalID = setInterval(bodyTextLengthUpdate,300);
                                    }
                                    event.stopEvent();
                                }
                            },
                            blur : function(sender,event){
                                clearIntrvalFF();
                            }
	                    }
	            	},{
	            		region: 'south',
	            		xtype: 'container',
	            		layout:'border',
	            		layoutConfig: {columns: 2},
	            		height: 20,
	            		items:[{
	            			region: 'center',
		            		xtype: 'textarea',
		            		id: 'springme2day-form-tags',
		            		name: 'tags',
		            		emptyText: '태그를 입력하세요 (공백으로 구분합니다.)'
		            	},{
	            			region: 'east',
		            		xtype: 'box',
                            cls :'body-length',
		            		id: 'springme2day-form-body-length',
		            		html: '<div class="body-length">150<div>',
		            		width: 30
		            	}]
	            	}]
	            }), new Ext.Panel({
	            	region: 'east',
	            	width:90,
	            	border: false,
	            	margins: { top: 2, right: 2, bottom: 2, left: 0 },
	            	layout:'anchor',
	            	items:[{
	            		xtype: 'checkbox',
	            		id: 'springme2day-form-comment-close',
	            		anchor:'80% 35%',
	            		style: {marginLeft:'5px'},
	            		name: 'close_comment',
	            		boxLabel: '덧글 닫기'
	            	},{
	            		xtype: 'combo',
	            		id: 'springme2day-form-icon',
	            		name: 'icon',
	            		hiddenName: 'icon',
	            		anchor:'100%',
		                mode: 'local',
		                store: this.iconStore,
		                valueField: 'iconIndex',
		                displayField: 'description',
		                editable: false,
		            	selectOnFocus: true,
		            	forceSelection: true,
		            	triggerAction: 'all',
		            	invalidText: '아이콘을 선택해주세요.',
		            	validator: function(value){ return value != '' ? true : false; },
		            	listeners:{
	            			render: function(sender){ sender.setValue(1); },
		            		change: function(sender, n, o){ console.log(n); }
	            		}
	            	},{
	            		xtype: 'button',
	            		id: 'springme2day-post-send-btn',
	            		anchor:'100%',
	            		text: '전송',
	            		style: { marginTop: '2px' },
	            		handler: this.postSend.createDelegate(app)
		            }]
	            })],
	            listeners: {
	        		actioncomplete: function(form, action){
	        			console.log('actioncomplete');
	        			var result = Ext.decode(action.response.responseText);
	        			if(result.msg == 'springme2day_not_login'){
	        				
	        			}
	        			else if(result.msg == 'springme2day_postsend_success'){
	        				m31.notification.msg({target:'springme2day-win',text:'미투데이에 글을 성공적으로 전송했습니다.'});
	        			}
	        			else if(result.msg == 'springme2day_postsend_body_blank'){
	        			}
	        			else if(result.msg == 'springme2day_postsend_body_maxlength_over'){
	        			}
	        			else{
	        				m31.notification.msg({target:'springme2day-win',text:'미투데이에 글을 전송 중 네트워크 장애가 발생했습니다.'});
	        			}
	        		},
	        		actionfailed: function(form, action){
	        			console.log('actionfailed');
	        		},
	        		beforeaction: function(form, action){
	        			console.log('beforeaction');
	        			if(!form.isValid()) return false;
	        		}
	        	}
	        });
        
	    	// 글목록에 사용한 dataStore 선언
	        this.postStore = new Ext.data.JsonStore({
	        	autoLoad: false,
	        	autoDestroy: true,
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
	                'pubDateText',
	                'metooCount',
	                {name:'commentsCount', mapping: 'commentsCount', renderer: Ext.util.Format.number},
	                'comments',
	                'commentClosed',
	                {name:'location', mapping: 'location.name'},
	                {name:'writerId', mapping: 'author.id'},
	                {name:'writerNick', mapping: 'author.nickname'},
	                {name:'face', mapping: 'author.face'}
	            ]
	        });	
	        
	        // 댓글 접기 and 펼치기를 처리할 extjs grid plugin 
	        var expander = new Ext.ux.grid.RowExpander({
	        	getRowClass: function(record, rowIndex, p, ds){
	        		p.cols = p.cols-1;
		            var content = this.bodyContent[record.id];
		            if(!content){
		                content = this.getBodyContent(record, rowIndex);
		            }
		            p.body = content;
		            return content == '' ? 'x-grid3-row-expanded' : 'x-grid3-row-collapsed';
	        	},
	        	getBodyContent : function(record, index){
	                var content = this.bodyContent[record.id];
	                if(!content){
	                	var templet = '<span style="padding-left:15px;"><b>{0}</b></span> : {1}</span>';
                		var body = '';
	                	if(record.data.commentsCount > 0){
	                		Ext.each(record.data.comments, function(item, index){
	                			body += String.format(templet, item.author.nickname, item.body);
	                			if(index < record.data.commentsCount-1) body += '<br />';
	                		});
	                	}
	                    content = body;
	                    this.bodyContent[record.id] = content;
	                }
	                return content;
	            }
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
	                    expander,
	                    {header: 'me2day', dataIndex: 'post_id', align:'center', renderer: function(value, p, record){
	                    	var body = '<table width="100%" cellspacing="1" cellpadding="0" border="0">';
	                    	body += '<tr>';
	                    	body += '<td width="50"><img src="' + record.data.face + '" alt="' + record.data.writerNick + '님 프로필 사진" width="50" height="50" /></td>';
	                    	if(record.data.iconUrl){
	                    		body += '<td width="40" rowspan="2"><img src="' + record.data.iconUrl + '" width="36" height="36" /></td>';
	                    	}
	                    	else{
	                    		body += '<td width="40" rowspan="2"><img src="' + record.data.icon + '" width="36" height="36" /></td>';
	                    	}
	                    	body += '<td align="left"><p>'+record.data.body+'</p>' + record.data.tagText + '</td>';
	                    	body += '</tr>';
	                    	body += '<tr>';
	                    	if(record.data.commentClosed){
	                    		body += '<td class="springme2day-comment-close-text">댓글 닫힘</td>';
	                    	}
	                    	else{
	                    		body += '<td align="center" class="springme2day-comment-write-text" id="' + record.data.post_id + '">댓글 쓰기</td>';
	                    	}
	                    	body += '<td align="right">'+record.data.pubDateText + ' (' + record.data.location + ') by ' + record.data.writerNick+'</td>';
	                    	body += '</tr>';
	                    	body += '</table>';
	                    	return body;
	                    }}
	                ]
	            }),
	            viewConfig: {
	                autoFill:false, 
					forceFit:true,
					deferEmptyText:'', 
					emptyText: '글이 없습니다.'
	            },
	            header: false,
	            enableColumnResize: false,
	            columnLines: true,
	            loadMask: {msg:'글을 불러오는 중 입니다.'},
	            plugins: expander,
				tbar: ['->',{
					xtype: 'button',
					text: '새로고침',
					handler: this.postListRefrash.createDelegate(app)
					},'-',{
		            	xtype: 'button',
		            	text: '필터설정',
		            	handler: this.postListFilter.createDelegate(app)
		            }
				],
				listeners: {
	            	render: function(grid){
	            		grid.getGridEl().child('div[class=x-grid3-header]').setStyle('display', 'none');
	            	}
	            }
	        });
	        
	        // 미투데이 패널
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
                    this.postFormPanel,
                    this.postGrid
                ]
            });

        	// 윈도우에 미투데이 패널을 추가하고 창을 다시 그린다.
        	app.win.add(this.postPanel);
        	app.win.doLayout();
        	
        	// 글목록 부르기!
        	this.postStore.load();
        	this.postStore.on('load', function(){
        		var els = this.me2DayModule.postGrid.getEl().select('div[class="x-grid3-row-expander]', true);
        		// 덧글이 없는 글은 펼침, 접기 아이콘 숨기기
        		Ext.each(els.elements, function(el){
        			if(el.getStyle('background-position') == "-21px 2px"){
        				el.setStyle('display', 'none');
        			}
        		});
        		
        		// 덧글 쓰기에 이벤트 걸기
        		els = this.me2DayModule.postGrid.getEl().select('td[class="springme2day-comment-write-text]', true);
        		Ext.each(els.elements, function(el){
        			el.on('click', function(event, sender){
        				this.me2DayModule.showCommentDlg(this.win, sender.id);
        			}, this);
        		}, this);
        	}, app);
    		
        	return this.postPanel;
    	},
    	/** 글쓰기 */
        postSend: function(sender, event){
        	// 전송
    		this.me2DayModule.postFormPanel.getForm().submit({
    			url:'/app/me2day/postSend', 
    			waitMsg:'미투데이에 글을 전송 중 입니다.'
    		});
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
        },
        showCommentDlg: function(win, post_id){
        	var btnWrite = new Ext.Button({ text: '쓰기' });
        	var btnCancel = new Ext.Button({ text: '취소' });
        	var dlg = new Ext.Window({
        		id: 'springme2day-comment-dlg',
                title:'덧글 쓰기',
                // 모달로!
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
                width:win.width-40,
                height:140,
                layout: 'fit',
                items:[{
                	xtype: 'form',
                	id: 'springme2day-comment-dlg-form',
                	header: false,
                	layout: 'fit',
                	waitMsgTarget: true,
                    items:[{
	            		xtype: 'textarea',
	            		name: 'body',
	            		emptyText: '댓글을 150자로 내로 남겨주세요!',
	            		allowBlank: false,
	            		blankText: '최소 한자 이상의 글을 남기셔야합니다.',
	            		maxLength: 150,
	            		maxLengthText: '댓글이 너무 깁니다!'
	            	},{
	            		xtype: 'hidden',
	            		name: 'post_id',
	            		value: post_id
	            	}],
                    buttonAlign: 'center',
                    buttons:[btnWrite,btnCancel]
                }]
            });
        	btnWrite.on('click',function(event, sender){
        		dlg.get('springme2day-comment-dlg-form').getForm().submit({
        			url:'/app/me2day/commentSend', 
        			waitMsg:'미투데이에 글을 전송 중 입니다.'
        		});
        	}, dlg);
        	btnCancel.on('click',function(event, sender){ dlg.destroy(); }, dlg);
        	dlg.get('springme2day-comment-dlg-form').getForm().on(
    			'actioncomplete',
    			function(form, action){
    				dlg.destroy();
    			}
        	), dlg;
        	dlg.get('springme2day-comment-dlg-form').getForm().on(
    			'actionfailed',
    			function(form, action){}
        	), dlg;
        	dlg.get('springme2day-comment-dlg-form').getForm().on(
    			'beforeaction',
    			function(form, action){ if(!form.isValid()) return false; }
        	), dlg;
        	
    		dlg.render(win.body);
            dlg.show();
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