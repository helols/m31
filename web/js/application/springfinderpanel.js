M31.app.SpringFinderPanel = Ext.extend(Ext.DataView, {
    tpl : new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="file-wrap" id="{fileId}">',
            '<a href="{fileAddition}"><div class="file {iconCls}" ></div></a>',
            '<span class="x-editable">{shortFileName}</span>',
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
    id:'springfinder-panel' ,


    plugins: [
        new Ext.DataView.DragSelector(),
        new Ext.DataView.LabelEditor({dataIndex: 'fileName'})
    ],

    prepareData: function(data) {
        data.shortFileName = Ext.util.Format.ellipsis(data.fileName, 15);
        data.fileAddition = data.fileAddition?'#':data.fileAddition; 
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
        if (!this.store) {
            this.store = new Ext.data.JsonStore({
                url: '/app/springfinder/getFiles',
                root: 'fileList',
                fields: [
                    'fileId', 'fileName',
                    'linkAppId','parentId',
                    'iconCls','fileAddition'
                ],
                listeners: {
                    'load': {fn:function() {
                        this.select(0);
                    }, scope:this, single:true}
                }
            });
        }
        this.store.baseParams.parentNode = 1;
        this.store.load();
        console.log('init');
        M31.app.SpringFinderPanel.superclass.initComponent.apply(this, arguments);
    },
    onRender:function() {
        console.log('onRender');
        M31.app.SpringFinderPanel.superclass.onRender.apply(this, arguments);
    }
});