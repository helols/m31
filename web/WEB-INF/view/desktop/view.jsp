<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <% request.setAttribute("cacheTime", System.currentTimeMillis());%>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Springsprout WEB DESKTOP</title>


    <link rel="stylesheet" type="text/css" href="<c:url value="/extJS/resources/css/ext-all.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/common.css"><c:param value="${cacheTime}" name="_c"/></c:url>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/framework/plugin/gritter.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/desktop/desktop.css"><c:param value="${cacheTime}" name="_c"/></c:url>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/desktop/springdock.css"><c:param value="${cacheTime}" name="_c"/></c:url>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/apps/miracle.css"><c:param value="${cacheTime}" name="_c"/></c:url>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/apps/outsider.css"><c:param value="${cacheTime}" name="_c"/></c:url>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/apps/helols.css"><c:param value="${cacheTime}" name="_c"/></c:url>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/apps/arawn.css"><c:param value="${cacheTime}" name="_c"/></c:url>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/themes/xtheme-vistablack/css/xtheme-vistablack.css"/>"/>
    <!--[if lt IE 7]>
    <link rel="stylesheet" type="text/css" href="<c:url value="/css/iehack.css"/>"/>
    <![endif]-->
    <!-- GC -->
    <!-- LIBS -->
    <script type="text/javascript" src="<c:url value="/js/framework/jQuery/jquery-1.3.2.min.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/adapter/jquery/ext-jquery-adapter.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/ext-all.js"/>"></script>
    <!-- ENDLIBS -->

    <script type="text/javascript" src="<c:url value="/extJS/plugin/miframe/miframe-debug.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/plugin/grid/RowExpander.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/plugin/ux/DataView-more.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/js/plugin/gritter.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/js/plugin/ZeroClipboard.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/js/plugin/progressbar.min.js"/>"></script>

    <script type="text/javascript" src="<c:url value="/js/common/utils.js?update=2010124"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <script type="text/javascript" src="<c:url value="/js/plugin/piroBox.1_2.js?update=2010124"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <script type="text/javascript" src="<c:url value="/extJS/plugin/ux/SearchField.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <script type="text/javascript" src="<c:url value="/js/desktop/SpringDock.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>

    <script type="text/javascript"
    src="<c:url value="/js/desktop/ApplicationRegistry.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <script type="text/javascript" src="<c:url value="/js/desktop/WinManager.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <script type="text/javascript" src="<c:url value="/js/desktop/Module.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <script type="text/javascript" src="<c:url value="/js/desktop/Desktop.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
</head>
<body id="body" scroll="no">
<div id="booting-mask"></div>
<div id="booting-view">
    <div class="booting-messge">
        <img class="logo" src="<c:url value="/images/desktop/booting.png"/>"><br/>
        <span class="progressBar" id="processbar"></span>
        <script type="text/javascript">
            $("#processbar").progressBar(10,{ barImage: '/images/desktop/progressbg_blue.png', showText: false , boxImage:Ext.BLANK_IMAGE_URL, width:420,height:10});
        </script>
    </div>
</div>
<div id="loading-mask"></div>
<div id="m31-desktop">
    <div id="m31-springdock">
        <div id="m31-springdock-container"></div>
    </div>
</div>
<script type="text/javascript">
        M31Desktop = new M31.Desktop({minHeight : 500,minWidth : 1000});
        ZeroClipboard.setMoviePath( '/js/plugin/ZeroClipboard.swf' );
    </script>
    <!-- Miracle -->
    <script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <script type="text/javascript">
       // Load the Visualization API and the piechart package.
        $("#processbar").progressBar(20);
        google.load('visualization', '1', {'packages':['piechart']});
    </script>
    <script type="text/javascript" src="<c:url value="/js/application/miracle.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <!-- Outsider -->
    <script type="text/javascript" src="<c:url value="/js/application/outsider.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <!-- helols -->

    <script type="text/javascript" src="<c:url value="/js/application/springfindertree.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <script type="text/javascript" src="<c:url value="/js/application/springfinderpanel.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <script type="text/javascript" src="<c:url value="/js/application/helols.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <!-- arawn -->
    <script type="text/javascript" src="<c:url value="/js/application/arawn.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <script type="text/javascript" src="<c:url value="/js/application/springguide.js"><c:param value="${cacheTime}" name="_c"/></c:url>"></script>
    <script type="text/javascript">
    Ext.onReady(function() {
        Ext.get(document.body).setStyle('background','#000 url(../../images/desktop/wallpapers/springsprout-disit.jpg) no-repeat top center');
        M31.ApplicationRegistry.getInstance().loadApplicationStore();
    });
</script>
</body>
</html>