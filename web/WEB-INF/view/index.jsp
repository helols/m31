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
    <script type="text/javascript" src="<c:url value="/js/framework/jQuery/jquery-1.3.2.min.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/adapter/jquery/ext-jquery-adapter.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/ext-all.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/plugin/ux/Spotlight.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/js/application/movingboxes.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/js/plugin/gritter.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/js/plugin/quickflip.js"/>"></script>
    <!-- ENDLIBS -->

    <script type="text/javascript" src="<c:url value="/js/common/utils.js"/>"></script>

</head>
<body id="body">
<!--[if lt IE 7]>
  <div style='border: 1px solid #F7941D; background: #FEEFDA; text-align: center; clear: both; height: 75px; position: relative;'>
    <div style='position: absolute; right: 3px; top: 3px; font-family: courier new; font-weight: bold;'><a href='#' onclick='javascript:this.parentNode.parentNode.style.display="none"; return false;'><img src='http://www.ie6nomore.com/files/theme/ie6nomore-cornerx.jpg' style='border: none;' alt='Close this notice'/></a></div>
    <div style='width: 640px; margin: 0 auto; text-align: left; padding: 0; overflow: hidden; color: black;'>
      <div style='width: 75px; float: left;'><img src='http://www.ie6nomore.com/files/theme/ie6nomore-warning.jpg' alt='Warning!'/></div>
      <div style='width: 275px; float: left; font-family: Arial, sans-serif;'>
        <div style='font-size: 14px; font-weight: bold; margin-top: 12px;'>현재 구식 브라우저를 사용중입니다.</div>
        <div style='font-size: 12px; margin-top: 6px; line-height: 12px;'>이 웹 사이트 IE6 버전은 지원하지 않습니다. 다른 브라우저를 사용해주세요.</div>
      </div>
      <div style='width: 75px; float: left;'><a href='http://www.firefox.com' target='_blank'><img src='http://www.ie6nomore.com/files/theme/ie6nomore-firefox.jpg' style='border: none;' alt='Get Firefox 3.5'/></a></div>
      <div style='width: 75px; float: left;'><a href='http://www.browserforthebetter.com/download.html' target='_blank'><img src='http://www.ie6nomore.com/files/theme/ie6nomore-ie8.jpg' style='border: none;' alt='Get Internet Explorer 8'/></a></div>
      <div style='width: 73px; float: left;'><a href='http://www.apple.com/safari/download/' target='_blank'><img src='http://www.ie6nomore.com/files/theme/ie6nomore-safari.jpg' style='border: none;' alt='Get Safari 4'/></a></div>
      <div style='float: left;'><a href='http://www.google.com/chrome' target='_blank'><img src='http://www.ie6nomore.com/files/theme/ie6nomore-chrome.jpg' style='border: none;' alt='Get Google Chrome'/></a></div>
    </div>
  </div>
<![endif]-->
<div id="start-mask"></div>
<div id="loading-mask"></div>
<script type="text/javascript">
    Ext.onReady(function() {
        var users = Ext.util.Cookies.get("springsprout");
        movingbox.init(users);
        /**
         * 서글 IE가 참으로 고맙게도 동작해주는 관계로.. 예외처리함.
         */
        if (Ext.isIE) {
            Ext.get('changeNextBtn')
                    .prev('.j_password').addClass('j_password_ie')
                    .prev('.email_btn').prev('.j_email').addClass('j_email_ie');
        }
        $('.quickFlip').quickFlip({panelWidth:256,panelHeight:192,removeStyle:true});
    });
</script>
<div id="slider">
    <div class="panel" id="panel_demo">
        <div class="inside">
            <img src="<c:url value="/images/main/demo-logo.png"/>"
                 alt="demo user"/>
            <div class="name_text">Demo User</div>
        </div>
        <div class="addition demo-addition">
            <input type="hidden" name="j_username" class="j_username" value="springsprout@springsprout.org">
            <input type="hidden" name="j_title" class="j_title" value="Demo User">
            <input type="password" name="j_password" class="j_password" readonly="true">
            <img class="nextbtn" src="<c:url value="/images/main/login.png"/>" title="Login!"/>
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
            <input type="input" id = "j_email" name="j_email" class="j_email" value="">
            <img id="email_btn" class="email_btn" src="<c:url value="/images/main/email-add.png"/>"
                 title="Email 기억 여부"/>
            <input type="password" name="j_password" class="j_password" value="">
            <img id="changeNextBtn" class="nextbtn" src="<c:url value="/images/main/login.png"/>" title="Login!"/>
        </div>
    </div>
    <div class="panel" id="panel_newuser">
        <div class="inside quickFlip">
            <div class="newuser">
                <img src="<c:url value="/images/main/newuser-logo.png"/>"
                     alt="new user"/>

                <div class="name_text" style="">New User</div>
            </div>
            <div class="signup">
                <dl>
                    <dt>
                        <label>E-mail address</label>
                    </dt>
                    <dd>
                        <input type="text" id= "j_username" name="j_username" class="j_username" value="">
                    </dd>
                    <dt>
                        <label>Password</label>
                    </dt>
                    <dd>
                        <input type="password" id="j_password" name="j_password" class="j_password" value="">
                    </dd>
                    <dt>
                        <label>Nickname</label>
                    </dt>
                    <dd>
                        <input type="text" id= "j_nickname" name="j_nickname" class="j_nickname" value="">
                    </dd>
                </dl>
            </div>
        </div>
        <div id ="new-addition" class="addition new-addition">
            <input type="hidden" name="j_username" class="j_username" value="사용자 추가를 하시겠습니까?">
            <input type="hidden" name="j_title" class="j_title" value="New User">
            <img id="noBtnImg" class="new_nobtn newbtn"
                 src="<c:url value="/images/main/no.png"/>" title="No"/>
            <img id="cancleBtnImg" class="new_cancle display newbtn"
                 src="<c:url value="/images/main/cancle.png"/>" title="Cancle"/>
            <img id="blankImg" class="new_blank"
                 src="<c:url value="/images/main/blank.png"/>" />
            <img id="yesBtnImg" class="new_yesbtn newbtn"
                 src="<c:url value="/images/main/yes.png"/>" title="Yes"/>
            <img id="signupBtnImg" class="new_signupbtn display newbtn"
                 src="<c:url value="/images/main/signup.png"/>" title="SignUp"/>
        </div>
    </div>

</div>
<div id="arrow">
    <img style="margin-right:50px" src="<c:url value="/images/main/icon-pre-arrow.gif"/>"/>
    <img src="<c:url value="/images/main/icon-next-arrow.gif"/>"/>
</div>
</body>
</html>