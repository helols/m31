M31Desktop.Setting = Ext.extend(M31.app.Module, {
    init : function(){
        console.log('setting init');
    },

    createWindow :{
                width:640,
                height:480,
                html : '<p>Something useful would be in here.</p>',
                shim:false,
                animCollapse:false,
                constrainHeader:true
            }
});