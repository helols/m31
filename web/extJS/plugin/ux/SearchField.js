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
    baseParam : undefined,

    // X버튼 클릭시
    onTrigger1Click : function () {
        if (this.hasSearch) {
            var o = {start: 0};
            
            o[this.paramName] = '';
            this.store.reload({params:o});

            this.el.dom.value = '';
            this.triggers[0].hide();
            this.focus();
            this.hasSearch = false;
        }
    },
    // 검색(돋보기) 클릭시
    onTrigger2Click : function () {
        var v = this.getRawValue().trim();

        if (v.length < 1) {

            m31.util.notification({
                title: 'System',
                text: '검색어를 입력해주세요.'
            });

            this.onTrigger1Click();
            return;
        }

        var o = {start: 0};
        if(this.baseParam){
        	this.store.setBaseParam(this.baseParam, v);
        }
        else{
        	o[this.paramName] = v;
        }
        this.store.reload({params: o, start : true});
        this.hasSearch = true;
        this.triggers[0].show();
    }
});