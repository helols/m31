/*!
 * Ext JS Library 3.0.3
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
M31.app.Module = function(config){
    Ext.apply(this, config);
    M31.app.Module.superclass.constructor.call(this);
    this.init();
}

Ext.extend(M31.app.Module, Ext.util.Observable, {
    init : Ext.emptyFn,
    createCallback : Ext.emptyFn,
    beforeCreate : Ext.emptyFn,
    removeWin : Ext.emptyFn
});