M31.app.SpringFinderPanel = Ext.extend(Ext.DataView, {
    tpl : new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="file-wrap" id="{fileId}">',
            '<a hidefocus="on" href="{fileAddition}"><img class="file" src="../../images/apps/springfinder/{iconCls}.png"></a>',
            '<div class="x-editable-wrap">',
            '<tpl if="defaultYn === \'Y\'">',
            '   <div>{shortFileName}</div>',
            '</tpl>',
            '<tpl if="defaultYn === \'N\'">',
            '   <span class="x-editable" ext:qwidth="60" ext:qtip="{fileName}">{shortFileName}</span>',
            '</tpl>',
            '</div>',
            '</div>',
            '</tpl>',
            '<div class="x-clear"></div>'
            ),

    multiSelect: true,
    overClass:'x-view-over',
    itemSelector:'div.file-wrap',
    emptyText: '',
    layout:'fit',
    autoScroll:true,
    addDbAction : Ext.emptyFn,
    id:'springfinder-panel' ,
    storeAction : 'get',
    newFolderNames : ['whiteship', 'nije', 'miracle', 'sonegy', 'srue', 'antatirs', 'mercujjang',  'anarcher','gyumee',  'princekey',  'outsider', 'is윤군'],

    plugins: [
        new Ext.DataView.DragSelector({dragSafe:true}),
        new Ext.DataView.LabelEditor({dataIndex: 'fileName'})
    ],

    prepareData: function(data) {
        data.shortFileName = Ext.util.Format.ellipsis(data.fileName, this.id === 'springfinder-panel' ? 8 : 5);
        data.fileAddition = data.fileAddition === null ? '#' : data.fileAddition;
        return data;
    },

    initComponent:function() {
        this.id += this.rootNodeName ? '-' + this.rootNodeName : '';
        this.growSize = this.id === 'springfinder-panel' ? 90 : 55;
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
                fields: [
                    'fileId', 'fileName',
                    'linkAppId','parentId',
                    'iconCls','fileAddition',
                    'defaultYn','fileType'
                ],
                listeners: {
                    'load': {fn:function(store) {
                        if (store.getCount() > 0) {
                            this.select(0);
                            if (this.springfinderTree) {
                                this.changePath();
                            }
                        }
                    }, scope:this}
                    ,'write':{fn:this.onWrite,scope:this}
                },
                writer: new Ext.data.JsonWriter({
                    encode: true,
                    writeAllFields: true,
                    listful : true
                }),
                batch : true,
                autoSave : false
            });
        }
        this.lastChangeNodeId = this.rootNodeId || 0;
        this.store.load({params:{parentNode: this.rootNodeId || 1 , parentNodeName:this.rootNodeName || null}});
        M31.app.SpringFinderPanel.superclass.initComponent.apply(this, arguments);
        this.on({
            filemove:{scope:this, fn:this.onFileMove}
            ,filerename:{scope:this, fn:this.onFileRename}
            ,filedelete:{scope:this, fn:this.onFileDelete}
            ,filecreate:{scope:this, fn:this.onFileCreate}
            ,dirchange:{scope:this, fn:this.onDirChange}
            ,dblclick : {fn:this.onDblclick, scope:this}
            ,contextmenu : {fn:this.onContextClick,scope:this}
            ,containercontextmenu : {fn:this.onContainerContextClick,scope:this}
        });
        console.log('init');
    },

    onRender:function() {
        console.log('onRender');
        M31.app.SpringFinderPanel.superclass.onRender.apply(this, arguments);
        this.store.loadMask = new Ext.app.CustomLoadMask(this.getEl(), {store: this.store, msg:"Loading panel..."});
        this.dragZone = new SpringfinderPanelDragZone(this, {containerScroll:false,
            ddGroup: 'springfinderpenelDD'});
        this.dropZone = new SpringfinderPanelDropZone(this, {ddGroup: 'springfinderpenelDD'});
    },
    onFileMove : function() {
        //        this.store.save();
    },

    onFileRename : function() {
        this.storeAction = 'rename';
        this.store.save();

    },
    onFileDelete : function() {
        this.storeAction = 'delete';
        this.store.save();
    },
    onFileCreate : function() {
        this.storeAction = 'createFolder';
        this.store.save();
    },
    onDirChange : function(nodeId) {
        if (this.lastChangeNodeId !== nodeId) {
            this.lastChangeNodeId = nodeId;
            this.store.load({params:{parentNode:nodeId}});
        }
    },
    onDblClick : function(node, scope, e) {
        var selNode = this.getSelectedNodes()[0];
        var data = this.getRecord(selNode).data;

        if (data.iconCls.indexOf('folder') !== -1) {
            var fileId = data.fileId;
            if (data.iconCls === 'up-folder') {
                fileId = data.parentId;
            }

            if (this.springfinderTree) {
                var node = this.springfinderTree.getNodeById(fileId);
                node.expand();
                this.springfinderTree.getSelectionModel().select(node);
                this.onDirChange(fileId);
            } else {
                this.onDirChange(fileId);
            }
        }

    },
    changePath : function() {
        var node = this.springfinderTree.getNodeById(this.lastChangeNodeId);
        this.ownerCt.setTitle(this.springfinderTree.getPath(node));
    },
    onWrite :function(store, action, result, res, rec) {
        var noticationmsg = '';
        switch(this.storeAction){
                case 'rename' :
                    noticationmsg = '파일명이 변경되었습니다.';
                    break;
                case 'createFolder' :
                    noticationmsg = '폴더가 생성되었습니다.';
                    break;
                case 'delete':
                    noticationmsg = '파일을 삭제하였습니다.';
                    break;
                case 'move':
                    noticationmsg = '파일들이 이동되었습니다.';
                    break;
                break;
        }
        m31.util.notification({title:'봄탐색기',text:noticationmsg,remove:true});
        if (this.springfinderTree){
            if(this.storeAction !== move){
                var node = this.springfinderTree.getNodeById(this.lastChangeNodeId);
                if (node) {
                    node.reload();
                }
            }else{

            }
        }
        
        store.commitChanges();
    },
    onContainerContextClick : function (view, e){
        if(!this.containerContextMenu){ // create context menu on first right click
    		this.containerContextMenu = new Ext.menu.Menu({
                id:'springfinderpanel-containercontext-menu',
                items: [{
                    iconCls: 'new-folder',
                    text: '새폴더',
                    scope:this,
                    handler: function(){
                        var store = this.getStore();
                        var record = new store.recordType({
                                    fileName : this.newFolderNames[Math.floor(Math.random() * 11) + 1],
                                    linkAppId : 'springfinder',
                                    parentId : this.lastChangeNodeId,
                                    iconCls : 'folder' ,
                                    fileAddition : '' ,
                                    defaultYn : 'N',
                                    fileType : 'F'
                        });
                        store.add(record);
                        this.onFileCreate();
                    }
                },{
                    iconCls: 'panel-refresh',
                    text: '새로고침',
                    scope:this,
                    handler : function(){
                        this.getStore().reload();
                    }
                }]
            });
        }
    	e.stopEvent();
        this.containerContextMenu.showAt(e.getXY());
    },
    onContextClick : function(view, index, obj, e) {
        var _self = this;
        var selectCnt = this.getSelectionCount();
        if(!this.contextMenu){ // create context menu on first right click
            this.contextMenu = new Ext.menu.Menu({
                id:'springfinderpanel-context-menu',
                items: [{
                    itemId : 'delete-file',
                    iconCls: 'delete-file',
                    text: '삭제',
                    scope:this,
                    handler: function(){
                        var sCnt = this.getSelectionCount();
                        var options = {
                              yesClick : function(){
                                  _self.store.remove(_self.getSelectedRecords());
                                  _self.onFileDelete();
                                  this.ownerCt.ownerCt.close();
                              },
                              noClick : function(){
                                  this.ownerCt.ownerCt.close();
                              },
                              msg : sCnt+'개의 파일을 삭제 하시겠습니까?'
                        }
                        new Ext.Window(
                            Ext.apply(
                                    new M31Desktop.Signout().createWindow(options),{
                                        id : 'springfinder-popup-win',
                                        manager: M31.WindowsManager.getInstance().getManager(),
                                        isPopup : true ,
                                        iconCls :'delete-file',
                                        popCallback : function(){console.log('remove')}
                            })).show();
                    }
                },{
                    itemId : 'rename-file',
                    iconCls: 'rename-file',
                    text: '이름바꾸기',
                    scope:this,
                    handler : function(){
                        this.plugins[1].onMouseDown(e,Ext.get(this.getSelectedNodes()[0].id).child('span.x-editable'));
                    }
                }]
            });
        }
        Ext.each(this.contextMenu.items.items,function(item){
            if(item.itemId === 'rename-file'){
                if(selectCnt > 1){
                    item.setDisabled(true);
                }else if(_self.store.getAt(_self.getSelectedIndexes()[0]).data.defaultYn === 'Y'){
                    item.setDisabled(true);
                }else{
                    item.setDisabled(false);
                }
            }else{
                var idxs = _self.getSelectedIndexes();
                for(var i = 0 ; i < idxs.length;i++){
                    if(_self.store.getAt(idxs[i]).data.defaultYn === 'Y'){
                        item.setDisabled(true);
                        break;
                    }else{
                        item.setDisabled(false);
                    }
                }
            }
        });
    	e.stopEvent();
        this.contextMenu.showAt(e.getXY());
    }
});

/**
 * springfinder pael drag zone.....
 */
SpringfinderPanelDragZone = function(view, config) {
    this.view = view;
    SpringfinderPanelDragZone.superclass.constructor.call(this, view.getEl(), config);
};
Ext.extend(SpringfinderPanelDragZone, Ext.dd.DragZone, {

    // drag가 시작 될수 있는지 체크 할 수 있는 곳..
    onBeforeDrag : function(data, e) {
        var nodeData = this.view.getRecords(data.nodes);
        var defalutYn = [];
        var fileIds = [];
        for (var i = 0, len = nodeData.length; i < len; i++) {
            defalutYn.push(nodeData[i].data.defaultYn);
            fileIds.push(nodeData[i].data.fileId);
        }
        data.isDragble = defalutYn.indexOf('Y') !== -1 ? false : true;
        data.parentId = nodeData[0].data.parentId;
        data.fileIds = fileIds;
        data.isPanel = true;
    },

    getDragData : function(e) {
        var target = e.getTarget('.file-wrap');
        if (target) {
            var view = this.view;
            if (!view.isSelected(target)) {
                view.onClick(e);
            }
            var selNodes = view.getSelectedNodes();
            var dragData = {
                nodes: selNodes
            };
            if (selNodes.length == 1) {
                dragData.ddel = target;
                dragData.isMulti = false;
                dragData.orgXy = Ext.fly(dragData.ddel).getXY();
            } else {
                var div = document.createElement('div'); // create the multi element drag "ghost"
                div.className = 'multi-proxy';
                for (var i = 0, len = selNodes.length; i < len; i++) {
                    div.appendChild(selNodes[i].firstChild.firstChild.cloneNode(true)); // image nodes only
                    if ((i + 1) % 3 == 0) {
                        div.appendChild(document.createElement('br'));
                    }
                }
                var count = document.createElement('div'); // selected image count
                count.innerHTML = i + ' file selected';
                div.appendChild(count);

                dragData.ddel = div;
                dragData.isMulti = true;
            }
            return dragData;
        }
        return false;
    },

    // this method is called by the TreeDropZone after a node drop
    // to get the new tree node (there are also other way, but this is easiest)
    getTreeNode : function(dd, ddtarget) {
        //        console.log(dd)
        //        console.log(ddtarget)
        var store = this.view.getStore();
        var treeNodes = [];
        var nodeData = this.view.getRecords(this.dragData.nodes);
        for (var i = 0, len = nodeData.length; i < len; i++) {
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
            rec.set('parentId', ddtarget.id);
        }
        return treeNodes;

    },

    // the default action is to "highlight" after a bad drop
    // but since an image can't be highlighted, let's frame it
    afterRepair:function() {
        for (var i = 0, len = this.dragData.nodes.length; i < len; i++) {
            Ext.fly(this.dragData.nodes[i]).frame('#8db2e3', 1);
        }
        this.dragging = false;
    },

    // override the default repairXY with one offset for the margins and padding
    getRepairXY : function(e) {
        if (!this.dragData.isMulti) {
            var xy = this.dragData.orgXy;
            xy[0] += 3;
            xy[1] += 3;
            return xy;
        }
        return false;
    }
});

/**
 * springfinder pael drop zone.....
 */
SpringfinderPanelDropZone = function(view, config) {
    this.view = view;
    SpringfinderPanelDropZone.superclass.constructor.call(this, view.getEl(), config);
};
Ext.extend(SpringfinderPanelDropZone, Ext.dd.DropZone, {

    //        panel에 바로 드랍을 했을 경우 판단하여  this.dropNotAllowed / this.dropAllowed 을 보여줌.
    onContainerOver : function(dd, e, data) {
        if (this.isContainerDropble(data)) {
            return this.dropAllowed;
        } else {
            return this.dropNotAllowed;
        }
    },
    //      드랍이 가능한지 체크를 해서 true 와 false를 리던해줌.
    onContainerDrop : function(dd, e, data) {
        return this.isContainerDropble(data);
    },
    //      drop 될 target을 넘겨준다.. 대상을 돌려주는것... 배경으로 옮길시에는... onContainerDrop 이걸로..
    getTargetFromEvent: function(e) {
        return e.getTarget('div.file-wrap');
    },

    //      드랍이 가능한곳에 올라왓을때 보여주는 ... 별필요는 없어보임..ㅋ
    onNodeEnter : function(target, dd, e, data) {
        console.log('onNodeEnter')
    },

    //      On exit from a target node, unhighlight that node.
    onNodeOut : function(target, dd, e, data) {
    },

    //      드랍가능 구역에 마우스 오버시에 보여질.. 거시기..
    onNodeOver : function(target, dd, e, data) {
        if (this.isNodeDropble(target, data)) {
            console.dir(data);
            return this.dropAllowed;
        } else {
            return this.dropNotAllowed;
        }
    },

    //      최종적으로 드랍이 완료된 후 ... 해주는곳...
    onNodeDrop : function(target, dd, e, data) {

        return true;
    },
    //data.isDragble ||
    isContainerDropble : function(data) {
        if (data.isTree && data.isPanel) {
            false;
        } else if (data.isApp) {
            return true;
        }
        else {
            return false;
        }
    },

    isNodeDropble : function(target, data) {
        if (data.isTree) {
            false;
        }
        else {
            if (data.isPanel && data.isDragble && data.fileIds.indexOf(parseInt(target.id, 10)) === -1) {
                return true;
            } else if (data.isApp) {
                console.dir(data);
                return true;
            } else {
                return false;
            }
        }
    }
});