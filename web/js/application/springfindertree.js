/**
 * 해당 부분은 treeLoader 에서 array 객체만 받아들이기때문에 treeList라는 객체안의 array 를
 * 꺼내서 tree를 구성하도록 오버라이드 함. 스프링 jsonview용 lib가 단순 배열은 안남겨줘서;;
 */
Ext.override(Ext.tree.TreeLoader, {
    processResponse : function(response, node, callback, scope) {
        var json = response.responseText;
        try {
            var o = response.responseData || Ext.decode(json).treeList;
            node.beginUpdate();
            for (var i = 0, len = o.length; i < len; i++) {
                var n = this.createNode(o[i]);
                if (n) {
                    node.appendChild(n);
                }
            }
            node.endUpdate();
            this.runCallback(callback, scope || node, [node]);
        } catch(e) {
            this.handleFailure(response);
        }
    }
});

/**
 * Tree에 keyup 이벤트 추가.
 */
Ext.override(Ext.tree.DefaultSelectionModel, {
    init : function(tree) {
        this.tree = tree;
        tree.mon(tree.getTreeEl(), 'keydown', this.onKeyDown, this);
        tree.mon(tree.getTreeEl(), 'keyup', this.onKeyup, this);
        tree.on('click', this.onNodeClick, this);
    },
    onNodeClick : function(node, e) {
        this.tree.finderpanel.fireEvent('dirChange', node.id);
        this.select(node);
    },
    onKeyup : function(e) {
        var s = this.selNode || this.lastSelNode;
        var sm = this;
        if (!s) {
            return;
        }
        var k = e.getKey();
        switch (k) {
            case e.DOWN:
            case e.UP:
            case e.RIGHT:
            case e.LEFT:
                e.stopEvent();
                e.preventDefault();
                var node = sm.getSelectedNode();
                this.tree.finderpanel.fireEvent('dirChange', node.id);
                break;
        }
        ;
    }
});
/**
 * Ext.ux.FileTreePanel
 *
 * @author  Ing. Jozef Sakáloš
 * @version $Id: Ext.ux.FileTreePanel.js 266 2008-05-18 23:24:47Z jozo $
 * @date    13. March 2008
 *
 * @license Ext.ux.FileTreePanel is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 *
 * License details: http://www.gnu.org/licenses/lgpl.html
 * 해당 FileTreePanel를 참고해서 ....
 */

M31.app.SpringFinderTree = Ext.extend(Ext.tree.TreePanel, {
    id:'springfinder-tree'
    ,containerScroll:true
    ,enableDD:true
    //    ,existsText:'File <b>{0}</b> already exists'
    //    ,newdirText:'봄 폴더'
    ,url:'/app/springfinder/getTree'
    ,animate:false
    ,enableDD:true
    ,expandable:false
    ,containerScroll: false
    ,ddGroup: 'springfinderpenelDD'
    ,rootVisible:true
    ,region:'west'
    ,width:200
    ,minSize: 150
    ,split: true
    ,title : 'springfinder'
    ,collapsible: false
    ,height : 600
    ,autoScroll:true
    ,margins: '0'
    ,collapseFirst:false
    ,titleCollapse : false
    ,rootPath:'root'
    ,rootText:'root'
    ,tools:[      
        {
            id:'refresh',
            qtip: '새로고침',
            // hidden:true,
            handler: function(event, toolEl, panel) {
                var sm = panel.getSelectionModel();
                var node = sm.getSelectedNode();
                if (node) {
                    sm.select(node);
                    node.reload();
                }
            }
        }
    ]

    ,initComponent:function() {
        Ext.apply(this, {
            root: {
                nodeType: 'async',
               	text:this.rootText,
				path:this.rootPath,
                draggable: false,
                allowDrag:false,
                allowDrop:true,
                id: 1
            },
            treeEditor:!this.readOnly ? new Ext.tree.TreeEditor(this, {
                 allowBlank:false
                ,cancelOnEsc:true
                ,completeOnEnter:true
                ,ignoreNoChange:true
                ,selectOnFocus:true
            }) : undefined

            // drop config
            ,dropConfig:this.dropConfig ? this.dropConfig : {
                ddGroup:this.ddGroup || 'TreeDD'
                ,appendOnly:true
                ,expandDelay:3600000 // do not expand on drag over node
            }

            ,dragConfig : {
                ddGroup : 'springfinderpenelDD',
                onBeforeDrag : this.onBeforeDrag.createDelegate(this)
            }

            // create treeSorter
            ,treeSorter:new Ext.tree.TreeSorter(this, {folderSort:true,dir: "desc",
                sortType: function(node) {
                    return parseInt(node.id, 10);
                }
            })
        }); // eo apply

        if (!this.loader) {
            this.loader = new Ext.tree.TreeLoader({
                url:this.url,
                listeners : {
                    load: function(store, node) {
                        node.ownerTree.getSelectionModel().select(node);
                    }
                }
            });
        }
        // call parent
        M31.app.SpringFinderTree.superclass.initComponent.apply(this, arguments);

        // {{{
        // install treeEditor event handlers
        if (this.treeEditor) {
            // tree 에디트가 끝나고와 성공 완료 직전 이벤트
            this.treeEditor.on({
                 beforeshow:{scope:this, fn:this.onBeforeshow}
                ,beforecomplete:{scope:this, fn:this.onEditb4Complete}
                ,complete:{scope:this, fn:this.onEditComplete}
            });
        }
        // install event handlers
        this.on({
            //            contextmenu:{scope:this, fn:this.onContextMenu, stopEvent:true}
            beforenodedrop:{scope:this, fn:this.onBeforeNodeDrop}
            ,nodedrop:{scope:this, fn:this.onNodeDrop}
            ,nodedragover:{scope:this, fn:this.onNodeDragOver}
        });
    } // eo function initComponent

    ,onRender:function() {
        // call parent
        M31.app.SpringFinderTree.superclass.onRender.apply(this, arguments);
        this.root.expand();
        // 오른쪽 마우스 클릭.. 없음.
        this.el.on({
            contextmenu:{fn:function() {
                return false;
            },stopEvent:true}
        });
//        this.loader.on({
//				 scope:this.el
//				,beforeload:this.el.mask.createDelegate(this.el, ['tree loading...'])
//				,load:this.el.unmask
//				,loadexception:this.el.unmask
//	    });
    } // eo function onRender

    ,onBeforeDrag : function(data, e) {
        var n = data.node;
        data.isDragble = n && n.draggable && !n.disabled;
        data.parentId = n.attributes.parentId;
        data.nodeId = n.attributes.id;
        data.isTree = true;
        return data.isDragble;
    }
    //    drop 이 사작되기전에.. 발생이벤트
    ,onBeforeNodeDrop:function(e) {
        console.log("beforeNodjeDRop");
        return false;
    }

    //  tree 에 nodeDrop 가 완료된후 발생.
    ,onNodeDrop:function(e) {
        if (e.data.isPanel) {
            console.log('panel')
        } else {
            console.log('tree ')
        }
    }

    //    drag대상이 노드에 올라왔을때 발생이벤트
    ,onNodeDragOver:function(e) {
        var cancel = false;
        if (e.data.isPanel) {
            if (!e.data.isDragble) {
                cancel = true;
            } else {
                if (e.data.isMulti) {
                    for (var i = 0; i < e.data.nodes.length; i++) {
                        if (e.data.nodes[i].id == e.target.id) {
                            cancel = true;
                            break;
                        }
                    }
                } else {
                    if (e.data.ddel.id == e.target.id) {
                        cancel = true;
                    }
                }
            }

        }
        e.cancel = cancel;
    } // eo function onNodeDragOver
    ,onBeforeshow : function(editor){
        var node = this.getNodeById(editor.editNode.id);
        if(node.isRoot || node.attributes.defaultYn === 'Y'){
            editor.cancellingEdit = true;
            editor.cancelEdit();
            return false;
        }
        return true;
    }
    ,onEditb4Complete : function(editor, newName, oldName) {
        if (editor.cancellingEdit) {
            editor.cancellingEdit = false;
            return;
        }
        if (newName === oldName) {
            editor.cancellingEdit = true;
            editor.cancelEdit();
            return false;
        }
    }
    ,onEditComplete:function(editor, newName, oldName) {
        if (newName === oldName ||  Ext.util.Format.trim(newName).length === 0) {
            return false;     
        }
        var node = this.getNodeById(editor.editNode.id);
        var parentId = node.attributes.parentId;
        var options = {
            url : '/app/springfinder/renameFile'
            ,scope:this
            ,callback:this.renameCallback
            ,node:node
            ,oldName:oldName
            ,params:{
                 fileName : Ext.util.Format.trim(newName)
                ,fileId : parseInt(node.attributes.id, 10)
                ,parentId : parseInt(parentId, 10)
            }
        };
        Ext.Ajax.request(options);
    }
    , renameCallback : function(options, success, response) {
        if (success === true) {
            var result = Ext.decode(response.responseText);
            m31.util.notification({title:'봄탐색기',text:result.msg,remove:true});
            this.finderpanel.changePath();
        }
    }

    ,getPath:function(node) {
		var path, p, a;

		// get path for non-root node
		if(node !== this.root) {
			p = node.parentNode;
			a = [node.text];
			while(p && p !== this.root) {
				a.unshift(p.text);
				p = p.parentNode;
			}
			a.unshift(this.root.attributes.path || '');
			path = a.join(this.pathSeparator);
		}

		// path for root node is it's path attribute
		else {
			path = node.attributes.path || '';
		}

		// a little bit of security: strip leading / or .
		// full path security checking has to be implemented on server
		path = path.replace(/^[\/\.]*/, '');
		return path;
	}
    // eo function getPath
    //    // new methods
    //    // {{{
    //    /**
    //     * runs after an Ajax requested command has completed/failed
    //     * @private
    //     * @param {Object} options Options used for the request
    //     * @param {Boolean} success true if ajax call was successful (cmd may have failed)
    //     * @param {Object} response ajax call response object
    //     */
    //    ,cmdCallback:function(options, success, response) {
    //        var i, o, node;
    //        var showMsg = true;
    //
    //        // process Ajax success
    //        if (true === success) {
    //
    //            // try to decode JSON response
    //            try {
    //                o = Ext.decode(response.responseText);
    //            }
    //            catch(ex) {
    //                this.showError(response.responseText);
    //            }
    //
    //            // process command success
    //            if (true === o.success) {
    //                switch (options.params.cmd) {
    //                    case 'delete':
    //                        if (true !== this.eventsSuspended) {
    //                            this.fireEvent('delete', this, this.getPath(options.node));
    //                        }
    //                        options.node.parentNode.removeChild(options.node);
    //                        break;
    //
    //                    case 'newdir':
    //                        if (true !== this.eventsSuspended) {
    //                            this.fireEvent('newdir', this, options.node);
    //                        }
    //                        break;
    //
    //                    case 'rename':
    //                        this.updateCls(options.node, options.params.oldname);
    //                        if (true !== this.eventsSuspended) {
    //                            this.fireEvent('rename', this, options.node, options.params.newname, options.params.oldname);
    //                        }
    //                        break;
    //                }
    //            } // eo process command success
    //            // process command failure
    //            else {
    //                switch (options.params.cmd) {
    //
    //                    case 'rename':
    //                        // handle drag & drop rename error
    //                        if (options.oldParent) {
    //                            options.oldParent.appendChild(options.node);
    //                        }
    //                        // handle simple rename error
    //                        else {
    //                            options.node.setFileName(options.oldName);
    //                        }
    //                        // signal failure to onNodeDrop
    //                        if (options.e) {
    //                            options.e.failure = true;
    //                        }
    //                        if (true !== this.eventsSuspended) {
    //                            this.fireEvent('renamefailure', this, options.node, options.params.newname, options.params.oldname);
    //                        }
    //                        break;
    //
    //                    case 'newdir':
    //                        if (false !== this.eventsSuspended) {
    //                            this.fireEvent('newdirfailure', this, options.params.dir);
    //                        }
    //                        options.node.parentNode.removeChild(options.node);
    //                        break;
    //
    //                    case 'delete':
    //                        if (true !== this.eventsSuspended) {
    //                            this.fireEvent('deletefailure', this, options.node);
    //                        }
    //                        options.node.parentNode.reload.defer(1, options.node.parentNode);
    //                        break;
    //
    //                    default:
    //                        this.root.reload();
    //                        break;
    //                }
    //
    //                // show default message box with server error
    //                this.showError(o.error || response.responseText);
    //            } // eo process command failure
    //        } // eo process Ajax success
    //
    //        // process Ajax failure
    //        else {
    //            this.showError(response.responseText);
    //        }
    //    } // eo function cmdCallback
    //    // }}}
    //    // {{{
    //    /**
    //     * displays overwrite confirm msg box and runs passed callback if response is yes
    //     * @private
    //     * @param {String} filename File to overwrite
    //     * @param {Function} callback Function to call on yes response
    //     * @param {Object} scope Scope for callback (defaults to this)
    //     */
    //    ,confirmOverwrite:function(filename, callback, scope) {
    //        Ext.Msg.show({
    //            title:this.confirmText
    //            ,msg:String.format(this.existsText, filename) + '. ' + this.overwriteText
    //            ,icon:Ext.Msg.QUESTION
    //            ,buttons:Ext.Msg.YESNO
    //            ,fn:callback.createDelegate(scope || this)
    //        });
    //    }
    //    // }}}
    //    // {{{
    //    /**
    //     * creates new directory (node)
    //     * @private
    //     * @param {Ext.tree.AsyncTreeNode} node
    //     */
    //    ,createNewDir:function(node) {
    //
    //        // fire beforenewdir event
    //        if (true !== this.eventsSuspended && false === this.fireEvent('beforenewdir', this, node)) {
    //            return;
    //        }
    //
    //        var treeEditor = this.treeEditor;
    //        var newNode;
    //
    //        // get node to append the new directory to
    //        var appendNode = node.isLeaf() ? node.parentNode : node;
    //
    //        // create new folder after the appendNode is expanded
    //        appendNode.expand(false, false, function(n) {
    //            // create new node
    //            newNode = n.appendChild(new Ext.tree.AsyncTreeNode({text:this.newdirText, iconCls:'folder'}));
    //
    //            // setup one-shot event handler for editing completed
    //            treeEditor.on({
    //                complete:{
    //                    scope:this
    //                    ,single:true
    //                    ,fn:this.onNewDir
    //                }}
    //                    );
    //
    //            // creating new directory flag
    //            treeEditor.creatingNewDir = true;
    //
    //            // start editing after short delay
    //            (function() {
    //                treeEditor.triggerEdit(newNode);
    //            }.defer(10));
    //            // expand callback needs to run in this context
    //        }.createDelegate(this));
    //
    //    } // eo function creatingNewDir
    //    // }}}
    //    // {{{
    //    /**
    //     * deletes the passed node
    //     * @private
    //     * @param {Ext.tree.AsyncTreeNode} node
    //     */
    //    ,deleteNode:function(node) {
    //        // fire beforedelete event
    //        if (true !== this.eventsSuspended && false === this.fireEvent('beforedelete', this, node)) {
    //            return;
    //        }
    //
    //        Ext.Msg.show({
    //            title:this.deleteText
    //            ,msg:this.reallyWantText + ' ' + this.deleteText.toLowerCase() + ' <b>' + node.text + '</b>?'
    //            ,icon:Ext.Msg.WARNING
    //            ,buttons:Ext.Msg.YESNO
    //            ,scope:this
    //            ,fn:function(response) {
    //                // do nothing if answer is not yes
    //                if ('yes' !== response) {
    //                    this.getEl().dom.focus();
    //                    return;
    //                }
    //                // setup request options
    //                var options = {
    //                    url:this.deleteUrl || this.url
    //                    ,method:this.method
    //                    ,scope:this
    //                    ,callback:this.cmdCallback
    //                    ,node:node
    //                    ,params:{
    //                        cmd:'delete'
    //                        ,file:this.getPath(node)
    //                    }
    //                };
    //                Ext.Ajax.request(options);
    //            }
    //        });
    //    } // eo function deleteNode
    //    // }}}
    //    // {{{
    //    /**
    //     * requests file download from server
    //     * @private
    //     * @param {String} path Full path including file name but relative to server root path
    //     */
    //    ,downloadFile:function(path) {
    //
    //        // create hidden target iframe
    //        var id = Ext.id();
    //        var frame = document.createElement('iframe');
    //        frame.id = id;
    //        frame.name = id;
    //        frame.className = 'x-hidden';
    //        if (Ext.isIE) {
    //            frame.src = Ext.SSL_SECURE_URL;
    //        }
    //
    //        document.body.appendChild(frame);
    //
    //        if (Ext.isIE) {
    //            document.frames[id].name = id;
    //        }
    //
    //        var form = Ext.DomHelper.append(document.body, {
    //            tag:'form'
    //            ,method:'post'
    //            ,action:this.downloadUrl || this.url
    //            ,target:id
    //        });
    //
    //        document.body.appendChild(form);
    //
    //        var hidden;
    //
    //        // append cmd to form
    //        hidden = document.createElement('input');
    //        hidden.type = 'hidden';
    //        hidden.name = 'cmd';
    //        hidden.value = 'download';
    //        form.appendChild(hidden);
    //
    //        // append path to form
    //        hidden = document.createElement('input');
    //        hidden.type = 'hidden';
    //        hidden.name = 'path';
    //        hidden.value = path;
    //        form.appendChild(hidden);
    //
    //        var callback = function() {
    //            Ext.EventManager.removeListener(frame, 'load', callback, this);
    //            setTimeout(function() {
    //                document.body.removeChild(form);
    //            }, 100);
    //            setTimeout(function() {
    //                document.body.removeChild(frame);
    //            }, 110);
    //        };
    //
    //        Ext.EventManager.on(frame, 'load', callback, this);
    //
    //        form.submit();
    //    }
    //    // }}}
    //    // {{{
    //    /**
    //     * returns (and lazy create) the context menu
    //     * @private
    //     */
    //    ,getContextMenu:function() {
    //        // lazy create context menu
    //        if (!this.contextmenu) {
    //            var config = {
    //                singleUpload:this.singleUpload
    //                ,maxFileSize:this.maxFileSize
    //                ,enableProgress:this.enableProgress
    //            };
    //            if (this.baseParams) {
    //                config.baseParams = this.baseParams;
    //            }
    //            this.contextmenu = new Ext.ux.FileTreeMenu(config);
    //            this.contextmenu.on({click:{scope:this, fn:this.onContextClick}});
    //
    //            this.uploadPanel = this.contextmenu.getItemByCmd('upload-panel').component;
    //            this.uploadPanel.on({
    //                beforeupload:{scope:this, fn:this.onBeforeUpload}
    //                ,allfinished:{scope:this, fn:this.onAllFinished}
    //            });
    //            this.uploadPanel.setUrl(this.uploadUrl || this.url);
    //        }
    //        return this.contextmenu;
    //    } // eo function getContextMenu
    //    // }}}
    //    // {{{
    //    /**
    //     * returns file class based on name extension
    //     * @private
    //     * @param {String} name File name to get class of
    //     */
    //    ,getFileCls:function(name) {
    //        var atmp = name.split('.');
    //        if (1 === atmp.length) {
    //            return this.fileCls;
    //        }
    //        else {
    //            return this.fileCls + '-' + atmp.pop().toLowerCase();
    //        }
    //    }
    //    // }}}
    //    // {{{
    //    /**
    //     * returns path of node (file/directory)
    //     * @private
    //     */
    //    ,getPath:function(node) {
    //        var path, p, a;
    //
    //        // get path for non-root node
    //        if (node !== this.root) {
    //            p = node.parentNode;
    //            a = [node.text];
    //            while (p && p !== this.root) {
    //                a.unshift(p.text);
    //                p = p.parentNode;
    //            }
    //            a.unshift(this.root.attributes.path || '');
    //            path = a.join(this.pathSeparator);
    //        }
    //
    //        // path for root node is it's path attribute
    //        else {
    //            path = node.attributes.path || '';
    //        }
    //
    //        // a little bit of security: strip leading / or .
    //        // full path security checking has to be implemented on server
    //        path = path.replace(/^[\/\.]*/, '');
    //        return path;
    //    } // eo function getPath
    //    // }}}
    //    // {{{
    //    /**
    //     * returns true if node has child with the specified name (text)
    //     * @private
    //     * @param {Ext.data.Node} node
    //     * @param {String} childName
    //     */
    //    ,hasChild:function(node, childName) {
    //        return (node.isLeaf() ? node.parentNode : node).findChild('text', childName) !== null;
    //    }
    //    // }}}
    //    // {{{
    //    /**
    //     * Hides context menu
    //     * @return {Ext.ux.FileTreeMenu} this
    //     */
    //    ,hideContextMenu:function() {
    //        if (this.contextmenu && this.contextmenu.isVisible()) {
    //            this.contextmenu.hide();
    //        }
    //        return this;
    //    } // eo function hideContextMenu
    //    // }}}
    //    // {{{
    //    /**
    //     * called before editing is completed - allows edit cancellation
    //     * @private
    //     * @param {TreeEditor} editor
    //     * @param {String} newName
    //     * @param {String} oldName
    //     */
    //    ,onBeforeEditComplete:function(editor, newName, oldName) {
    //        if (editor.cancellingEdit) {
    //            editor.cancellingEdit = false;
    //            return;
    //        }
    //        var oldPath = this.getPath(editor.editNode);
    //        var newPath = oldPath.replace(/\/[^\\]+$/, '/' + newName);
    //
    //        if (false === this.fireEvent('beforerename', this, editor.editNode, newPath, oldPath)) {
    //            editor.cancellingEdit = true;
    //            editor.cancelEdit();
    //            return false;
    //        }
    //    }
    //    // }}}

    //    // {{{
    //    /**
    //     * sets uploadPanel's destination path
    //     * @private
    //     */
    //    ,onBeforeUpload:function(uploadPanel) {
    //
    //        var menu = this.getContextMenu();
    //        var path = this.getPath(menu.node);
    //        if (menu.node.isLeaf()) {
    //            path = path.replace(/\/[^\/]+$/, '', path);
    //        }
    //        uploadPanel.setPath(path);
    //
    //    } // eo function onBeforeUpload
    //    // }}}
    //    // {{{
    //    /**
    //     * reloads tree node on upload finish
    //     * @private
    //     */
    //    ,onAllFinished:function(uploader) {
    //        var menu = this.getContextMenu();
    //        (menu.node.isLeaf() ? menu.node.parentNode : menu.node).reload();
    //    } // eo function onAllFinished
    //    // }}}
    //    // {{{
    //    /**
    //     * @private
    //     * context menu click handler
    //     * @param {Ext.menu.Menu} context menu
    //     * @param {Ext.menu.Item} item clicked
    //     * @param {Ext.EventObject} raw event
    //     */
    //    ,onContextClick:function(menu, item, e) {
    //        if (item.disabled) {
    //            return;
    //        }
    //        var node = menu.node;
    //        if (!node) {
    //            node = menu.parentMenu.node;
    //        }
    //        switch (item.cmd) {
    //            case 'reload':
    //                node.reload();
    //                break;
    //
    //            case 'expand':
    //                node.expand(true);
    //                break;
    //
    //            case 'collapse':
    //                node.collapse(true);
    //                break;
    //
    //            case 'open':
    //                this.openNode(node);
    //                break;
    //
    //            case 'open-self':
    //                this.openNode(node, '_self');
    //                break;
    //
    //            case 'open-popup':
    //                this.openNode(node, 'popup');
    //                break;
    //
    //            case 'open-blank':
    //                this.openNode(node, '_blank');
    //                break;
    //
    //            case 'open-dwnld':
    //                this.openNode(node, 'download');
    //                break;
    //
    //            case 'rename':
    //                this.treeEditor.triggerEdit(node);
    //                break;
    //
    //            case 'delete':
    //                this.deleteNode(node);
    //                break;
    //
    //            case 'newdir':
    //                this.createNewDir(node);
    //                break;
    //
    //            default:
    //                break;
    //        }
    //    } // eo function onContextClick
    //    // }}}
    //    // {{{
    //    /**
    //     * contextmenu event handler
    //     * @private
    //     */
    //    ,onContextMenu:function(node, e) {
    //        if (this.readOnly) {
    //            return false;
    //        }
    //        this.showContextMenu(node);
    //
    //        return false;
    //    } // eo function onContextMenu
    //    // }}}
    //    // {{{
    //    /**
    //     * dblclick handlers
    //     * @private
    //     */
    //    ,onDblClick:function(node, e) {
    //        this.openNode(node);
    //    } // eo function onDblClick
    //    // }}}
    //    // {{{
    //    /**
    //     * Destroys the FileTreePanel and sub-components
    //     * @private
    //     */
    //    ,onDestroy:function() {
    //
    //        // destroy contextmenu
    //        if (this.contextmenu) {
    //            this.contextmenu.purgeListeners();
    //            this.contextmenu.destroy();
    //            this.contextmenu = null;
    //        }
    //
    //        // destroy treeEditor
    //        if (this.treeEditor) {
    //            this.treeEditor.purgeListeners();
    //            this.treeEditor.destroy();
    //            this.treeEditor = null;
    //        }
    //
    //        // remover reference to treeSorter
    //        if (this.treeSorter) {
    //            this.treeSorter = null;
    //        }
    //
    //        // call parent
    //        Ext.ux.FileTreePanel.superclass.onDestroy.call(this);
    //
    //    } // eo function onDestroy
    //    // }}}
    //    // {{{
    //    /**
    //     * runs when editing of a node (rename) is completed
    //     * @private
    //     * @param {Ext.Editor} editor
    //     * @param {String} newName
    //     * @param {String} oldName
    //     */
    //    ,onEditComplete:function(editor, newName, oldName) {
    //
    //        var node = editor.editNode;
    //
    //        if (newName === oldName || editor.creatingNewDir) {
    //            editor.creatingNewDir = false;
    //            return;
    //        }
    //        var path = this.getPath(node.parentNode);
    //        var options = {
    //            url:this.renameUrl || this.url
    //            ,method:this.method
    //            ,scope:this
    //            ,callback:this.cmdCallback
    //            ,node:node
    //            ,oldName:oldName
    //            ,params:{
    //                cmd:'rename'
    //                ,oldname:path + '/' + oldName
    //                ,newname:path + '/' + newName
    //            }
    //        };
    //        Ext.Ajax.request(options);
    //    }
    //    // }}}
    //    // {{{
    //    /**
    //     * create new directory handler
    //     * @private
    //     * runs after editing of new directory name is completed
    //     * @param {Ext.Editor} editor
    //     */
    //    ,onNewDir:function(editor) {
    //        var path = this.getPath(editor.editNode);
    //        var options = {
    //            url:this.newdirUrl || this.url
    //            ,method:this.method
    //            ,scope:this
    //            ,node:editor.editNode
    //            ,callback:this.cmdCallback
    //            ,params:{
    //                cmd:'newdir'
    //                ,dir:path
    //            }
    //        };
    //        Ext.Ajax.request(options);
    //    }
    //    // }}}
    //    // {{{
    //    // }}}
    //    // {{{
    //    /**
    //     * called when node is dropped
    //     * @private
    //     * @param {Object} dd event
    //     */

    //    // }}}
    //    // {{{
    //    /**
    //     * Opens node
    //     * @param {Ext.tree.AsyncTreeNode} node
    //     * @param {String} mode Can be "_self", "_blank", or "popup". Defaults to (this.openMode)
    //     */
    //    ,openNode:function(node, mode) {
    //
    //        if (!this.enableOpen) {
    //            return;
    //        }
    //
    //        mode = mode || this.openMode;
    //
    //        var url;
    //        var path;
    //        if (node.isLeaf()) {
    //            path = this.getPath(node);
    //            url = this.hrefPrefix + path + this.hrefSuffix;
    //
    //            // fire beforeopen event
    //            if (true !== this.eventsSuspended && false === this.fireEvent('beforeopen', this, node.text, url, mode)) {
    //                return;
    //            }
    //
    //            switch (mode) {
    //                case 'popup':
    //                    if (!this.popup || this.popup.closed) {
    //                        this.popup = window.open(url, this.hrefTarget, this.popupFeatures);
    //                    }
    //                    this.popup.location = url;
    //                    if (this.focusPopup) {
    //                        this.popup.focus();
    //                    }
    //                    break;
    //
    //                case '_self':
    //                    window.location = url;
    //                    break;
    //
    //                case '_blank':
    //                    window.open(url);
    //                    break;
    //
    //                case 'download':
    //                    this.downloadFile(path);
    //                    break;
    //            }
    //
    //            // fire open event
    //            if (true !== this.eventsSuspended) {
    //                this.fireEvent('open', this, node.text, url, mode);
    //            }
    //        }
    //
    //    }
    //    // }}}
    //    // {{{
    //    /**
    //     * Sets/Unsets delete of files/directories disabled/enabled
    //     * @param {Boolean} disabled
    //     * @return {Ext.ux.FileTreePanel} this
    //     */
    //    ,setDeleteDisabled:function(disabled) {
    //        disabled = !(!disabled);
    //        if (!this.enableDelete === disabled) {
    //            return this;
    //        }
    //        this.hideContextMenu();
    //        this.enableDelete = !disabled;
    //    } // eo function setDeleteDisabled
    //    // }}}
    //    // {{{
    //    /**
    //     * Sets/Unsets creation of new directory disabled/enabled
    //     * @param {Boolean} disabled
    //     * @return {Ext.ux.FileTreePanel} this
    //     */
    //    ,setNewdirDisabled:function(disabled) {
    //        disabled = !(!disabled);
    //        if (!this.enableNewDir === disabled) {
    //            return this;
    //        }
    //        this.hideContextMenu();
    //        this.enableNewDir = !disabled;
    //
    //    } // eo function setNewdirDisabled
    //    // }}}
    //    // {{{
    //    /**
    //     * Sets/Unsets open files disabled/enabled
    //     * @param {Boolean} disabled
    //     * @return {Ext.ux.FileTreePanel} this
    //     */
    //    ,setOpenDisabled:function(disabled) {
    //        disabled = !(!disabled);
    //        if (!this.enableOpen === disabled) {
    //            return this;
    //        }
    //        this.hideContextMenu();
    //        this.enableOpen = !disabled;
    //
    //        return this;
    //    } // eo function setOpenDisabled
    //    // }}}
    //    // {{{
    //    /**
    //     * Sets/Unsets this tree to/from readOnly state
    //     * @param {Boolean} readOnly
    //     * @return {Ext.ux.FileTreePanel} this
    //     */
    //    ,setReadOnly:function(readOnly) {
    //        readOnly = !(!readOnly);
    //        if (this.readOnly === readOnly) {
    //            return this;
    //        }
    //        this.hideContextMenu();
    //        if (this.dragZone) {
    //            this.dragZone.locked = readOnly;
    //        }
    //        this.readOnly = readOnly;
    //
    //        return this;
    //
    //    } // eo function setReadOnly
    //    // }}}
    //    // {{{
    //    /**
    //     * Sets/Unsets rename of files/directories disabled/enabled
    //     * @param {Boolean} disabled
    //     * @return {Ext.ux.FileTreePanel} this
    //     */
    //    ,setRenameDisabled:function(disabled) {
    //        disabled = !(!disabled);
    //        if (!this.enableRename === disabled) {
    //            return this;
    //        }
    //        this.hideContextMenu();
    //        if (this.dragZone) {
    //            this.dragZone.locked = disabled;
    //        }
    //        this.enableRename = !disabled;
    //
    //        return this;
    //    } // eo function setRenameDisabled
    //    // }}}
    //    // {{{
    //    /**
    //     * Sets/Unsets uploading of files disabled/enabled
    //     * @param {Boolean} disabled
    //     * @return {Ext.ux.FileTreePanel} this
    //     */
    //    ,setUploadDisabled:function(disabled) {
    //        disabled = !(!disabled);
    //        if (!this.enableUpload === disabled) {
    //            return this;
    //        }
    //        this.hideContextMenu();
    //        this.enableUpload = !disabled;
    //
    //        return this;
    //    } // of function setUploadDisabled
    //    // }}}
    //    // {{{
    //    /**
    //     * adjusts context menu depending on many things and shows it
    //     * @private
    //     * @param {Ext.tree.AsyncTreeNode} node Node on which was right-clicked
    //     */
    //    ,showContextMenu:function(node) {
    //
    //        // setup node alignment
    //        var topAlign = false;
    //        var alignEl = this.topMenu ? this.topMenu.getEl() : this.body;
    //
    //        if (!node) {
    //            node = this.getSelectionModel().getSelectedNode();
    //            topAlign = true;
    //        }
    //        else {
    //            alignEl = node.getUI().getEl();
    //        }
    //        if (!node) {
    //            return;
    //        }
    //
    //        var menu = this.getContextMenu();
    //        menu.node = node;
    //
    //        // set node name
    //        menu.getItemByCmd('nodename').setFileName(Ext.util.Format.ellipsis(node.text, 22));
    //
    //        // enable/disable items depending on node clicked
    //        menu.setItemDisabled('open', !node.isLeaf());
    //        menu.setItemDisabled('reload', node.isLeaf());
    //        menu.setItemDisabled('expand', node.isLeaf());
    //        menu.setItemDisabled('collapse', node.isLeaf());
    //        menu.setItemDisabled('delete', node === this.root || node.disabled);
    //        menu.setItemDisabled('rename', this.readOnly || node === this.root || node.disabled);
    //        menu.setItemDisabled('newdir', this.readOnly || (node.isLeaf() ? node.parentNode.disabled : node.disabled));
    //        menu.setItemDisabled('upload', node.isLeaf() ? node.parentNode.disabled : node.disabled);
    //        menu.setItemDisabled('upload-panel', node.isLeaf() ? node.parentNode.disabled : node.disabled);
    //
    //        // show/hide logic
    //        menu.getItemByCmd('open').setVisible(this.enableOpen);
    //        menu.getItemByCmd('delete').setVisible(this.enableDelete);
    //        menu.getItemByCmd('newdir').setVisible(this.enableNewDir);
    //        menu.getItemByCmd('rename').setVisible(this.enableRename);
    //        menu.getItemByCmd('upload').setVisible(this.enableUpload);
    //        menu.getItemByCmd('upload-panel').setVisible(this.enableUpload);
    //        menu.getItemByCmd('sep-upload').setVisible(this.enableUpload);
    //        menu.getItemByCmd('sep-collapse').setVisible(this.enableNewDir || this.enableDelete || this.enableRename);
    //
    //        // select node
    //        node.select();
    //
    //        // show menu
    //        if (topAlign) {
    //            menu.showAt(menu.getEl().getAlignToXY(alignEl, 'tl-bl?'));
    //        }
    //        else {
    //            menu.showAt(menu.getEl().getAlignToXY(alignEl, 'tl-tl?', [0, 18]));
    //        }
    //    } // eo function
    //    // }}}
    //    // {{{
    //    /**
    //     * universal show error function
    //     * @private
    //     * @param {String} msg message
    //     * @param {String} title title
    //     */
    //    ,showError:function(msg, title) {
    //        Ext.Msg.show({
    //            title:title || this.errorText
    //            ,msg:Ext.util.Format.ellipsis(msg, this.maxMsgLen)
    //            ,fixCursor:true
    //            ,icon:Ext.Msg.ERROR
    //            ,buttons:Ext.Msg.OK
    //            ,minWidth:1200 > String(msg).length ? 360 : 600
    //        });
    //    } // eo function showError
    //    // }}}
    //    // {{{
    //    /**
    //     * updates class of leaf after rename
    //     * @private
    //     * @param {Ext.tree.AsyncTreeNode} node Node to update class of
    //     * @param {String} oldName Name the node had before
    //     */
    //    ,updateCls:function(node, oldName) {
    //        if (node.isLeaf()) {
    //            Ext.fly(node.getUI().iconNode).removeClass(this.getFileCls(oldName));
    //            Ext.fly(node.getUI().iconNode).addClass(this.getFileCls(node.text));
    //        }
    //    }
    //    // }}}

})
        ; // eo extend