Ext.ns('Ext.ux.grid');

Ext.ux.grid.ExplorerView = Ext.extend(Ext.grid.GridView, {
    /**
     * @cfg {Ext.Template} Template to use when rendering rows, null if default grid row rendering
     */
    rowTemplate: null,

    /**
     * Changes the current row-template and refreshes the view.
     * @param {Ext.Template} template Use this template, set to null if you want grid default row rendering.
     */
    changeTemplate: function(template) {
        this.rowTemplate = template;
        this.initTemplates();
        this.refresh();
    },

    initTemplates: function() {
        Ext.ux.grid.ExplorerView.superclass.initTemplates.call(this);

        // Store original row template
        if (!this.templates.orgrow)
            this.templates.orgrow = this.templates.row;

        if (this.rowTemplate != null)
            this.templates.row = this.rowTemplate.compile();
        else
            this.templates.row = this.templates.orgrow;
    },

    doRender: function(cs, rs, ds, startRow, colCount, stripe){
        if (this.rowTemplate == null) {
            // Let GridView class handle "normal" rows
            return Ext.ux.grid.ExplorerView.superclass.doRender.apply(
                this, arguments);
        } else {
	        var ts = this.templates, rt = ts.row;
	        var buf = [];
	        for(var j = 0, len = rs.length; j < len; j++){
                buf[buf.length] = rt.apply(rs[j].data);
	        }
	        return buf.join("");
        }
    },

    updateAllColumnWidths : function(){
        var tw = this.getTotalWidth();
        var clen = this.cm.getColumnCount();
        var ws = [];
        for(var i = 0; i < clen; i++){
            ws[i] = this.getColumnWidth(i);
        }

        this.innerHd.firstChild.firstChild.style.width = tw;

        for(var i = 0; i < clen; i++){
            var hd = this.getHeaderCell(i);
            hd.style.width = ws[i];
        }

        // If we have specified our own template there wont be columns to resize here.
        if (this.rowTemplate == null) {
	        var ns = this.getRows();
	        for(var i = 0, len = ns.length; i < len; i++){
	            ns[i].style.width = tw;
	            ns[i].firstChild.style.width = tw;
	            var row = ns[i].firstChild.rows[0];
	            for(var j = 0; j < clen; j++){
	                row.childNodes[j].style.width = ws[j];
	            }
	        }
        }

        this.onAllColumnWidthsUpdated(ws, tw);
    },

    updateColumnWidth : function(col, width){
        var w = this.getColumnWidth(col);
        var tw = this.getTotalWidth();

        this.innerHd.firstChild.firstChild.style.width = tw;
        var hd = this.getHeaderCell(col);
        hd.style.width = w;

        if (this.rowTemplate == null) {
	        var ns = this.getRows();
	        for(var i = 0, len = ns.length; i < len; i++){
	            ns[i].style.width = tw;
	            ns[i].firstChild.style.width = tw;
	            ns[i].firstChild.rows[0].childNodes[col].style.width = w;
	        }
        }

        this.onColumnWidthUpdated(col, w, tw);
    }
});

// Reg for lazy loading (xtype)
Ext.reg('explorerview', Ext.ux.grid.ExplorerView);

// Make sure ExplorerView is used in GridPanel
Ext.override(Ext.grid.GridPanel, {
    getView : function(){
        if(!this.view){
            this.view = new Ext.ux.grid.ExplorerView(this.viewConfig);
        }

        return this.view;
    }
});