<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <% request.setAttribute("cacheTime", System.currentTimeMillis());%>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Springsprout WEB DESKTOP</title>


    <link rel="stylesheet" type="text/css" href="<c:url value="/css/apps/outsider.css"/>"/>
    <!-- LIBS -->
    <script type="text/javascript" src="<c:url value="/js/framework/jQuery/jquery-1.3.2.js"/>"></script>
    <!-- ENDLIBS -->
    
    <c:if test="${result}">
    <script type="text/javascript">
	    $(document).ready(function() {
	        opener.M31.ApplicationRegistry.getInstance().getApp('springtwitter').cardNavigation(2);
	    });
    </script>
    </c:if>

</head>
<body>
<c:choose>
    <c:when test="${result == true}">
        <div>인증완료 페이지 입니다.</div>
        <input type="button" onclick="self.close();">닫기</input>
    </c:when>
    <c:when test="${result == false}">
        <div>인증 실패</div>
    </c:when>
</c:choose>
</body>
</html>