<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <% request.setAttribute("cacheTime", System.currentTimeMillis());%>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Springsprout WEB DESKTOP</title>


    <link rel="stylesheet" type="text/css" href="<c:url value="/extJS/resources/css/ext-all.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/desktop/desktop.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/desktop/springdock.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/apps/miracle.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/apps/outsider.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/apps/helols.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/apps/arawn.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/themes/xtheme-vistaglass/css/xtheme-vistaglass.css"/>"/>
    <!--[if lt IE 7]>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/iehack.css"/>"/>
    <![endif]-->
    <!-- GC -->
    <!-- LIBS -->
    <script type="text/javascript" src="<c:url value="/js/framework/jQuery/jquery-1.3.2.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/adapter/jquery/ext-jquery-adapter-debug.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/ext-all-debug.js"/>"></script>
    <!-- ENDLIBS -->

    <script type="text/javascript" src="<c:url value="/extJS/plugin/miframe/miframe-debug.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/plugin/grid/RowExpander.js"/>"></script>

    <script type="text/javascript">
        Ext.ns("M31", "M31.dt", "M31.app", "M31.util");
        Ext.Ajax.defaultHeaders = {'AJAX': 'true'};
    </script>
    <script type="text/javascript" src="<c:url value="/js/common/utils.js"/>"></script>

    <script type="text/javascript" src="<c:url value="/js/plugin/reflection.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/js/desktop/SpringDock.js"/>"></script>
    <script type="text/javascript"
    src="<c:url value="/js/desktop/ApplicationRegistry.js"> <c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <script type="text/javascript" src="<c:url value="/js/desktop/WinManager.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/js/desktop/Module.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/js/desktop/Desktop.js"/>"></script>

    <script type="text/javascript">
        M31Desktop = new M31.Desktop({minHeight : 300,minWidth : 1000});
    </script>
    <!-- Miracle -->
    <script type="text/javascript" src="<c:url value="/js/application/miracle.js"/>"></script>
    <!-- Outsider -->
    <script type="text/javascript" src="<c:url value="/js/application/outsider.js"/>"></script>
    <!-- helols -->
    <script type="text/javascript" src="<c:url value="/js/application/helols.js"/>"></script>
    <!-- arawn -->
    <script type="text/javascript" src="<c:url value="/js/application/arawn.js"/>"></script>
</head>
<body id="body" scroll="no">
<%--<div id="loading-mask"></div>--%>
<%--<div id="loading">--%>
<%--<div class="loading-messge">--%>
<%--Loading...<br/>--%>
<%--<img src="../../images/ajax-loader.gif" width="220" height="19" style="margin-right:8px;" align="absmiddle"/>--%>
<%--</div>--%>
<%--</div>--%>
<script type="text/javascript">
    Ext.onReady(function(){
        M31.ApplicationRegistry.getInstance().loadApplicationStore();
    })
</script>
<div id="m31-desktop">
    <div id="m31-springdock">
        <div id="m31-springdock-container"></div>
    </div>
</div>

</body>
</html>