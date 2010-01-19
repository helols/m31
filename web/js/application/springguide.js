// 봄가이드
M31Desktop.SpringGuide = Ext.extend(M31.app.Module, {
	state: null,
    init : function() {
    },
    beforeCreate: function(){
    	Ext.Ajax.request({
			url: '/app/springguide',
			success: function(response, opts){
		    	this.contents = response.responseText;
		    	this.state = 'success';
	    	}.createDelegate(this),
			failure: function(response, opts){
	    		this.contents = '오류!!';
	    		this.state = 'failure';
	    	}.createDelegate(this)
		});
    },    
    createCallback: function(win){
    	if(!this.win){ this.win = win; }
    	this.win.app = this;
    	
    	this.loadMask = new Ext.LoadMask(this.win.body, {msg:"봄가이드를 구동 중 입니다."});
    	this.loadMask.show();
    	
    	this.runner = new Ext.util.TaskRunner();
    	var redyTask = {
    	    run: function(app){
	    		if(app.state == null) return;
	        	console.log('state : ' + app.state);
	        	
	        	// 봄가이드가 준비가 되었는가?
	        	if(app.win == null) return;
	        	if(!app.win.isVisible()) return;
	        	
	        	app.state = 'ready';
	        	console.log('state : ' + app.state);
	        	
	        	app.win.update(app.contents);
	        	
	        	app.loadMask.hide();
	        	
	        	app.runner.stopAll();
    		},
    	    interval: 1000,
    	    args: [this]
    	};
    	this.runner.start(redyTask);
    },    
    removeWin: function(){
    	this.state = null;
    	this.loadMask = null;
    	this.win.app = null;
    	this.win = null;
        this.runner.stopAll();
    },    
    createWindow : function() {
        return {
        	width:480,
	        height:500,
	        minWidth: 480,
            minHeight: 500,
	        layout:'fit',
	        autoScroll: true,
	        constrainHeader: true,
	        closeAction: 'close',
	        border: false
        };
    }
});