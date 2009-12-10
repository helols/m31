Ext.BLANK_IMAGE_URL = 'ext/resources/images/default/s.gif';

// application main entry point
Ext.onReady(function() {

    // setup state management
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    // create and show window
    var win = new Ext.Window({
        title:Ext.fly('page-title').dom.innerHTML
        ,id:'win'
        ,closable:false

        // default widht and height
        ,width:400
        ,height:300

        // default coordinates of draggable items (divisions)
        ,divs:[
            {
                x:20,
                y:20
            }
            ,
            {
                x:80,
                y:20
            }
            ,
            {
                x:140,
                y:20
            }
            ,
            {
                x:200,
                y:20
            }
            ,
            {
                x:20,
                y:80
            }
            ,
            {
                x:80,
                y:80
            }
            ,
            {
                x:140,
                y:80
            }
            ,
            {
                x:200,
                y:80
            }
        ]

        // save state on these events
        ,stateEvents:['move','resize','itemdrag']

        // return also item coordinates as part of state
        ,getState:function() {
            var state = Ext.Window.prototype.getState.call(this);
            state.divs = this.divs;
            return state;
        }

        // item creation template
        ,tpl: new Ext.XTemplate(
                '<tpl for="divs">'
                , '<div id="item-{#}" class="item draggable" style="top:{y}px;left:{x}px;">Item {#}</div>'
                , '</tpl>'
                )

        // runs after the window is rendered
        ,afterRender:function() {

            // create items using template
            Ext.Window.prototype.afterRender.apply(this, arguments);
            this.tpl.overwrite(this.body, this);

            // setup D&D
            var items = this.body.select('div.draggable');

            // loop through draggable items
            items.each(function(el, ce, index) {

                // create DDProxy
                el.dd = new Ext.dd.DDProxy(el.dom.id, 'group');

                // configure the proxy
                Ext.apply(el.dd, {
                    win:this
                    ,itemIndex:index

                    // runs on drag start
                    // create nice proxy and constrain it to body
                    ,startDrag:function(x, y) {
                        var dragEl = Ext.get(this.getDragEl());
                        var el = Ext.get(this.getEl());

                        dragEl.applyStyles({border:'','z-index':this.win.lastZIndex + 1});
                        dragEl.update(el.dom.innerHTML);
                        dragEl.addClass(el.dom.className + ' dd-proxy');

                        this.constrainTo(this.win.body);
                    } // eo function startDrag

                    // runs on drag end
                    // save new position of item and fire itemdrag event to save state
                    ,afterDrag:function() {
                        var el = Ext.get(this.getEl());
                        var div = this.win.divs[this.itemIndex];
                        div.x = el.getLeft(true);
                        div.y = el.getTop(true);
                        this.win.fireEvent('itemdrag', this);
                    } // eo function afterDrag

                }) // eo apply

            }, this); // eo each
        } // eo function afterRender
    });

    win.show();

}); // eo function onReady

// eof
