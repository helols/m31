//봄북
M31Desktop.SpringBook = Ext.extend(M31.app.Module, {
	loadMask : null, 
	state: null,
    init: function() {
	    console.log("init");
	  //필요한 JS
    },
    createCallback: function(win){
    	console.log("createCallback");

    	if(!this.win){ this.win = win; }
    	this.win.app = this;
    	
    	this.loadMask = new Ext.LoadMask(this.win.body, {msg:"봄북을 초기화 중 입니다."});
    	this.loadMask.show();
    	
    	this.runner = new Ext.util.TaskRunner();
        console.log(this);
    	var redyTask = {
    	    run: function(app){
	    		if(app.state != null) return;
	        	console.log('state : ' + app.state);
	        	
	        	// 봄북이 준비가 되었는가?
	        	if(app.win == null) return;
	        	if(!app.win.isVisible()) return;
	        	
	        	app.state = 'ready';
	        	console.log('state : ' + app.state);
	        	
	        	app.createBookView();
	        	
	        	app.loadMask.hide();
	        	
	        	app.runner.stopAll();
	        	
	        	// 검색필드에 포커스
	        	Ext.getCmp('springbook-search-text').focus();
    		},
    	    interval: 1000,
    	    args: [this]
    	};
    	this.runner.start(redyTask);
    },
    beforeCreate: function(){
    	console.log("beforeCreate");
    },
    removeWin: function(){
    	console.log("removeWin");
    	this.state = null;
    	this.loadMask = null;
    	
    	this.win.app = null;
    	this.win = null;
        this.runner.stopAll();
    },
    createWindow: function(){
    	return {
    		id: 'springbook-win',
    		width:480,
	        height:500,
	        minWidth: 480,
            minHeight: 500,
	        layout:'fit',
	        constrainHeader:true,
	        closeAction: 'close',
	        border: false
    	};
    },
    createBookView: function(){
    	this.bookStore = new Ext.data.JsonStore({
        	url: '/gateway/springbook/search',
        	baseParams: {searchType:'naver',query:''},
        	autoLoad: false,
        	autoDestroy: true,
            root: 'springBookDTO.books',
            fields: [
                'title',
                'link',
                'image',
                'author',
                'price',
                'discount',
                'publisher',
                {name: 'pubdate', convert: function(v, record){
                	return String.format('{0}/{1}/{2}', v.substring(0, 4), v.substring(4, 2), v.substring(6));
                }},
                'isbn',
                'description'
            ]
        });	
        
    	this.bookListPanel = new Ext.grid.GridPanel({
        	id: 'springbook-view',
        	region: 'center',
        	store: this.bookStore,
            cm: new Ext.grid.ColumnModel({
                defaults: {
                    sortable: false,
                    menuDisabled:true
                },
                columns: [
                    {header: '책 정보 조회 결과입니다.', dataIndex: 'title', align:'center', renderer: function(value, p, record){
                    	var body = '<table width="100%" cellspacing="1" cellpadding="0" border="0">';
                    	body += '<tr>';
                    	body += '<td width="64" rowspan="2"><img src="' + record.data.image + '" alt="' + record.data.title + '" width="60" height="80" /></td>';
                    	body += '<td align="left">';
                    	body += '<a href="' + record.data.link + '" target="blank"><b>' + record.data.title + '</b></a><br />';
                    	body += record.data.author + ' 저 | ' + record.data.publisher + ' | ' + record.data.pubdate;
                    	body += '</td>';
                    	body += '</tr>';
                    	body += '<tr>';
                    	body += '<td align="left" style="padding: 2 2 2 10;">';
                    	body += record.data.description;
                    	body += '</td>';
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
				emptyText: '검색된 책이 없습니다.'
            },
            header: false,
            enableColumnResize: false,
            columnLines: true,
            loadMask: {msg:'책을 찾는 중 입니다.'},
            ddGroup: 'firstGridDDGroup',
            enableDragDrop: true,
            stripeRows: true,
			tbar: [{
					xtype: 'tbtext',
					text: '',
					width: 5
				},{
					id: 'springbook-api-provider',
                    xtype: 'combo',
                    store: new Ext.data.ArrayStore({
                        fields: ['id', 'name'],
                        data : [
							['naver', 'Naver']
                        ]
                    }),
                    width: 100,
                    mode: 'local',
                    editable: false,
                    valueField: 'id',
                    displayField: 'name',
                    forceSelection: true,
                    lazyInit: false,
                    triggerAction: 'all',
                    typeAhead: true,
                    value: 'naver'
				},'-',{
					xtype: 'tbtext',
					text: '책 제목 : '
				},{
					xtype: 'textfield',
                    id: 'springbook-search-text',
                    selectOnFocus: true,
                    width: 100,
                    enableKeyEvents: true,
                    listeners: {
                		'keypress'  : {fn:function(cmp, evt){
                        	if (evt.keyCode == Ext.EventObject.ENTER) {
                        		this.bookStore.load({params:{
    								searchType:Ext.getCmp('springbook-api-provider').getValue(),
    								query:Ext.getCmp('springbook-search-text').getValue()}});
				    		}
    				    }, scope:this}
                	}
				},{
					xtype: 'button',
					text: '검색',
					handler: function(sender, event){
							this.bookStore.load({params:{
								searchType:Ext.getCmp('springbook-api-provider').getValue(),
								query:Ext.getCmp('springbook-search-text').getValue()}});
						}.createDelegate(this)
				}
			],
			listeners: {
            	render: function(grid){
            		grid.getGridEl().child('div[class=x-grid3-header]').setStyle('display', 'none');
            		// 드래그시 보내줄 데이터 생성 처리
            		grid.getView().dragZone = new Ext.grid.GridDragZone(this, {
            			ddGroup: 'springfinderpenelDD',
            			onBeforeDrag: function(data, e) {
            				var items = new Array();
            				Ext.each(data.selections, function(item){
            					items.push({
            						'fileName': item.data.title,
            						'fileAddition': Ext.encode(item.data)	            						
            					});
            				});
            				
            				data.linkAppId = 'springbook';
            				data.isApp = true;
            				data.items = items;
            			},
            			getDragData: function(e){
	            			var t = Ext.lib.Event.getTarget(e);
	            			if(t.tagName == 'IMG'){
	            				t = t.parentNode;
	            			}
	            			var rowIndex = this.view.findRowIndex(t);
	            			if (rowIndex !== false) {
	            				var sm = this.grid.selModel;
	            				if (!sm.isSelected(rowIndex) || e.hasModifier()) {
            					    sm.handleMouseDown(this.grid, rowIndex, e);
            					}
	            				
	            				return {grid: this.grid, ddel: this.ddel, rowIndex: rowIndex, selections:sm.getSelections()};
	            			}
	            			return false;
	            		}
            		}); /// end griddragzone//
            	}
            }
        });
    	
    	this.bookFinderPanel = new Ext.Panel({
    		region : 'south',
    		title: '책 보관소',
            height : 110,
            collapsible: true,
            split: true,
            border: false,
            layout:'fit',
            items:[new M31.app.SpringFinderPanel({
        		rootNodeName: 'springbook'
        	})]
    	});
    	
    	// 봄북 패널
    	this.bookPanel = new Ext.Container({
        	id: 'springbook-bookPanel',
        	layout: 'border',
	        border: false,
	        items:[
                this.bookListPanel,
                this.bookFinderPanel
            ]
        });

    	// 윈도우에 패널을 추가하고 창을 다시 그린다.
    	this.win.add(this.bookPanel);
    	this.win.doLayout();
    	
    	this.bookStore.load();
    },
    gateway: function(bookInfoString){
    	console.log(bookInfoString);
    }    
});

// 봄미투데이
M31Desktop.SpringMe2Day = Ext.extend(M31.app.Module, {
	springme2dayappkey: 'eb4d74485df2773948ccd8eefdd53ef3',
	loadMask : null, 
	state: null,
	userInfo: null,
	userConfig: null,
    init: function() {
        console.log("init");
//        m31.util.requiredJS("pirobox");
    },
    createCallback: function(win){
    	console.log("createCallback");

    	if(!this.win){ this.win = win; }
    	this.win.app = this;
    	
    	this.loadMask = new Ext.LoadMask(this.win.body, {msg:"봄미투데이를 초기화 중 입니다."});
    	this.loadMask.show();
    	
    	this.runner = new Ext.util.TaskRunner();
    	var redyTask = {
    	    run: function(app){
	    		if(app.state != null) return;
	        	console.log('state : ' + app.state);
	        	
	        	// 봄미투데이가 준비가 되었는가?
	        	if(app.win == null || app.loginModule.loginState == null) return;
	        	if(!app.win.isVisible()) return;
	        	
	        	app.state = 'ready';
	        	console.log('state : ' + app.state);
	        	
	        	app.loadMask.hide();
	        	
	        	if(!app.loginModule.loginState){
	        		// 로그인 패널을 생성하고 미투데이 인증페이지로 이동합니다.
	        		app.loginModule.createLoginPanel(app);
	        		Ext.getCmp('springme2day-login-iframepanel').setSrc(app.loginModule.authUrl);
	        		
	        		console.log('미투데이 인증 페이지로 이동합니다. (' + app.loginModule.authUrl + ')');
	        	}
	        	else{
	        		// 미투데이 패널을 생성합니다.
	        		app.me2DayModule.createView(app);
	        	}
	        	
	        	app.runner.stopAll();
    		},
    	    interval: 1000,
    	    args: [this]
    	};
    	this.runner.start(redyTask);
    },
    beforeCreate: function(){
    	console.log("beforeCreate");
    	
    	this.loginModule.initializing(this);
    },
    removeWin: function(){
    	console.log("removeWin");
    	
    	this.me2DayModule.destroy();
    	this.loginModule.destroy();
    	this.state = null;
    	this.loadMask = null;
    	
    	this.win.app = null;
    	this.win = null;
        this.runner.stopAll();
    },
    createWindow: function(){
    	return {
    		id: 'springme2day-win',
    		width:500,
	        height:450,
	        minWidth: 400,
            minHeight: 200,
	        layout:'fit',
	        constrainHeader:true,
	        closeAction: 'close',
	        border: false
    	};
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
				success: function(response, opts){
			    	try { 
			    		console.log('loginCheckAjaxSuccess : ' + response.responseText);
			    		
			    		var result = Ext.decode(response.responseText);
			    		if(result.state){
			    			// 사용자 정보
			    			this.userInfo = {
			    				id: result.userInfo.user_id
			    			};
			    			console.log(result.userInfo);
			    			// 사용자 환경설정
			    			this.userConfig = {
			    				myPostView: result.userInfo.myPostView,
			    				friendPostView: result.userInfo.friendPostView,
			    				commentView: result.userInfo.commentView
			    			};
			    			console.log(this.userConfig);
			    			
			    	        this.me2DayModule.createIconStore().loadData(result.person.postIcons, false);
			    		}
			    		else{
			    			// 인증 요청 url
			    			this.loginModule.authUrl = result.authenticationUrl.url + "&akey=" + this.springme2dayappkey; 
			    			this.loginModule.authToken = result.authenticationUrl.token;    			
			    		}
			    		
			    		// 로그인 상태
			    		this.loginModule.loginState = result.state;
			    	}
					catch(e){
						console.log('초기화 중 오류가 발생했습니다. (' + e + ')');
						
						this.loadMask.hide();
						this.loadMask = new Ext.LoadMask(this.win.body, {msg:"초기화 중 오류가 발생했습니다. 봄미투데이를 다시 시작해주세요."});
				    	this.loadMask.show();
					}
					
					console.log('loginModule.loginState : ' + this.loginModule.loginState);
		    		console.log('loginModule.authUrl : ' + this.loginModule.authUrl);
		    		console.log('loginModule.authToken : ' + this.loginModule.authToken);
		    	}.createDelegate(app),
				failure: function(response, opts){
		    		console.log('loginCheckAjaxSuccess : ' + response.responseText);
		    		this.loginModule.loginState = false;
		    		this.loadMask.hide();
					this.loadMask = new Ext.LoadMask(this.win.body, {msg:"초기화 중 오류가 발생했습니다. 봄미투데이를 다시 시작해주세요."});
			    	this.loadMask.show();
		    	}.createDelegate(app)
			});
    	},
    	destroy: function(){
    		this.loginState = null;
    		this.authUrl = null;
    		this.authToken = null;
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
    	        }]
            });
    		
    		app.win.maximize();
    		app.win.add(this.loginPanel);
    		app.win.doLayout();
    		
    		return this.loginPanel;
    	},
    	me2DayAuthenticationComplete: function(auth){
    		var app = getApp('springme2day');
    		app.win.toggleMaximize();
    		try {
    			if(auth.result){
        			m31.util.notification({title:'봄미투데이',text:'봄미투데이에 인증을 수락하셨습니다.'});
        			
        			app.userInfo = {
            			id: auth.user_id
            		};
        			// 사용자 환경설정
        			app.userConfig = {
	    				myPostView: auth.myPostView,
	    				friendPostView: auth.friendPostView,
	    				commentView: auth.commentView
	    			};
	    			console.log(app.userConfig);
	    			
	    			try{
	    				app.me2DayModule.createIconStore().loadData(Ext.decode(auth.postIcons), false);
	    			}
	    			catch(e){
	    				var temp = [{'iconIndex':0,'iconType':'','description':'','url':''}];
	    				app.me2DayModule.createIconStore().loadData(temp, false);
	    			}
        			
	    			// 마스크를 지워라!
	    			app.loadMask.hide();
	    			// 로그인 패널 파괴
	    			$('#frameSpringMe2DayLogin').remove();
	    			app.loginModule.loginPanel.destroy();
	    			
    	    		// 미투데이 패널을 생성
    	    		app.me2DayModule.createView(app);
        		}
        		else{
        			m31.util.notification({title:'봄미투데이',text:'봄미투데이에 인증을 거절하셨습니다.'});
        		}
	    	}
			catch(e){
				console.log('미투데이 인증결과를 반영하는 중 오류가 발생했습니다. {' + e + '}');
				
				app.loadMask.hide();
				app.loadMask = new Ext.LoadMask(this.win.body, {msg:"로그인 중 오류가 발생했습니다. 봄미투데이를 다시 시작해주세요."});
				app.loadMask.show();
			}  		
    	}   	
    },
    me2DayModule: {
    	apiUrl: '/app/me2day/',
        destroy: function(){
    		if(this.iconStore){ this.iconStore.destroy(); } 
    		if(this.postFormPanel){ this.postFormPanel.destroy(); }
    		if(this.postGrid){ this.postGrid.destroy(); }
    		if(this.postStore){ this.postStore.destroy(); }
    		if(this.postPanel){ this.postPanel.destroy(); }
    	},
        /** 글목록 가져오기 url 생성 : config 는 object 형식으로 PostSearchParam.java 의 값 참조 */
    	get_posts: function(config){
    		var url = this.apiUrl + 'postList';
    		if(config.post_id){
    			url += '?post_id=' + config.post_id;
    		}
    		else{
    			url += '?id=' + config.userId;
    			url += '&myPostView=' + config.myPostView;
    			url += '&friendPostView=' + config.friendPostView;
    			url += '&commentView=' + config.commentView;
    			
    			if(config.form){ url += '&form=' + config.form; }
    			if(config.to){ url += '&to=' + config.to; }
    		}
    		
    		console.log('me2DayModule.get_posts() : ' + url);
    		
    		return url;
    	},
        createIconStore: function(){
    		this.iconStore = new Ext.data.JsonStore({
            	autoLoad: false,
            	autoDestroy: true,
            	remoteSort: false,
                fields: [
                    'iconIndex',
                    'iconType',
                    'description',
                    'url'
                ]
            });
    		return this.iconStore;
    	},    	
    	/** 미투데이 패널 생성 : 글쓰기 and 글목록 */
    	createView: function(app){
    		console.log('me2DayModule.createView()');
    		
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
                if(parseInt(jQuery('#springme2day-form-body-length').text()) !== (150-Ext.fly('springme2day-form-body').getValue().replace(/"(.*?)":http:\/\/(.*?) /g, "$1").length)){
                     Ext.get('springme2day-form-body-length')
                        .update(150-Ext.fly('springme2day-form-body').getValue().replace(/"(.*?)":http:\/\/(.*?) /g, "$1").length);
                }
                if(tcnt < 0){
                    clearIntrvalFF();
                }
            };
    		
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
                            keypress: function(sender,event){
                            	if(event.keyCode == Ext.EventObject.ENTER){
                            		this.postFormPanel.getForm().submit({
        	                			url:'/app/me2day/postSend', 
        	                			waitMsg:'미투데이에 글을 전송 중 입니다.'
        	                		});	
                            	}
                            }.createDelegate(this),
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
	            		boxLabel: '댓글 닫기'
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
	            			render: function(sender){ sender.setValue(1); }
	            		}
	            	},{
	            		xtype: 'button',
	            		id: 'springme2day-post-send-btn',
	            		anchor:'100%',
	            		text: '전송',
	            		style: { marginTop: '2px' },
	            		handler: function(sender, event){
	            			this.postFormPanel.getForm().submit({
	                			url:'/app/me2day/postSend', 
	                			waitMsg:'미투데이에 글을 전송 중 입니다.'
	                		});
	            		}.createDelegate(this)
		            }]
	            })],
	            listeners: {
	        		actioncomplete: function(form, action){
	        			console.log('actioncomplete');
	        			var result = Ext.decode(action.response.responseText);
	        			var msg = '전송 중 네트워크 장애가 발생했습니다.';
	        			if(result.msg == 'springme2day_not_login'){
	        				msg = '미투데이 인증에 실패했습니다.';
	        			}
	        			else if(result.msg == 'springme2day_postsend_success'){
	        				msg = '미투데이에 글을 성공적으로 전송했습니다.';
	        				
	        				form.reset();
		        			form.findField('springme2day-form-icon').setValue(1);
		        			
		        			this.postStore.reload();
	        			}
	        			else if(result.msg == 'springme2day_postsend_body_blank'){
	        				msg = '본문이 비어있습니다.';
	        			}
	        			else if(result.msg == 'springme2day_postsend_body_maxlength_over'){
	        				msg = '본문이 150자를 넘습니다.';
	        			}
	        			m31.util.notification({title:'봄미투데이',text:msg});
	        		}.createDelegate(this),
	        		actionfailed: function(form, action){ console.log('actionfailed'); },
	        		beforeaction: function(form, action){ 
	        			console.log('beforeaction');
	        			if(!form.isValid()) return false;
	        			var currentValueLength = form.findField('springme2day-form-body').getValue().length;
	        			if(currentValueLength <= 0){
	        				m31.util.notification({title:'봄미투데이',text:'본문이 비어있습니다.'});
	        				return false;
	        			}
	        			else if(currentValueLength > 150){
	        				m31.util.notification({title:'봄미투데이',text:'본문이 150자를 넘습니다.'});
	        				return false;
	        			}
	        		}.createDelegate(this)
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
	                'commentView',
	                {name:'location', mapping: 'location.name'},
	                {name:'writerId', mapping: 'author.id'},
	                {name:'writerNick', mapping: 'author.nickname'},
	                {name:'face', mapping: 'author.face'}
	            ],
	            listeners: {
	        		load: function(){
		        		var els = this.me2DayModule.postGrid.getEl().select('div[class="x-grid3-row-expander]', true);
		        		// 댓글이 없는 글은 펼침, 접기 아이콘 숨기기
		        		Ext.each(els.elements, function(el){
		        			if(el.getStyle('background-position') == "-21px 2px"){
		        				el.setStyle('display', 'none');
		        			}
		        		});
		        		
		        		// 앵커 태그에 클릭시 새창 띄우기!
		        		els = this.me2DayModule.postGrid.getEl().select('a', true);
		        		Ext.each(els.elements, function(el){
		        			if(el.dom.href){
		        				var file = el.dom.href.substring(el.dom.href.lastIndexOf('.'));
		        				if(file === '.jpg' || file === 'gif'){
		        					$(el.dom).addClass("pirobox");
		        					$(el.dom).attr('title',$(el.dom).text());
		        				}
		        				else{
		        					el.addListener('click', function(event, sender){
		        						window.open(sender.href);
		        						event.preventDefault();
				        			});
		        				}
		        			}
		        		}, this);
		        		
		        		$().piroBox({
		        			target: 'springme2day-win',
		        			my_speed: 600, //animation speed
		        			bg_alpha: 0.5, //background opacity
		        			radius: 4, //caption rounded corner
		        			scrollImage : false // true == image follows the page, false == image remains in the same open position
		        		});
		        		
		        		// 댓글 쓰기에 이벤트 걸기
		        		els = this.me2DayModule.postGrid.getEl().select('td[class="springme2day-comment-write-text]', true);
		        		Ext.each(els.elements, function(el){
		        			el.on('click', function(event, sender){
		        				this.me2DayModule.showCommentDlg(this.win, sender.id);
		        			}, this);
		        		}, this);
		        		
		        		// 댓글 삭제에 이벤트 걸기
		        		els = this.me2DayModule.postGrid.getEl().select('img[class="springme2day-comment-delete-btn]', true);
		        		Ext.each(els.elements, function(el){
		        			el.on('click', function(event, sender){
		        				Ext.Ajax.request({
		        					url: '/app/me2day/commentDelete',
		        					params: {commentId:sender.id},
		        					success: function(response, opts){
		        						console.log('commentDeleteSuccess : ' + response.responseText);
		        						console.log(this);
		        			    		try{
		        			    			var result = Ext.decode(response.responseText);
		        			    			if(result.msg == 'springme2day_commentdelete_success'){
		        			    				result.msg = '댓글을 삭제했습니다.';
		        			    			}
		        			    			this.me2DayModule.postStore.reload();
		        			    			m31.util.notification({title:'봄미투데이',text:result.msg});	
		        			    		}
		        			    		catch(e){}
		        					}.createDelegate(this),
		        					failure: function(response, opts){
		        						console.log('commentDeleteFailure: ' + response.responseText);
		        					}.createDelegate(this)
		        				});
		        			}, this);
		        		}, this);
	        		}.createDelegate(app)
	        	}
	        });	
	        
	        // 댓글 접기 and 펼치기를 처리할 extjs grid plugin 
	        var expander = new Ext.ux.grid.RowExpander({
	        	getRowClass: function(record, rowIndex, p, ds){
	        		var body = '';
	            	if(record.data.commentsCount > 0){
	            		if(record.data.commentView){
	            			body += '<table width="100%" cellspacing="1" cellpadding="0" border="0">';
	                		Ext.each(record.data.comments, function(item, index){
	                			body += '<tr>';
	                			body += '<td width="8"></td>';
	    	                	body += '<td width="50" align="right" class="springme2day-comment-nickname">' + item.author.nickname + '&nbsp;:&nbsp;&nbsp;</td>';
	    	                	body += '<td>' + item.body + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="springme2day-comment-pubtime">' + item.pubDateText + '</span>';
	    	                	if(item.remove){
	    	                		body += '<img id="' + item.commentId + '" src="/images/apps/springme2day/delete_button_small.gif" class="springme2day-comment-delete-btn" />';
		                		}
	    	                	body += '</td>';
	    	                	body += '</tr>';
	                		});
	                		body += '</table>';
	            		}
	            		else{
	            			body += '&nbsp;&nbsp;&nbsp;&nbsp;현재 댓글 보기 설정이 미적용되어 있습니다. (댓글 수 : ' + record.data.commentsCount + ')';
	            		}
	            	}
	            	p.body = body;
		            return body == '' ? 'x-grid3-row-expanded' : 'x-grid3-row-collapsed';
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
				tbar: [{
						xtype: 'tbtext',
						text: '',
						width: 5
					},{
						xtype: 'datefield',
						id: 'springme2day-postlist-form-to',
						editable: false,
						format: 'Y-m-d',
						value: new Date(),
						width: 85,
						listeners: {
							select: function(sender, date){
								this.userConfig.form = date.format('Y-m-d');
								this.userConfig.to = date.add(Date.DAY, -7).format('Y-m-d');
								this.me2DayModule.postStore.proxy.setUrl(
									this.me2DayModule.get_posts(
										Ext.apply({userId:this.userInfo.id}, this.userConfig)));
						        this.me2DayModule.postStore.load();
							}.createDelegate(app)
						}
					},{
						xtype: 'tbtext',
						text: '로 부터 이전 7일간의 글을 봅니다.'
					},'->',{
						xtype: 'button',
						text: '새로고침',
						handler: function(sender, event){
								this.me2DayModule.postStore.proxy.setUrl(
									this.me2DayModule.get_posts(
										Ext.apply({userId:this.userInfo.id}, this.userConfig)));
					        	this.me2DayModule.postStore.load();
							}.createDelegate(app)
					},'-',{
		            	xtype: 'button',
		            	text: '설정',
		            	handler: this.configPopup.createDelegate(app)
		            },'-',{
		            	xtype: 'button',
		            	text: '친구관리',
		            	handler: this.friendManagementPopup.createDelegate(app),
		            	hidden: true
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
            			// console.log('springme2day-postbody-panel resize');
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
        	
        	return this.postPanel;
    	},
        /** 친구관리 버튼 */
        friendManagementPopup: function(sender, event){
    		this.dialogue = new Ext.Window({
    			id: 'springme2day-friend-dlg',
    			title:'친구관리',
                // 모달로!
                modal: true,
                // 창이 봄미투데이 밖으로 못빠져 나가게 막아라
                constrain:true,
                // 크기 조절은 없다!
                resizable:false,
                // 최소화, 최대화, 닫기 버튼은 없다!
                minimizable : false,
                maximizable : false,
                closable:false,
                width: this.win.width - 40,
                height: this.win.height - 100,
                layout: 'fit',
                items:[{
                	xtype: 'form',
                	id: 'springme2day-friend-dlg-form',
                	header: false,
                	layout: 'fit',
                	waitMsgTarget: true,
                    buttonAlign: 'center',
                    buttons:[{
                    	xtype:'button',
                    	text: '닫기',
                    	handler: function(sender, event){
                    		this.dialogue.destroy();
                    	}.createDelegate(this)
                    }]
                }]
            });
        	// 친구관리 폼 전송 후 발생되는 이벤트 처리 정의
        	this.dialogue.get('springme2day-comment-dlg-form').getForm().on(
        		// 성공적으로 폼 전송이 끝났을때...
        		'actioncomplete',
    			function(form, action){
    				this.destroy();
    			},
    			this.dialogue);
        	this.dialogue.get('springme2day-comment-dlg-form').getForm().on(
        		// 폼 전송 중 오류가 발생했을때...
    			'actionfailed',
    			function(form, action){},
    			this.dialogue);
        	this.dialogue.get('springme2day-comment-dlg-form').getForm().on(
        		// 폼 전송 전...
    			'beforeaction',
    			function(form, action){ if(!form.isValid()) return false; },
    			this.dialogue);
        	this.dialogue.render(win.body);
        	this.dialogue.show();    		
        },    	
        /** 설정 팝업 */
        configPopup: function(sender, event){
        	this.dialogue = new Ext.Window({
    			id: 'springme2day-filterconfig-dlg',
    			title:'필터설정',
                // 모달로!
                modal: true,
                // 창이 봄미투데이 밖으로 못빠져 나가게 막아라
                constrain:true,
                // 크기 조절은 없다!
                resizable:false,
                // 최소화, 최대화, 닫기 버튼은 없다!
                minimizable : false,
                maximizable : false,
                closable:false,
                width: 300,
                height: 150,
                layout: 'fit',
                items:[{
                	xtype: 'form',
                	id: 'springme2day-filterconfig-dlg-form',
                	header: false,
                	layout: 'fit',
                	waitMsgTarget: true,
                    buttonAlign: 'center',
                    buttons:[{
                    	xtype:'button',
                    	text: '적용',
                    	handler: function(sender, event){
                    		this.dialogue.get('springme2day-filterconfig-dlg-form').getForm().submit({
                    			url:'/app/me2day/configSave', 
                    			waitMsg:'설정을 적용 중 입니다.'
                    		});
                    	}.createDelegate(this)
                    },{
                    	xtype:'button',
                    	text: '취소',
                    	handler: function(sender, event){
                    		this.dialogue.destroy();
                    	}.createDelegate(this)
                    }],
                    bodyStyle: 'padding: 3px;',
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
	                             {boxLabel: '나는', name: 'myPostView', checked: this.userConfig.myPostView == 'Y' ? true : false},
	                             {boxLabel: '모는 친구', name: 'friendPostView', checked: this.userConfig.friendPostView == 'Y' ? true : false},
	                             {boxLabel: '댓글', name: 'commentView', checked: this.userConfig.commentView == 'Y' ? true : false}
	                         ]
	                     }]                         
	                }]
                }]
            });
        	var form = this.dialogue.get('springme2day-filterconfig-dlg-form').getForm();
        	// 설정 폼 전송 후 발생되는 이벤트 처리 정의
        	// 성공적으로 폼 전송이 끝났을때...
        	form.on('actioncomplete',
        		function(form, action){
	        		var result = Ext.decode(action.response.responseText);
					var msg = '';
					if(result.msg == 'springme2day_not_login'){
						m31.util.notification({title:'봄미투데이',text:'로그인이 되어있지 않습니다.'});
	    			}
					else{
						if(result.msg == 'springme2day_configsave_success'){
	        				msg = '설정을 적용했습니다.';
	        			}
	        			else{
	        				msg = '네트워크 장애가 발생했습니다.';
	        			}
	    				m31.util.notification({title:'봄미투데이',text:msg});
					}
					
					console.log(result.userInfo);
				
					this.userConfig.myPostView = result.userInfo.myPostView;
	        		this.userConfig.friendPostView = result.userInfo.friendPostView;
	        		this.userConfig.commentView = result.userInfo.commentView;
	        		
	        		this.me2DayModule.postStore.proxy.setUrl(
	        			this.me2DayModule.get_posts(
	            			Ext.apply({userId:this.userInfo.id}, this.userConfig)));
	            	this.me2DayModule.postStore.load();
    				this.dialogue.destroy();
    			}, this);
    		// 폼 전송 중 오류가 발생했을때...        	
        	form.on('actionfailed', function(form, action){}, this.dialogue);
        	// 폼 전송 전...
        	form.on('beforeaction',
    			function(form, action){ if(!form.isValid()) return false; }, this.dialogue);
        	this.dialogue.render(this.win.body);
        	this.dialogue.show();    		
        },
        showCommentDlg: function(win, post_id){
        	this.dialogue = new Ext.Window({
        		id: 'springme2day-comment-dlg',
                title:'댓글 쓰기',
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
	            		id: 'springme2day-comment-dlg-form-body',
	            		name: 'body',
	            		emptyText: '댓글을 150자로 내로 남겨주세요!',
	            		allowBlank: false,
	            		blankText: '최소 한자 이상의 글을 남기셔야합니다.',
	            		maxLength: 150,
	            		maxLengthText: '댓글이 너무 깁니다!',
	            		enableKeyEvents: true,
	            		listeners: {
                            keypress: function(sender,event){
                            	if(event.keyCode == Ext.EventObject.ENTER){
                            		this.dialogue.get('springme2day-comment-dlg-form').getForm().submit({
                            			url:'/app/me2day/commentSend', 
                            			waitMsg:'댓글을 전송 중 입니다.'
                            		});
                            	}
                            }.createDelegate(this)
	                    }
	            	},{
	            		xtype: 'hidden',
	            		name: 'post_id',
	            		value: post_id
	            	}],
                    buttonAlign: 'center',
                    buttons:[{
                    	xtype:'button',
                    	text: '전송',
                    	handler: function(sender, event){
                    		this.dialogue.get('springme2day-comment-dlg-form').getForm().submit({
                    			url:'/app/me2day/commentSend', 
                    			waitMsg:'댓글을 전송 중 입니다.'
                    		});
                    	}.createDelegate(this)
                    },{
                    	xtype:'button',
                    	text: '취소',
                    	handler: function(sender, event){
                    		this.dialogue.destroy();
                    	}.createDelegate(this)
                    }]
                }]
            });
        	// 댓글 폼 전송 후 발생되는 이벤트 처리 정의
        	this.dialogue.get('springme2day-comment-dlg-form').getForm().on(
        		// 성공적으로 폼 전송이 끝났을때...
        		'actioncomplete',
    			function(form, action){
    				var result = Ext.decode(action.response.responseText);
    				var msg = '';
    				if(result.msg == 'springme2day_not_login'){
    					m31.util.notification({title:'봄미투데이',text:'로그인이 되어있지 않습니다.'});
        			}
    				else{
    					if(result.msg == 'springme2day_commentsend_success'){
            				msg = '댓글을 전송했습니다.';
            				this.postStore.reload();
            			}
            			else if(result.msg == 'springme2day_commentsend_body_blank'){
            				msg = '댓글을 입력해주세요.';
            			}
            			else if(result.msg == 'springme2day_commentsend_body_maxlength_over'){
            				msg = '댓글이 150자를 넘습니다.';
            			}
            			else{
            				msg = '네트워크 장애가 발생했습니다.';
            			}
        				m31.util.notification({title:'봄미투데이',text:'댓글을 전송했습니다.'});
    				}
    				this.dialogue.destroy();
    			},
    			this);
        	this.dialogue.get('springme2day-comment-dlg-form').getForm().on(
        		// 폼 전송 중 오류가 발생했을때...
    			'actionfailed',
    			function(form, action){},
    			this.dialogue);
        	this.dialogue.get('springme2day-comment-dlg-form').getForm().on(
        		// 폼 전송 전...
    			'beforeaction',
    			function(form, action){ if(!form.isValid()) return false; },
    			this.dialogue);
        	
        	this.dialogue.render(win.body);
        	this.dialogue.show();
        },
        gateway: function(data){
        	if(Ext.getCmp('springme2day-form-body')){
        		M31.WindowsManager.getInstance().getWindow("springme2day").show();
            	M31.WindowsManager.getInstance().getWindow("springme2day").toFront();
            	if(data.appId === 'springsee' && data.url.trim()){
        			var value = Ext.getCmp('springme2day-form-body').getValue();
        			Ext.getCmp('springme2day-form-body').setValue(value + ' "":' + data.url.trim() + ' ');
        		}
        	}
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