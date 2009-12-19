/**
 * @author outsider
 */

// Spring See
/*
M31Desktop.SpringSee = Ext.extend(M31.app.Module, {
    id:'gallery-win',
    init : function(){
        this.launcher = {
            text: 'Grid Window',
            iconCls:'icon-grid',
            handler : this.createWindow,
            scope: this
        };
        
        this.store = new Ext.data.JsonStore({
		    url: '/sandbox/images', //this.config.url,
		    root: 'images',
		    fields: [
		        'name', 'url',
		        {name:'size', type: 'float'},
		        {name:'lastmod', type:'date', dateFormat:'timestamp'}
		    ]
		});
        this.store.load();
        
        this.tpl = new Ext.XTemplate(
    		'<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
    		    '<div class="thumb"><img src="{url}" title="{name}"></div>',
    		    '<span class="x-editable">{shortName}</span></div>',
            '</tpl>',
            '<div class="x-clear"></div>'
    	);
    },

    createWindow : function(){
        var winManager = this.desktop.getWinManager();
        var win = winManager.getWindow('grid-win');
        this.store.load();
        if(!win){
            win = winManager.createWindow({
                id: 'gallery-win',
                title:'SpringSee Window',
                width:740,
                height:480,
                iconCls: 'icon-grid',
                shim:false,
                animCollapse:false,
                constrainHeader:true,

                layout: 'fit',
                items: new Ext.DataView({
                    store: this.store,
                    tpl: this.tpl,
                    autoHeight:true,
                    multiSelect: true,
                    overClass:'x-view-over',
                    itemSelector:'div.thumb-wrap',
                    emptyText: 'No images to display',
                    prepareData: function(data){
                        data.shortName = Ext.util.Format.ellipsis(data.name, 15);
                        data.sizeString = Ext.util.Format.fileSize(data.size);
                        data.dateString = data.lastmod.format("m/d/Y g:i a");
                        return data;
                    },
                    
                    listeners: {
                    	selectionchange: {
                    		fn: function(dv,nodes){
                    			var l = nodes.length;
                    			var s = l != 1 ? 's' : '';
                    			panel.setTitle('Simple DataView ('+l+' item'+s+' selected)');
                    		}
                    	}
                    }
                })
            });
        }
        win.show();
    }
});
*/

M31Desktop.SpringSee = Ext.extend(M31.app.Module, {
	lookup : {},
	init : function(){
		console.log("init");
		
        console.log("before initTemplates");
        this.initTemplates();
        
        this.store = new Ext.data.JsonStore({
		    url: '/sandbox/images', //this.config.url,
		    root: 'images',
		    fields: [
		        'name', 'url',
		        {name:'size', type: 'float'},
		        {name:'lastmod', type:'date', dateFormat:'timestamp'}
		    ],
		    listeners: {
		    	'load': {fn:function(){ console.log("store loaded"); this.view.select(0); }, scope:this, single:true}
		    }
		});
        
        var formatSize = function(data){
        	console.log("formatSize");
	        if(data.size < 1024) {
	            return data.size + " bytes";
	        } else {
	            return (Math.round(((data.size*10) / 1024))/10) + " KB";
	        }
	    };
        
        var formatData = function(data){
        	console.log("formatData");
	    	data.shortName = data.name.ellipse(15);
	    	data.sizeString = formatSize(data);
	    	data.dateString = new Date(data.lastmod).format("m/d/Y g:i a");
	    	this.lookup[data.name] = data;
	    	return data;
	    };
        
	    this.view = new Ext.DataView({
			tpl: this.thumbTemplate,
			singleSelect: true,
			overClass:'x-view-over',
			itemSelector: 'div.thumb-wrap',
			emptyText : '<div style="padding:10px;">No images match the specified filter</div>',
			store: this.store,
			listeners: {
				'selectionchange': {fn:this.showDetails, scope:this, buffer:100},
				'dblclick'       : {fn:this.doCallback, scope:this},
				'loadexception'  : {fn:this.onLoadException, scope:this},
				'beforeselect'   : {fn:function(view){
			        return view.store.getRange().length > 0;
			    }}
			},
			prepareData: formatData.createDelegate(this)
		});
        
    },

    createWindow : function(src){
         var win = this.winManager.createWindow({
            	title: 'Spring See',
		    	layout: 'border',
		    	width: 500,
		    	height: 300,
				minWidth: 500,
				minHeight: 300,
				closeAction: 'hide',
				border: false,
				items:[{
					region: 'center',
					autoScroll: true,
					items: this.view,
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
				    }]
				},{
					id: 'img-detail-panel',
					region: 'east',
					split: true,
					width: 150,
					minWidth: 150,
					maxWidth: 250
				}],
				buttons: [{
					id: 'ok-btn',
					text: 'OK',
					handler: this.doCallback,
					scope: this
				},{
					text: 'Cancel',
					handler: function(){ this.win.hide(); },
					scope: this
				}],
				keys: {
					key: 27, // Esc key
					handler: function(){ this.win.hide(); },
					scope: this
				}
            });

        console.log("before store.load");
    	this.store.load();
    	console.log("after store.load");
    	this.reset(win);
    	this.callback = function(data){
        	console.log("callback called");
    		Ext.DomHelper.append('images', {
        		tag: 'img', src: data.url, style:'margin:10px;visibility:hidden;'
        	}, true).show(true).frame();
        	btn.focus();
        };;
        
		//this.callback = callback;
		//this.animateTarget = el;
        return win;
    },
    
    initTemplates : function(){
    	console.log("in initTemplates");
		this.thumbTemplate = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="thumb-wrap" id="{name}">',
				'<div class="thumb"><img src="{url}" title="{name}"></div>',
				'<span>{shortName}</span></div>',
			'</tpl>'
		);
		this.thumbTemplate.compile();

		this.detailsTemplate = new Ext.XTemplate(
			'<div class="details">',
				'<tpl for=".">',
					'<img src="{url}"><div class="details-info">',
					'<b>Image Name:</b>',
					'<span>{name}</span>',
					'<b>Size:</b>',
					'<span>{sizeString}</span>',
					'<b>Last Modified:</b>',
					'<span>{dateString}</span></div>',
				'</tpl>',
			'</div>'
		);
		this.detailsTemplate.compile();
	},
    
    showDetails : function(){
    	console.log("showDetails");
	    var selNode = this.view.getSelectedNodes();
	    var detailEl = Ext.getCmp('img-detail-panel').body;
		if(selNode && selNode.length > 0){
			selNode = selNode[0];
			Ext.getCmp('ok-btn').enable();
		    var data = this.lookup[selNode.id];
            detailEl.hide();
            this.detailsTemplate.overwrite(detailEl, data);
            detailEl.slideIn('l', {stopFx:true,duration:.2});
		}else{
		    Ext.getCmp('ok-btn').disable();
		    detailEl.update('');
		}
	},

	filter : function(){
		console.log("filter");
		var filter = Ext.getCmp('filter');
		this.view.store.filter('name', filter.getValue());
		this.view.select(0);
	},

	sortImages : function(){
		console.log("sortImages");
		var v = Ext.getCmp('sortSelect').getValue();
    	this.view.store.sort(v, v == 'name' ? 'asc' : 'desc');
    	this.view.select(0);
    },

	reset : function(arg){
    	console.log("reset");
		if(arg.rendered){
			Ext.getCmp('filter').reset();
			this.view.getEl().dom.scrollTop = 0;
		}
	    this.view.store.clearFilter();
		this.view.select(0);
	},

	doCallback : function(){
		console.log("doCallback");
        var selNode = this.view.getSelectedNodes()[0];
		var callback = this.callback;
		var lookup = this.lookup;
		win.hide(this.animateTarget, function(){
            if(selNode && callback){
				var data = lookup[selNode.id];
				callback(data);
			}
		});
    },

	onLoadException : function(v,o){
    	console.log("onLoadException");
	    this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>');
	}
});

String.prototype.ellipse = function(maxLength){
    if(this.length > maxLength){
        return this.substr(0, maxLength-3) + '...';
    }
    return this;
};
