<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <% request.setAttribute("cacheTime", System.currentTimeMillis());%>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Springsprout WEB DESKTOP</title>


    <link rel="stylesheet" type="text/css" href="<c:url value="/css/common.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/main.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/framework/plugin/gritter.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/extJS/resources/css/ext-all.css"/>"/>
    <!--[if lt IE 7]>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/iehack.css"/>"/>
    <![endif]-->
    <!-- GC -->
    <!-- LIBS -->
    <script type="text/javascript" src="<c:url value="/js/framework/jQuery/jquery-1.3.2.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/adapter/jquery/ext-jquery-adapter-debug.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/ext-all-debug.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/plugin/ux/Spotlight.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/js/application/movingboxes.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/js/plugin/gritter.js"/>"></script>
    <!-- ENDLIBS -->

    <script type="text/javascript" src="<c:url value="/js/common/utils.js"/>"></script>

</head>
<body id="body">
<div id="start-mask"></div>
<div id="loading-mask"></div>
<script type="text/javascript">
//    m31.util.loading();
    Ext.onReady(function() {
        var user = Ext.util.Cookies.get("springsprout");
        var users = [];
        if (user !== null) {
            users = user.split(":")
        }
        //        console.log(users)

        //        Ext.util.Cookies.set("springsprout", "helolsjava@gmail.com:helols@naver.com", new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)), "/");
        //http://www.gravatar.com/avatar.php?gravatar_id=18ccbf5e7f8f161362e0af4cdb8142cf&rating=x&size=256
        //http://www.gravatar.com/avatar.php?gravatar_id=4800e76eba2e4e3e07807658e0c00960&rating=PG&size=256
        movingbox.init();
        /**
         * 서글 IE가 참으로 고맙게도 동작해주는 관계로.. 예외처리함.
         */
        if(Ext.isIE){
            Ext.get('changeNextBtn')
                    .prev('.j_password').addClass('j_password_ie')
                    .prev('.email_btn').prev('.j_email').addClass('j_email_ie');
        }
    });
</script>
<div id="slider">
    <div class="panel" id="panel_demo">
        <div class="inside">
            <img src="<c:url value="/images/main/demo-logo.png"/>"
                 alt="demo"/>

            <div class="name_text">Demo User</div>
        </div>
        <div class="addition">
            <input type="hidden" name="j_username" class="j_username" value="springsprout@springsprout.org">
            <input type="hidden" name="j_title" class="j_title" value="Demo User">
            <input type="password" name="j_password" class="j_password">
            <img id="loginNextBtn" class="nextbtn" src="<c:url value="/images/main/login.png"/>" title="Login!"/>
        </div>
    </div>
    <div class="panel" id="panel_change">
        <div class="inside">
            <img class="changeImg" src="<c:url value="/images/main/change-logo.png"/>"
                 alt="change user"/>

            <div class="name_text" style="">Change User</div>
        </div>
        <div class="addition change-addition">
            <input type="hidden" name="j_username" class="j_username" value="User 정보를 입력해주세요.">
            <input type="hidden" name="j_title" class="j_title" value="Change User">
            <input type="input"  name="j_email" class="j_email" value="">
            <img id="email_btn" class="email_btn" src="<c:url value="/images/main/email-add.png"/>" title="Email 기억 여부"/>
            <input type="password" name="j_password" class="j_password" value="">
            <img id="changeNextBtn" class="nextbtn" src="<c:url value="/images/main/login.png"/>" title="Login!"/>
        </div>
    </div>
    <div class="panel" id="panel_newuser">
        <div class="inside">
            <img src="<c:url value="/images/main/newuser-logo.png"/>"
                 alt="new user"/>

            <div class="name_text" style="">New User</div>
        </div>
        <div class="addition">
            <input type="hidden" name="j_username" class="j_username" value="사용자 추가를 하시겠습니까?">
            <input type="hidden" name="j_title" class="j_title" value="New User">
            <img id="newNextBtnImg" class="new_nextbtn" src="<c:url value="/images/main/newuser-next-btn.gif"/>" title="SignUp"/>
        </div>
    </div>

</div>
<div id="arrow">
    <img style="margin-right:50px" src="<c:url value="/images/main/icon-pre-arrow.gif"/>"/>
    <img src="<c:url value="/images/main/icon-next-arrow.gif"/>"/>
</div>
</body>
</html>