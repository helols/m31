M31.app.SpringFinderPanel = Ext.extend(Ext.DataView, {
    tpl : new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="file-wrap" id="{fileId}">',
            '<a href="{fileAddition}"><img class="file" src="../../images/apps/springfinder/{iconCls}.png"></a>',
            '<div class="x-editable-wrap"><span class="x-editable">{shortFileName}</span></div>',
            '<input type="hidden" class="{fileId}-parentId" value="{parentId}">',
            '<input type="hidden" class="{fileId}-linkInfo" value="{linkAppId}"> </div>',
            '</tpl>',
            '<div class="x-clear"></div>'
            ),

    multiSelect: true,
    overClass:'x-view-over',
    itemSelector:'div.file-wrap',
    emptyText: '',
    layout:'fit',
    autoScroll:true,
    id:'springfinder-panel' ,


    plugins: [
        new Ext.DataView.DragSelector({dragSafe:true}),
        new Ext.DataView.LabelEditor({dataIndex: 'fileName'})
    ],

    prepareData: function(data) {
        data.shortFileName = Ext.util.Format.ellipsis(data.fileName, 15);
        data.fileAddition = data.fileAddition === null?'#':data.fileAddition;
        return data;
    },

    listeners: {
        //        selectionchange: {
        //            fn: function(dv,nodes){
        //                var l = nodes.length;
        //                var s = l != 1 ? 's' : '';
        //                panel.setTitle('Simple DataView ('+l+' item'+s+' selected)');
        //            }
        //        }
    },

    initComponent:function() {
        var proxy = new Ext.data.HttpProxy({
            api: {
                read : '/app/springfinder/getFiles',
                create : '/app/springfinder/insertFile',
                update: '/app/springfinder/updateFile',
                destroy: '/app/springfinder/deleteFile'
            }
        });
        if (!this.store) {
            this.store = new Ext.data.JsonStore({
                proxy: proxy,
                root: 'fileList',
                idProperty : 'fileId',
//                storestat : 'view',
                fields: [
                    'fileId', 'fileName',
                    'linkAppId','parentId',
                    'iconCls','fileAddition'
                ],
                listeners: {
                    'load': {fn:function() {
                        this.select(0);
//                        this.storestat = 'view';
                    }, scope:this, single:true}
//                    ,'update': {fn:function(store) {
//                        if(this.storestat === 'move'){
//                            store.reload();
//                        }
//                    }, scope:this, single:true}
                },
                writer: new Ext.data.JsonWriter({
                            encode: true,
                            writeAllFields: true
                        }),
                batch : true,
                autoSave : false
            });
        }
        this.store.load({params:{parentNode:1}});
        console.log('init');
        this.addEvents(
			 'filemove'
			,'filerename'
			,'filedelete'
			,'filecreate'
		); // eo addEvents
        M31.app.SpringFinderPanel.superclass.initComponent.apply(this, arguments);
    },
    onRender:function() {
        console.log('onRender');
        M31.app.SpringFinderPanel.superclass.onRender.apply(this, arguments);
        this.dragZone = new SpringfinderPanelDragZone(this, {containerScroll:true,
        ddGroup: 'springfindertreeDD'});
    },
    onFilemove : function(){
        console.log(this);
        console.log('onFilemove');
    },

    onFilerename : function(){

    },
    onFiledelete : function(){

    },
    onFilecreate : function(){

    }
});

/**
 * Create a DragZone instance for our JsonView
 */
SpringfinderPanelDragZone = function(view, config){
    this.view = view;
    SpringfinderPanelDragZone.superclass.constructor.call(this, view.getEl(), config);
};
Ext.extend(SpringfinderPanelDragZone, Ext.dd.DragZone, {
    getDragData : function(e){
        var target = e.getTarget('.file-wrap');
        if(target){
            var view = this.view;
            if(!view.isSelected(target)){
                view.onClick(e);
            }
            var selNodes = view.getSelectedNodes();
            var dragData = {
                nodes: selNodes
            };
            if(selNodes.length == 1){
                dragData.ddel = target;
                dragData.isMulti = false;
            }else{
                var div = document.createElement('div'); // create the multi element drag "ghost"
                div.className = 'multi-proxy';
                for(var i = 0, len = selNodes.length; i < len; i++){
                    div.appendChild(selNodes[i].firstChild.firstChild.cloneNode(true)); // image nodes only
                    if((i+1) % 3 == 0){
                        div.appendChild(document.createElement('br'));
                    }
                }
                var count = document.createElement('div'); // selected image count
                count.innerHTML = i + ' file selected';
                div.appendChild(count);

                dragData.ddel = div;
                dragData.isMulti = true;
            }
            dragData.isPanel = true;
            return dragData;
        }
        return false;
    },

    // this method is called by the TreeDropZone after a node drop
    // to get the new tree node (there are also other way, but this is easiest)
    getTreeNode : function(dd , ddtarget){
        console.log(dd)
        console.log(ddtarget)
        var store = this.view.getStore();
        var treeNodes = [];
        var nodeData = this.view.getRecords(this.dragData.nodes);
        for(var i = 0, len = nodeData.length; i < len; i++){
            var data = nodeData[i].data;
            treeNodes.push(new Ext.tree.TreeNode({
                text: data.fileName,
                iconCls: 'folder',
                parentId:ddtarget.id,
                leaf:false,
                defaultYn : 'N',
                singleClickExpand : 'true'
            }));
            var rec = store.getAt(i);
            rec.set('parentId',ddtarget.id);
        }
        return treeNodes;

    },

    // the default action is to "highlight" after a bad drop
    // but since an image can't be highlighted, let's frame it
    afterRepair:function(){
        for(var i = 0, len = this.dragData.nodes.length; i < len; i++){
            Ext.fly(this.dragData.nodes[i]).frame('#8db2e3', 1);
        }
        this.dragging = false;
    },

    // override the default repairXY with one offset for the margins and padding
    getRepairXY : function(e){
        if(!this.dragData.isMulti){
            var xy = Ext.Element.fly(this.dragData.ddel).getXY();
            xy[0]+=3;xy[1]+=3;
            return xy;
        }
        return false;
    }
});