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
    ,enableDD:false
    ,url:'/app/springfinder/getTree'
    ,animate:false
    ,expandable:false
    ,containerScroll: false
//    ,ddGroup: 'springfinderpenelDD'
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
    } // eo function onRender

    ,onBeforeDrag : function(data, e) {
        var n = data.node;
//        data.isDragble = n && n.draggable && !n.disabled;
//        data.parentId = n.attributes.parentId;
//        data.nodeId = n.attributes.id;
        data.isTree = true;
        return data.isDragble;
    }
    //    drop 이 사작되기전에.. 발생이벤트
    ,onBeforeNodeDrop:function(e) {
        return false;
    }

    //  tree 에 nodeDrop 가 완료된후 발생.
    ,onNodeDrop:function(e) {
        if (e.data.isPanel) {
        } else {
        }
    }

    //    drag대상이 노드에 올라왔을때 발생이벤트
    ,onNodeDragOver:function(e) {
        var cancel = false;
//        if (e.data.isPanel) {
//            if (!e.data.isDragble) {
//                cancel = true;
//            } else {
//                if (e.data.isMulti) {
//                    for (var i = 0; i < e.data.nodes.length; i++) {
//                        if (e.data.nodes[i].id == e.target.id) {
//                            cancel = true;
//                            break;
//                        }
//                    }
//                } else {
//                    if (e.data.ddel.id == e.target.id) {
//                        cancel = true;
//                    }
//                }
//            }
//
//        }
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

		else {
			path = node.attributes.path || '';
		}

		path = path.replace(/^[\/\.]*/, '');
		return path;
	}
});
