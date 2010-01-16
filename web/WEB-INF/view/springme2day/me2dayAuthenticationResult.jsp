<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<link rel="stylesheet" type="text/css" href="<c:url value="/css/apps/arawn.css"/>"/>
<script type="text/javascript" src="<c:url value="/js/framework/jQuery/jquery-1.3.2.js"/>"></script>
<script type="text/javascript">
	$(document).ready(function(){
		console.log('springme2day-me2day-authentication-result');
		try{
			var auth = {
				'result': ${userInfo.result},
				'user_id': '${userInfo.user_id}',
				'myPostView': '${userInfo.myPostView}',
				'friendPostView': '${userInfo.friendPostView}',
				'commentView': '${userInfo.commentView}',
				'postIcons': '${postIcons}'
			}
			parent.getApp('springme2day').loginModule.me2DayAuthenticationComplete(auth);
		}
		catch(e){console.log(e);}
	});
</script>
<title>봄미투데이</title>
</head>
<body>
<table width='100%' height='100%'>
<c:if test="${userInfo.result == true}">
<tr>
<td align='center' valign='middle'>봄미투데이 인증을 수락하셨습니다.</td>
</tr>
</c:if>
<c:if test="${userInfo.result == false}">
<tr>
<td align='center' valign='middle'>봄미투데이 인증을 거절하셨습니다.</td>
</tr>
</c:if>
</table>
</body>
</html>