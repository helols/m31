// 봄미투데이
M31Desktop.SpringMe2Day = Ext.extend(M31.app.Module, {
	springme2dayappkey: 'eb4d74485df2773948ccd8eefdd53ef3',
	loadMask : null, 
	state: null,
    init: function() {
        console.log("init");
    },
    createCallback: function(win){
    	console.log("createCallback");

    	if(!this.win){ this.win = win; }
    	
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
	        constrainHeader:true,
	        closeAction: 'close',
	        layout:'fit',
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
    		console.log('미투데이 인증 정보가 없습니다.');
    		
    		// 로그인 패널을 생성합니다.
    		var loginPanel = this.loginModule.createLoginPanel(this);
    		this.win.add(loginPanel);
    		this.win.doLayout();
    		
    		Ext.getCmp('springme2day-login-iframepanel').setSrc(this.loginModule.authUrl, true);
    	}
    },
    /* 인증 관련 변수 및 함수 집합! */
    loginModule : {
    	/* 로그인 상태 */
    	loginState: null,
    	/* 미투데이 인증 요청 URL */
    	authUrl: null,
    	/* 미투데이 인증처리용 토큰 */
    	authToken: null,
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
	    		
	    		if(!result.state){
	    			// 인증 요청 url
	    			authResult = Ext.decode(result.authUrl);
	    			
	    			this.loginModule.authUrl = authResult.url + "&akey=" + this.springme2dayappkey; 
	    			this.loginModule.authToken = authResult.token;
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
    	createLoginPanel: function(caller){
    		return new Ext.Panel({
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
	            	handler: this.me2DayLoginComplete.createDelegate(caller)
	            },{
	            	id: 'springme2day-login-yes-btn',
	            	xtype: 'button',
	            	text: '예',
	            	hidden: true,
	            	handler: this.me2DayLoginComplete.createDelegate(caller)
	            },'-',{
	            	id: 'springme2day-login-no-btn',
	            	xtype: 'button',
	            	text: '아니요',
	            	hidden: true,
	            	handler: this.me2DayLoginComplete.createDelegate(caller)
	            }]    	        
            }); 
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
    				// 로그인 패널이 있으면..
    	    		if(this.win.get('springme2day-login-panel')){
    	    			this.win.get('springme2day-login-panel').destroy();
    	    		}
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