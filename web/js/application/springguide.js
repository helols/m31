// 봄가이드
M31Desktop.SpringGuide = Ext.extend(M31.app.Module, {
    init : function() {
    },
    createWindow : function() {
        return {
            width:640,
            height:480,
            html : '<p>안내!</p>',
            shim:false,
            animCollapse:false,
            constrainHeader:true
        };
    }
});