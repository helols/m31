<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>ExtTop - Desktop Sample App</title>

    <link rel="stylesheet" type="text/css" href="/extJS/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="/css/desktop/desktop.css" />

    <!-- GC -->
 	<!-- LIBS -->
    <script type="text/javascript" src="/js/framework/jQuery/jquery-1.3.2.js"></script>
 	<script type="text/javascript" src="/extJS/adapter/jquery/ext-jquery-adapter-debug.js"></script>
 	<!-- ENDLIBS -->

    <script type="text/javascript" src="/extJS/ext-all-debug.js"></script>

    <!-- DESKTOP -->
    <script type="text/javascript">
        Ext.ns("M31","M31.dt","M31.app");
    </script>
    <script type="text/javascript" src="/js/desktop/StartMenu.js"></script>
    <script type="text/javascript" src="/js/desktop/TaskBar.js"></script>
    <script type="text/javascript" src="/js/desktop/WinManager.js"></script>
    <script type="text/javascript" src="/js/desktop/Module.js"></script>
    <script type="text/javascript" src="/js/desktop/Desktop.js"></script>
    <script type="text/javascript" src="/js/desktop/sample.js"></script>

</head>
<body id="body" scroll="no">

<div id="x-desktop">
    <dl id="x-shortcuts">
        <dt id="grid-win-shortcut">
            <a href="#"><img src="/images/desktop/s.gif" />
            <div>Grid Window</div></a>
        </dt>
        <dt id="acc-win-shortcut">
            <a href="#"><img src="/images/desktop/s.gif" />
            <div>Accordion Window</div></a>
        </dt>
    </dl>
</div>

<div id="ux-taskbar">
	<div id="ux-taskbar-start"></div>
	<div id="ux-taskbuttons-panel"></div>
	<div class="x-clear"></div>
    <div id="ux-taskbar-tray"></div>
</div>

</body>
</html>
