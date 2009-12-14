/**
 * @author outsider
 */

// 테스트용 오버라이딩
M31Desktop.getModules = function(){
		return [
			new M31Desktop.GridWindow(),
            new M31Desktop.TabWindow(),
            new M31Desktop.AccordionWindow(),
            new M31Desktop.BogusMenuModule(),
            new M31Desktop.BogusModule(),
			new M31Desktop.SpringSee()
		];
	}

// Spring See
M31Desktop.SpringSee = Ext.extend(M31.app.Module, {
    init : function(){
        this.launcher = {
            text: 'Spring See',
            iconCls:'springsee',
            handler : this.createWindow,
            scope: this,
            windowId:windowIndex
        }
    },

    createWindow : function(src){
        var winManager = this.desktop.getWinManager();
        var win = winManager.getWindow('springsee');
        	
        if(!win){
            win = winManager.createWindow({
                id: 'springsee',
                title:src.text,
                width:640,
                height:480,
                autoScroll: true,
                tbar:[{
                	text: 'Filter:'
                },{
                	xtype: 'textfield',
                	id: 'filter',
                	selectOnFocus: true,
                	width: 100,
                	listeners: {
                		'render': {fn:function(){
					    	Ext.getCmp('filter').getEl().on('keyup', function(){
					    		this.filter();
					    	}, this, {buffer:500});
                		}, scope:this}
                	}
                }, ' ', '-', {
                	text: 'Sort By:'
                }, {
                	id: 'sortSelect',
                	xtype: 'combo',
			        typeAhead: true,
			        triggerAction: 'all',
			        width: 100,
			        editable: false,
			        mode: 'local',
			        displayField: 'desc',
			        valueField: 'name',
			        lazyInit: false,
			        value: 'name',
			        store: new Ext.data.ArrayStore({
				        fields: ['name', 'desc'],
				        data : [['name', 'Name'],['size', 'File Size'],['lastmod', 'Last Modified']]
				    }),
				    listeners: {
						'select': {fn:this.sortImages, scope:this}
				    }
			    }],
                items: [{
	            	id: 'img-chooser-view',
					region: 'center',
					autoScroll: true,
					items: this.view
            	},{
    				id: 'img-detail-panel',
    				region: 'east',
    				split: true,
    				width: 150,
    				minWidth: 150,
    				maxWidth: 250
    			}],
    			store: new Ext.data.JsonStore({
    			    url: '/sandbox/images',
    			    root: 'images',
    			    fields: [
    			        'name', 'url',
    			        {name:'size', type: 'float'},
    			        {name:'lastmod', type:'date', dateFormat:'timestamp'}
    			    ]
    			}),
                iconCls: 'springsee',
                shim:false,
                animCollapse:false,
                constrainHeader:true
            });
        }
        
        win.show();
    }
});