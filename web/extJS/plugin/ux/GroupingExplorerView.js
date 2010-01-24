Ext.ns('Ext.ux.grid');

Ext.ux.grid.GroupingExplorerView = Ext.extend(Ext.ux.grid.ExplorerView, {
    hideGroupedColumn:false,
    showGroupName:true,
    startCollapsed:false,
    enableGrouping:true,
    enableGroupingMenu:true,
    enableNoGroups:true,
    emptyGroupText : '(None)',
    ignoreAdd: false,
    groupTextTpl : '{text}',

    // private
    gidSeed : 1000,

    // private
    initTemplates : function(){
        Ext.ux.grid.GroupingExplorerView.superclass.initTemplates.call(this);
        this.state = {};

        var sm = this.grid.getSelectionModel();
        sm.on(sm.selectRow ? 'beforerowselect' : 'beforecellselect',
                this.onBeforeRowSelect, this);

        if(!this.startGroup){
            this.startGroup = new Ext.XTemplate(
                '<div id="{groupId}" class="x-grid-group {cls}">',
                    '<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div>', this.groupTextTpl ,'</div></div>',
                    '<div id="{groupId}-bd" class="x-grid-group-body x-grid-group-body-floatcontainer">'
            );
        }
        this.startGroup.compile();
        this.endGroup = '</div></div>';
    },

    // private
    findGroup : function(el){
        return Ext.fly(el).up('.x-grid-group', this.mainBody.dom);
    },

    // private
    getGroups : function(){
        return this.hasRows() ? this.mainBody.dom.childNodes : [];
    },

    // private
    onAdd : function(){
        if(this.enableGrouping && !this.ignoreAdd){
            var ss = this.getScrollState();
            this.refresh();
            this.restoreScroll(ss);
        }else if(!this.enableGrouping){
            Ext.ux.grid.GroupingExplorerView.superclass.onAdd.apply(this, arguments);
        }
    },

    // private
    onRemove : function(ds, record, index, isUpdate){
        Ext.ux.grid.GroupingExplorerView.superclass.onRemove.apply(this, arguments);
        var g = document.getElementById(record._groupId);
        if(g && g.childNodes[1].childNodes.length < 1){
            Ext.removeNode(g);
        }
        this.applyEmptyText();
    },

    // private
    refreshRow : function(record){
        if(this.ds.getCount()==1){
            this.refresh();
        }else{
            this.isUpdating = true;
            Ext.ux.grid.GroupingExplorerView.superclass.refreshRow.apply(this, arguments);
            this.isUpdating = false;
        }
    },

    // private
    beforeMenuShow : function(){
        var field = this.getGroupField();
        var g = this.hmenu.items.get('groupBy');
        if(g){
            g.setDisabled(this.cm.config[this.hdCtxIndex].groupable === false);
        }
        var s = this.hmenu.items.get('showGroups');
        if(s){
           s.setDisabled(!field && this.cm.config[this.hdCtxIndex].groupable === false);
			s.setChecked(!!field, true);
        }
    },

    // private
    renderUI : function(){
        Ext.ux.grid.GroupingExplorerView.superclass.renderUI.call(this);
        this.mainBody.on('mousedown', this.interceptMouse, this);

        if(this.enableGroupingMenu && this.hmenu){
            this.hmenu.add('-',{
                id:'groupBy',
                text: this.groupByText,
                handler: this.onGroupByClick,
                scope: this,
                iconCls:'x-group-by-icon'
            });
            if(this.enableNoGroups){
                this.hmenu.add({
                    id:'showGroups',
                    text: this.showGroupsText,
                    checked: true,
                    checkHandler: this.onShowGroupsClick,
                    scope: this
                });
            }
            this.hmenu.on('beforeshow', this.beforeMenuShow, this);
        }
    },

    // private
    onGroupByClick : function(){
        this.grid.store.groupBy(this.cm.getDataIndex(this.hdCtxIndex));
        this.beforeMenuShow(); // Make sure the checkboxes get properly set when changing groups
    },

    // private
    onShowGroupsClick : function(mi, checked){
        if(checked){
            this.onGroupByClick();
        }else{
            this.grid.store.clearGrouping();
        }
    },

    toggleGroup : function(group, expanded){
        this.grid.stopEditing(true);
        group = Ext.getDom(group);
        var gel = Ext.fly(group);
        expanded = expanded !== undefined ?
                expanded : gel.hasClass('x-grid-group-collapsed');

        this.state[gel.dom.id] = expanded;
        gel[expanded ? 'removeClass' : 'addClass']('x-grid-group-collapsed');
    },

    toggleAllGroups : function(expanded){
        var groups = this.getGroups();
        for(var i = 0, len = groups.length; i < len; i++){
            this.toggleGroup(groups[i], expanded);
        }
    },

    expandAllGroups : function(){
        this.toggleAllGroups(true);
    },

    collapseAllGroups : function(){
        this.toggleAllGroups(false);
    },

    // private
    interceptMouse : function(e){
        var hd = e.getTarget('.x-grid-group-hd', this.mainBody);
        if(hd){
            e.stopEvent();
            this.toggleGroup(hd.parentNode);
        }
    },

    // private
    getGroup : function(v, r, groupRenderer, rowIndex, colIndex, ds){
        var g = groupRenderer ? groupRenderer(v, {}, r, rowIndex, colIndex, ds) : String(v);
        if(g === ''){
            g = this.cm.config[colIndex].emptyGroupText || this.emptyGroupText;
        }
        return g;
    },

    // private
    getGroupField : function(){
        return this.grid.store.getGroupState();
    },

    // private
    renderRows : function(){
        var groupField = this.getGroupField();
        var eg = !!groupField;
        // if they turned off grouping and the last grouped field is hidden
        if(this.hideGroupedColumn) {
            var colIndex = this.cm.findColumnIndex(groupField);
            if(!eg && this.lastGroupField !== undefined) {
                this.mainBody.update('');
                this.cm.setHidden(this.cm.findColumnIndex(this.lastGroupField), false);
                delete this.lastGroupField;
            }else if (eg && this.lastGroupField === undefined) {
                this.lastGroupField = groupField;
                this.cm.setHidden(colIndex, true);
            }else if (eg && this.lastGroupField !== undefined && groupField !== this.lastGroupField) {
                this.mainBody.update('');
                var oldIndex = this.cm.findColumnIndex(this.lastGroupField);
                this.cm.setHidden(oldIndex, false);
                this.lastGroupField = groupField;
                this.cm.setHidden(colIndex, true);
            }
        }
        return Ext.ux.grid.GroupingExplorerView.superclass.renderRows.apply(
                    this, arguments);
    },

    // private
    doRender : function(cs, rs, ds, startRow, colCount, stripe){
        if(rs.length < 1){
            return '';
        }
        var groupField = this.getGroupField();
        var colIndex = this.cm.findColumnIndex(groupField);

        this.enableGrouping = !!groupField;

        if(!this.enableGrouping || this.isUpdating){
            return Ext.ux.grid.GroupingExplorerView.superclass.doRender.apply(
                    this, arguments);
        }
        var gstyle = 'width:'+this.getTotalWidth()+';';

        var gidPrefix = this.grid.getGridEl().id;
        var cfg = this.cm.config[colIndex];
        var groupRenderer = cfg.groupRenderer || cfg.renderer;
        var prefix = this.showGroupName ?
                     (cfg.groupName || cfg.header)+': ' : '';

        var groups = [], curGroup, i, len, gid;
        for(i = 0, len = rs.length; i < len; i++){
            var rowIndex = startRow + i;
            var r = rs[i],
                gvalue = r.data[groupField],
                g = this.getGroup(gvalue, r, groupRenderer, rowIndex, colIndex, ds);
            if(!curGroup || curGroup.group != g){
                gid = gidPrefix + '-gp-' + groupField + '-' + Ext.util.Format.htmlEncode(g);
               	// if state is defined use it, however state is in terms of expanded
				// so negate it, otherwise use the default.
				var isCollapsed  = typeof this.state[gid] !== 'undefined' ? !this.state[gid] : this.startCollapsed;
				var gcls = isCollapsed ? 'x-grid-group-collapsed' : '';
                curGroup = {
                    group: g,
                    gvalue: gvalue,
                    text: prefix + g,
                    groupId: gid,
                    startRow: rowIndex,
                    rs: [r],
                    cls: gcls,
                    style: gstyle
                };
                groups.push(curGroup);
            }else{
                curGroup.rs.push(r);
            }
            r._groupId = gid;
        }

        var buf = [];
        for(i = 0, len = groups.length; i < len; i++){
            var g = groups[i];
            this.doGroupStart(buf, g, cs, ds, colCount);
            buf[buf.length] = Ext.ux.grid.GroupingExplorerView.superclass.doRender.call(
                    this, cs, g.rs, ds, g.startRow, colCount, stripe);

            this.doGroupEnd(buf, g, cs, ds, colCount);
        }
        return buf.join('');
    },

    getGroupId : function(value){
        var gidPrefix = this.grid.getGridEl().id;
        var groupField = this.getGroupField();
        var colIndex = this.cm.findColumnIndex(groupField);
        var cfg = this.cm.config[colIndex];
        var groupRenderer = cfg.groupRenderer || cfg.renderer;
        var gtext = this.getGroup(value, {data:{}}, groupRenderer, 0, colIndex, this.ds);
        return gidPrefix + '-gp-' + groupField + '-' + Ext.util.Format.htmlEncode(value);
    },

    // private
    doGroupStart : function(buf, g, cs, ds, colCount){
        buf[buf.length] = this.startGroup.apply(g);
    },

    // private
    doGroupEnd : function(buf, g, cs, ds, colCount){
        buf[buf.length] = this.endGroup;
    },

    // private
    getRows : function(){
        if(!this.enableGrouping){
            return Ext.ux.grid.GroupingExplorerView.superclass.getRows.call(this);
        }
        var r = [];
        var g, gs = this.getGroups();
        for(var i = 0, len = gs.length; i < len; i++){
            g = gs[i].childNodes[1].childNodes;
            for(var j = 0, jlen = g.length; j < jlen; j++){
                r[r.length] = g[j];
            }
        }
        return r;
    },

    // private
    updateGroupWidths : function(){
        if(!this.enableGrouping || !this.hasRows()){
            return;
        }
        var tw = Math.max(this.cm.getTotalWidth(), this.el.dom.offsetWidth-this.scrollOffset) +'px';
        var gs = this.getGroups();
        for(var i = 0, len = gs.length; i < len; i++){
            gs[i].firstChild.style.width = tw;
        }
    },

    // private
    onColumnWidthUpdated : function(col, w, tw){
        this.updateGroupWidths();
    },

    // private
    onAllColumnWidthsUpdated : function(ws, tw){
        this.updateGroupWidths();
    },

    // private
    onColumnHiddenUpdated : function(col, hidden, tw){
        this.updateGroupWidths();
    },

    // private
    onLayout : function(){
        this.updateGroupWidths();
    },

    // private
    onBeforeRowSelect : function(sm, rowIndex){
        if(!this.enableGrouping){
            return;
        }
        var row = this.getRow(rowIndex);
        if(row && !row.offsetParent){
            var g = this.findGroup(row);
            this.toggleGroup(g, true);
        }
    },

    groupByText: 'Group By This Field',
    showGroupsText: 'Show in Groups'
});

// Reg for lazy loading (xtype)
Ext.reg('groupingexplorerview', Ext.ux.grid.GroupingExplorerView);

// private
Ext.ux.grid.GroupingExplorerView.GROUP_ID = 1000;