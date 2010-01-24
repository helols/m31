/**
 * 해당 부분은 treeLoader 에서 array 객체만 받아들이기때문에 treeList라는 객체안의 array 를
 * 꺼내서 tree를 구성하도록 오버라이드 함. 스프링 jsonview용 lib가 단순 배열은 안남겨줘서;;
 */
Ext.override(Ext.dd.DragSource, {
    beforeDragDrop : function(target, e, id) {
        return target.id === id;
    }
});

M31.app.SpringFinderPanel = Ext.extend(Ext.DataView, {
    tpl : new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="file-wrap {fileType}" id="{fileId}">',
            '<tpl if="linkAppId !== \'springbook\'">',
            '<tpl if="linkAppId !== \'springsee\' && fileType !== \'N\'">',
            '<a hidefocus="on" href="{fileAddition}">',
            '</tpl>',
            '</tpl>',
            '<tpl if="linkAppId === \'springsee\' && fileType === \'N\'">',
            '<a hidefocus="on" href="{fileAddition}" class="pirobox_gall" title="{fileName}">',
            '</tpl>',
            '<img style="{imgStyle}" src="../../images/apps/springfinder/{imgName}.png">',
            '<tpl if="linkAppId !== \'springbook\'">',
            '<tpl if="linkAppId !== \'springsee\' && fileType !== \'N\'">',
            '</a>',
            '</tpl>',
            '</tpl>',
            '<tpl if="linkAppId === \'springsee\' && fileType === \'N\'">',
            '</a>',
            '</tpl>',
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
    autoHeight : true,
    addDbAction : Ext.emptyFn,
    storeAction : 'get',
    newFolderNames : ['whiteship', 'nije', 'miracle', 'sonegy', 'srue', 'antatirs', 'mercujjang',  'anarcher','gyumee',  'princekey',  'outsider', 'is윤군','arawn'],

    prepareData: function(data) {
        data.shortFileName = Ext.util.Format.ellipsis(data.fileName, this.id === 'springfinder-panel' ? 8 : 5);
        data.fileAddition = data.fileAddition === null ? '#' : data.fileAddition;
        data.imgStyle = this.id === 'springfinder-panel' ? 'width:80px;height:80px;' : 'width:40px;height:40px;';
        return data;
    },

    initComponent:function() {
        M31.app.SpringFinderPanel.superclass.initComponent.apply(this, arguments);
        this.growSize = this.id === 'springfinder-panel' ? 90 : 55;
        var proxy = new Ext.data.HttpProxy({
            api: {
                read : '/app/springfinder/getFiles',
                create : '/app/springfinder/insertFile',
                update: '/app/springfinder/updateFile',
                destroy: '/app/springfinder/deleteFile'
            }
        });
        var tmpproxy = new Ext.data.HttpProxy({
            api: {
                create : '/app/springfinder/insertFile'
            }
        });
        if (!this.store) {
            this.store = new Ext.data.JsonStore({
                proxy: proxy,
                root: 'fileList',
                autoDestroy : true,
                idProperty : 'fileId',
                fields: [
                    'fileId', 'fileName',
                    'linkAppId','parentId',
                    'iconCls','fileAddition',
                    'defaultYn','fileType','imgName','filePath'
                ],
                listeners: {
                    'beforeload' :{fn:function(store){
                        this.autoHeight = true;
                      }
                     ,scope:this},
                    'load': {fn:function(store) {
                        this.syncSize();
                        if (store.getCount() > 0) {
                            this.select(0);
                            this.ownerCt.setTitle((this.ownerCtTitle) +store.getAt(0).data.filePath+' ]');
                            this.onResizez(this.ownerCt.getHeight());
                        }
                        this.onDataViewRender(); }, scope:this}
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
            this.tmpstore = new Ext.data.JsonStore({
                proxy: proxy,
                root: 'fileList',
                autoDestroy : true,
                idProperty : 'fileId',
                fields: [
                    'fileId', 'fileName',
                    'linkAppId','parentId',
                    'iconCls','fileAddition',
                    'defaultYn','fileType','imgName'
                ],
                listeners: {
                    'write':{fn:this.onWrite,scope:this}
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
        this.lastChangeNodeId = this.rootNodeId || 1;
        this.store.load({params:{parentNode: this.rootNodeId || 1 , parentNodeName:this.rootNodeName || null}});
        this.on({
            filemove:{scope:this, fn:this.onFileMove}
            ,filerename:{scope:this, fn:this.onFileRename}
            ,filedelete:{scope:this, fn:this.onFileDelete}
            ,filecreate:{scope:this, fn:this.onFileCreate}
            ,dirchange:{scope:this, fn:this.onDirChange}
            ,dblclick : {fn:this.onDblclick}
            ,contextmenu : {fn:this.onContextClick}
            ,containercontextmenu : {fn:this.onContainerContextClick}
        });
        this.plugins = [ new Ext.DataView.DragSelector({dragSafe:true,id:this.id+'-selector'}),
                          new Ext.DataView.LabelEditor({dataIndex: 'fileName'})];
    },
    onResizez : function(rawHeight) {
        if (Ext.fly(this.id)) {
            var height = Ext.fly(this.id).getSize().height;
            if (height > 50) {
                if (height < rawHeight) {
                    Ext.fly(this.id).setHeight(rawHeight - 30);
                } else {
                    this.autoHeight = true;
                    this.syncSize();
                }
            } else {
                this.autoHeight = true;
            }
        }


    },
    onRender:function() {
        M31.app.SpringFinderPanel.superclass.onRender.apply(this, arguments);
        this.store.loadMask = new Ext.app.CustomLoadMask(this.ownerCt.getEl(), {store: this.store, msg:"Loading panel..."});
        this.dragZone = new SpringfinderPanelDragZone(this, {containerScroll:false,
            ddGroup: 'springfinderpenelDD',id : this.id + '-dragzone',scroll:false});
        this.dropZone = new SpringfinderPanelDropZone(this, {ddGroup: 'springfinderpenelDD',id: this.id + '-dropzone',scroll:false});
        this.ownerCtTitle = this.springfinderTree ? '[ ':this.ownerCt.title+' [ ';
    },
    onDataViewRender : function() {
        $().piroBox({
            target: this.id,
            eventName:'dblclick',
            my_speed: 600, //animation speed
            bg_alpha: 0.5, //background opacity
            radius: 4, //caption rounded corner
            scrollImage : false, // true == image follows the page, false == image remains in the same open position
            pirobox_next : 'piro_next', // Nav buttons -> piro_next == inside piroBox , piro_next_out == outside piroBox
            pirobox_prev : 'piro_prev',// Nav buttons -> piro_prev == inside piroBox , piro_prev_out == outside piroBox
            close_all : '.piro_close',// add class .piro_overlay(with comma)if you want overlay click close piroBox
            slideShow : 'slideshow', // just delete slideshow between '' if you don't want it.
            slideSpeed : 4 //slideshow duration in seconds(3 to 6 Recommended)
        });
    },
    onFileMove : function(action) {
        this.storeAction = action;
        this.store.save();
    },

    onFileRename : function() {
        this.storeAction = 'rename';
        this.store.save();

    },
    onFileDelete : function() {
        this.storeAction = 'delete';
        this.store.save();
    },
    onFileCreate : function(action) {
        this.storeAction = action || 'createFolder';
        if (action === 'createFolder') {
            this.store.save();
        } else {
            this.tmpstore.save();
        }
    },
    onDirChange : function(nodeId) {
        if (this.lastChangeNodeId !== nodeId) {
            this.lastChangeNodeId = nodeId;
            this.store.load({params:{parentNode:nodeId}});
        }
    },
    onDblClick : function(node, scope, e) {
        var selNode = undefined;
        if(this.getSelectedNodes()){
            selNode = this.getSelectedNodes()[0];
        }
        if(!selNode|| !this.getRecord(selNode)){
            return false;
        }
        var data = this.getRecord(selNode).data;

        if (data.iconCls.indexOf('folder') !== -1) {
            var fileId = data.fileId;
            if (this.springfinderTree) {
                var node = this.springfinderTree.getNodeById(fileId);
                node.expand();
                this.springfinderTree.getSelectionModel().select(node);
                this.onDirChange(fileId);
            } else {
                this.onDirChange(fileId);
            }
        } else if (data.linkAppId === 'springplayer' || data.linkAppId === 'springbook') {
            var app = M31.ApplicationRegistry.getInstance().getApp(data.linkAppId);
            var win = M31.WindowsManager.getInstance().getWindow(data.linkAppId);
            if (!win) {
                m31.util.openWindow(data.linkAppId);
            } else {
                if (win.minimized || win.hidden) {
                    win.show();
                } else if (win !== win.manager.getActive()) {
                    win.toFront();
                }
            }
            if (data.linkAppId === 'springplayer') {
                if (Ext.getCmp("springfinder-panel-springplayer")) {
                    app.play(data.fileName, data.fileAddition);
                } else {
                    app.play.defer(500, app, [data.fileName,data.fileAddition]);
                }
            } else {
                app.gateway(data.fileAddition);
            }
        }
    },
    changePath : function() {
        var node = this.springfinderTree.getNodeById(this.lastChangeNodeId);
        this.ownerCt.setTitle(this.springfinderTree.getPath(node));
    },
    onWrite :function(store, action, result, res, rec) {
        var noticationmsg = '';
        switch (this.storeAction) {
            case 'rename' :
                noticationmsg = '파일명이 변경되었습니다.';
                break;
            case 'createFolder' :
                noticationmsg = '폴더가 생성되었습니다.';
                break;
            case 'delete':
                noticationmsg = '파일을 삭제하였습니다.';
                break;
            case 'fileCreate':
                noticationmsg = '파일이 저장되었습니다.';
                break;
            case 'panel-fileCreate':
                noticationmsg = '파일이 이동되었습니다.';
                break;
                break;
        }
        m31.util.notification({title:'봄탐색기',text:noticationmsg,remove:true,timeout:1500});
        if (this.springfinderTree) {
            if (this.storeAction.indexOf('fileCreate') !== 1) {
                var node = this.springfinderTree.getNodeById(this.lastChangeNodeId);
                if (node) {
                    node.reload();
                }
            }
        }
        if (store.find('linkAppId','springsee') !== -1 && this.storeAction !== 'createFolder') {
            store.load({params:{parentNode:store.getAt(0).data.parentId}});
        }
        store.commitChanges();
    },
    onContainerContextClick : function (view, e) {
        if (!this.containerContextMenu) { // create context menu on first right click
            this.containerContextMenu = new Ext.menu.Menu({
                id:this.id+'-containercontext-menu',
                items: [
                    {
                        iconCls: 'new-folder',
                        text: '새폴더',
                        scope:this,
                        handler: function() {
                            var store = this.getStore();
                            var linkAppId = this.id === 'springfinder-panel'?'springfinder':this.rootNodeName;
                            var record = new store.recordType({
                                fileName : this.newFolderNames[Math.floor(Math.random() * 12) + 1],
                                linkAppId : linkAppId,
                                parentId : store.getAt(0).data.parentId || this.view.lastChangeNodeId,
                                iconCls : 'folder' ,
                                fileAddition : '' ,
                                defaultYn : 'N',
                                fileType : 'F',
                                imgName :'folder-'+linkAppId
                            });
                            store.add(record);
                            this.onFileCreate('createFolder');

                        }
                    },
                    {
                        iconCls: 'panel-refresh',
                        text: '새로고침',
                        scope:this,
                        handler : function() {
                            this.getStore().reload();
                        }
                    }
                ]
            });
        }
        e.stopEvent();
        this.containerContextMenu.showAt(e.getXY());
    },
    onContextClick : function(view, index, obj, e) {
        var _self = this;
        var selectCnt = this.getSelectionCount();
        if (!this.contextMenu) { // create context menu on first right click
            this.contextMenu = new Ext.menu.Menu({
                id:this.id+'-context-menu',
                items: [
                    {
                        itemId : 'delete-file',
                        iconCls: 'delete-file',
                        text: '삭제',
                        scope:this,
                        handler: function() {
                            var sCnt = this.getSelectionCount();
                            var options = {
                                yesClick : function() {
                                    _self.store.remove(_self.getSelectedRecords());
                                    _self.onFileDelete();
                                    this.ownerCt.ownerCt.close();
                                },
                                noClick : function() {
                                    this.ownerCt.ownerCt.close();
                                },
                                msg : sCnt + '개의 파일을 삭제 하시겠습니까?'
                            };
                            new Ext.Window(
                                    Ext.apply(
                                            new M31Desktop.Signout().createWindow(options), {
                                        id : 'springfinder-popup-win',
                                        manager: M31.WindowsManager.getInstance().getManager(),
                                        isPopup : true ,
                                        iconCls :'delete-file'
                                    })).show();
                        }
                    },
                    {
                        itemId : 'rename-file',
                        iconCls: 'rename-file',
                        text: '이름바꾸기',
                        scope:this,
                        handler : function() {
                            this.plugins[1].onMouseDown(e, Ext.get(this.getSelectedNodes()[0].id).child('span.x-editable'));
                        }
                    }
                ]
            });
        }
        Ext.each(this.contextMenu.items.items, function(item) {
            if (item.itemId === 'rename-file') {
                if (selectCnt > 1) {
                    item.setDisabled(true);
                } else if (_self.store.getAt(_self.getSelectedIndexes()[0]).data.defaultYn === 'Y') {
                    item.setDisabled(true);
                } else {
                    item.setDisabled(false);
                }
            } else {
                var idxs = _self.getSelectedIndexes();
                for (var i = 0; i < idxs.length; i++) {
                    if (_self.store.getAt(idxs[i]).data.defaultYn === 'Y') {
                        item.setDisabled(true);
                        break;
                    } else {
                        item.setDisabled(false);
                    }
                }
            }
        });
        e.stopEvent();
        this.contextMenu.showAt(e.getXY());
    },
    reload : function() {
        this.store.load({params:{parentNode:this.lastChangeNodeId}});
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
        var parentIds = [];
        var items = new Array();
        Ext.each(nodeData, function(item) {
            defalutYn.push(item.data.defaultYn);
            fileIds.push(item.data.fileId);
            parentIds.push(item.data.parentId);
            items.push(item.data);
        });
        data.isDragble = defalutYn.indexOf('Y') !== -1 ? false : true;
        data.items = items;
        data.fileIds = fileIds;
        data.parentIds = parentIds;
        data.isPanel = true;
        data.drogPanelId = this.id;
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
                    var seleNode = Ext.fly(selNodes[i].id).child('img').dom;
                    if(seleNode){
                        var t_node = seleNode.cloneNode(false);
                        t_node.className = 'dragthum';
                        div.appendChild(t_node); // image nodes only
                        if ((i + 1) % 3 == 0) {
                            div.appendChild(document.createElement('br'));
                        }
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
    //    getTreeNode : function(dd, ddtarget) {
    //        //        console.log(dd)
    //        //        console.log(ddtarget)
    //        var store = this.view.getStore();
    //        var treeNodes = [];
    //        var nodeData = this.view.getRecords(this.dragData.nodes);
    //        for (var i = 0, len = nodeData.length; i < len; i++) {
    //            var data = nodeData[i].data;
    //            treeNodes.push(new Ext.tree.TreeNode({
    //                text: data.fileName,
    //                iconCls: 'folder',
    //                parentId:ddtarget.id,
    //                leaf:false,
    //                defaultYn : 'N',
    //                singleClickExpand : 'true'
    //            }));
    //            var rec = store.getAt(i);
    //            rec.set('parentId', ddtarget.id);
    //        }
    //        return treeNodes;
    //
    //    },

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
    //      drop 될 target을 넘겨준다.. 대상을 돌려주는것... 배경으로 옮길시에는... onContainerDrop 이걸로..
    getTargetFromEvent: function(e) {
        return e.getTarget('div.file-wrap');
    },

    //        panel에 바로 드랍을 했을 경우 판단하여  this.dropNotAllowed / this.dropAllowed 을 보여줌.
    onContainerOver : function(dd, e, data) {
        if (this.isContainerDropble(dd, e, data)) {
            return this.dropAllowed;
        } else {
            return this.dropNotAllowed;
        }
    },
    //      드랍이 가능한지 체크를 해서 true 와 false를 리던해줌.
    onContainerDrop : function(dd, e, data) {
        var isDropble = this.isContainerDropble(dd, e, data);
        if (isDropble) {
            var store = this.view.store;
            var parentId = this.view.store.getAt(0).data.parentId || this.view.lastChangeNodeId;
            var actType = 'fileCreate';
            if (data.isApp) {
                Ext.each(data.items, function(item) {
                    var record = new store.recordType({
                        fileName : item.fileName,
                        linkAppId : data.linkAppId,
                        parentId : parentId,
                        iconCls : 'file' ,
                        fileAddition : item.fileAddition ,
                        defaultYn : 'N',
                        fileType : 'N',
                        imgName : 'file-' + data.linkAppId
                    });
                    store.add(record);
                });
                this.view.onFileMove(actType);
            }
        }
        return isDropble;
    },

    //      드랍가능 구역에 마우스 오버시에 보여질.. 거시기..
    onNodeOver : function(target, dd, e, data) {
        if (this.isNodeDropble(target, data)) {
            return this.dropAllowed;
        } else {
            return this.dropNotAllowed;
        }
    },

    //      최종적으로 드랍이 완료된 후 ... 해주는곳...
    onNodeDrop : function(target, dd, e, data) {
        var isDropble = this.isNodeDropble(target, data);
        if (isDropble) {
            this.createFile(data, target);
        }
        return isDropble;
    },
    //data.isDragble ||
    isContainerDropble : function(dd, e, data) {
        if(e.getTarget('#'+dd.id) !== null || e.getTarget('#'+(dd.grid || dd).id) !== null){
            return false;
        }
        if (data.isTree) {
            return false;
        } else if (data.isApp  && !(data.isDragble)) {
            return true;
        }else {
            return false;
        }
    },

    isNodeDropble : function(target, data) {
        if (data.isTree) {
            return false;
        }
        else {
            if (Ext.fly(target.id).hasClass('N')) {
                return false;
            }
            if (data.isPanel && data.isDragble && data.fileIds.indexOf(parseInt(target.id, 10)) === -1 && data.parentIds.indexOf(parseInt(target.id, 10)) === -1) {
                return true;
            } else if (data.isApp && !(data.isDragble)) {
                return true;
            } else {
                return false;
            }
        }
    },
    createFile : function(data, target) {
        var view = this.view;
        var rec = view.store.getById(target.id);
        if (rec) {
            var v_store = view.store;
            var parentId = v_store.getById(target.id).data.fileId;
            var store = view.tmpstore;
            var actType = 'fileCreate';
            if (data.isApp) {
                Ext.each(data.items, function(item) {
                    var record = new store.recordType({
                        fileName : item.fileName,
                        linkAppId : data.linkAppId,
                        parentId : parentId,
                        iconCls : 'file' ,
                        fileAddition : item.fileAddition ,
                        defaultYn : 'N',
                        fileType : 'N'
                    });
                    store.add(record);
                });
            } else if (data.drogPanelId !== this.id) {
                var dragView = Ext.getCmp(data.drogPanelId);
                var dragStore = dragView.store;
                Ext.each(data.items, function(item, idx) {
                    var record = new store.recordType({
                        fileName : item.fileName,
                        linkAppId : item.linkAppId,
                        parentId : item.parentId,
                        iconCls : item.iconCls,
                        fileAddition : item.fileAddition ,
                        defaultYn : item.defaultYn,
                        fileType : item.fileType,
                        fileId : item.fileId
                    });
                    record.id = item.fileId;

                    store.add(record);
                    store.commitChanges();
                    record.set('parentId', parentId);
                    record.dirty = true;
                    record.phantom = false;
                    dragStore.remove(dragView.getRecord(data.nodes[idx]));
                });
                dragStore.commitChanges();
                dragStore.removed = [];
                actType = 'panel-fileCreate';
            }else {
                Ext.each(data.items, function(item, idx) {
                    var record = new store.recordType({
                        fileName : item.fileName,
                        linkAppId : item.linkAppId,
                        parentId : item.parentId,
                        iconCls : item.iconCls,
                        fileAddition : item.fileAddition ,
                        defaultYn : item.defaultYn,
                        fileType : item.fileType,
                        fileId : item.fileId
                    });
                    record.id = item.fileId;

                    store.add(record);
                    store.commitChanges();
                    record.set('parentId', parentId);
                    record.dirty = true;
                    record.phantom = false;
                    v_store.remove(view.getRecord(data.nodes[idx]));
                });
                v_store.commitChanges();
                v_store.removed = [];
                actType = 'panel-fileCreate';
            }
            view.onFileCreate(actType);
        }
    }
});