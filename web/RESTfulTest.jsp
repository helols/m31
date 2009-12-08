<%--
  Created by IntelliJ IDEA.
  User: helols
  Date: 2009. 12. 7
  Time: 오후 3:56:32
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
    <head><title>Simple jsp page</title></head>
    <body>
        RESTful Test page <br/>

        <a href="/sandbox/get?id=1">get Test</a> <br/>
        <form action="/sandbox/post" method="post">
            <input type="submit"/>
        </form>
        <form action="/sandbox/put" method="post">
            <input type="text" name = "_method" value="put">
            <input type="submit"/>
        </form>
        <form action="/sandbox/delete" method="post">
            <input type="text" name = "_method" value="delete">
            <input type="submit"/>
        </form>

    </body>
</html>