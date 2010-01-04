<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <% request.setAttribute("cacheTime", System.currentTimeMillis());%>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Springsprout WEB DESKTOP</title>


    <link rel="stylesheet" type="text/css" href="<c:url value="/css/desktop/desktop.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/main.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/extJS/resources/css/ext-all.css"/>"/>
    <!--[if lt IE 7]>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/iehack.css"/>"/>
    <![endif]-->
    <!-- GC -->
    <!-- LIBS -->
    <script type="text/javascript" src="<c:url value="/js/framework/jQuery/jquery-1.3.2.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/adapter/jquery/ext-jquery-adapter-debug.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/ext-all-debug.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/js/plugin/movingboxes.js"/>"></script>
    <!-- ENDLIBS -->


    <script type="text/javascript">
        Ext.ns("M31", "M31.dt", "M31.app", "M31.util");
        Ext.Ajax.defaultHeaders = {'AJAX': 'true'};
    </script>
    <script type="text/javascript" src="<c:url value="/js/common/utils.js"/>"></script>

</head>
<body id="body">
<script type="text/javascript">
    Ext.EventManager.onWindowResize(movingbox.layout, this);
    Ext.onReady(function() {
        var user = Ext.util.Cookies.get("springsprout");
        var users = [];
        if(user !== null){
            users = user.split(":")
        }
//        console.log(users)

//        Ext.util.Cookies.set("springsprout", "helolsjava@gmail.com:helols@naver.com", new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)), "/");
        //http://www.gravatar.com/avatar.php?gravatar_id=18ccbf5e7f8f161362e0af4cdb8142cf&rating=x&size=256
        //http://www.gravatar.com/avatar.php?gravatar_id=4800e76eba2e4e3e07807658e0c00960&rating=PG&size=256
        movingbox.init();
        //        setTimeout(function(){
        //                Ext.get('loading').remove();
        //                Ext.get('loading-mask').fadeOut({remove:true});
        //            }, 1000);
    });
</script>
<%--<div id="loading-mask"></div>--%>
<%--<div id="loading">--%>
<%--<div class="loading-messge">--%>
<%--<img src="../../images/lodding-logo.png" width="110" height="110" style="margin-bottom: -5px;" align="absmiddle"/><br/>--%>
<%--Loading...<br/>--%>
<%--<img src="../../images/ajax-loader.gif" width="220" height="19" style="margin-right:8px;" align="absmiddle"/>--%>
<%--</div>--%>
<%--</div>--%>
<div id="slider">
        <div class="panel" id="panel_demo">
            <div class="inside">
                <img src="<c:url value="/images/main/demo-logo.png"/>"
                     alt="demo"/>
                <div class="name_text">Demo User</div>
            </div>
            <div class="d_password">
                <input type="hidden" name="j_username" class="j_username" value="springsprout@springsprout.org">
                <input type="hidden" name="j_title"    class="j_title" value="Demo User">
                <input type="password" name="j_password" class="j_password" value="" >
            </div>
        </div>
        <div class="panel" id="panel_chage">
            <div class="inside">
                <img src="<c:url value="/images/main/change-logo.png"/>"
                     alt="change user"/>
                <div class="name_text" style="">Change User</div>
            </div>
            <div class="d_password">
                <input type="hidden" name="j_username" class="j_username" value="Change User">
                <input type="hidden" name="j_title"    class="j_title" value="Change User">
                <input type="password" name="j_password" class="j_password" value="" >
            </div>
        </div>
        <div class="panel" id="panel_newuser">
            <div class="inside">
                <img src="<c:url value="/images/main/newuser-logo.png"/>"
                     alt="new user"/>
                <div class="name_text" style="">New User</div>
            </div>
            <div class="d_password">
                <input type="hidden" name="j_username" class="j_username" value="New User">
                <input type="hidden" name="j_title"    class="j_title" value="New User">
                <input type="password" name="j_password" class="j_password" value="" >
            </div>
        </div>    
       
        <%--<div class="panel">--%>
        <%--<div class="inside">--%>
        <%--<img src="http://www.gravatar.com/avatar.php?gravatar_id=4800e76eba2e4e3e07807658e0c00960&rating=x&size=256"--%>
        <%--alt="picture"/>--%>
        <%--<div class="name_text" style="">Demo User</div>--%>
        <%--</div>--%>
        <%--<div class="j_password">--%>
        <%--<input type="text">--%>
        <%--</div>--%>
        <%--</div>--%>
        <%--</div>--%>
    </div>
<%--<a class="arrow arrowleft">&nbsp;</a>--%>
<%--<a class="arrow arrowright">&nbsp;</a>--%>
</body>
</html>