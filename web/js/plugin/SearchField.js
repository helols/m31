/**
 * The custom search field
 */
Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function () {
        Ext.app.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function (f, e) {
            if (e.getKey() === e.ENTER) {
                this.onTrigger2Click();
            }
        }, this);
    },

    validationEvent: false,
    validateOnBlur: false,
    trigger1Class: 'x-form-clear-trigger',
    trigger2Class: 'x-form-search-trigger',
    hideTrigger1: true,
    width: 180,
    hasSearch : false,
    paramName : 'query',

    // X버튼 클릭시
    onTrigger1Click : function () {
        if (this.hasSearch) {
            var o = {start: 0};
            o[this.paramName] = '';
            //this.store.reload({params: o});
            this.store.removeAll();
            this.el.dom.value = '';
            this.triggers[0].hide();
            this.hasSearch = false;
        }
    },
    // 검색(돋보기) 클릭시
    onTrigger2Click : function () {
        var v = this.getRawValue().trim();
        if (v.length < 1) {
            this.onTrigger1Click();
            return;
        }
        var o = {start: 0};
        o[this.paramName] = v;
        this.store.reload({params: o});
        this.hasSearch = true;
        this.triggers[0].show();
    }
});