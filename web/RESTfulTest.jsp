<%--
  Created by IntelliJ IDEA.
  User: helols
  Date: 2009. 12. 7
  Time: 오후 3:56:32
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
    <head><title>Simple jsp page</title>
    <script type="text/javascript" src="../js/framework/jQuery/jquery-1.3.2.js"></script>
 	<script type="text/javascript" src="../extJS/adapter/jquery/ext-jquery-adapter-debug.js"></script>
 	<!-- ENDLIBS -->

    <script type="text/javascript" src="../extJS/ext-all-debug.js"></script>
    </head>
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