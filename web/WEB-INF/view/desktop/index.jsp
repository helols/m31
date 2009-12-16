<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>ExtTop - Desktop Sample App</title>

    <link rel="stylesheet" type="text/css" href="/extJS/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="/css/desktop/desktop.css" />
    <link rel="stylesheet" type="text/css" href="/css/app/miracle.css" />
    <link rel="stylesheet" type="text/css" href="/css/app/outsider.css" />
    <!--[if lt IE 7]>
        <link rel="stylesheet" type="text/css" href="/css/iehack.css"/>
    <![endif]-->
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

    <script type="text/javascript" src="/js/plugin/reflection.js"></script>
    
    <script type="text/javascript" src="/js/desktop/StartMenu.js"></script>
    <script type="text/javascript" src="/js/desktop/TaskBar.js"></script>
    <script type="text/javascript" src="/js/desktop/WinManager.js"></script>
    <script type="text/javascript" src="/js/desktop/Module.js"></script>
    <script type="text/javascript" src="/js/desktop/Desktop.js"></script>
    <script type="text/javascript" src="/js/desktop/sample.js"></script>
    
	<!-- Miracle -->
    <script type="text/javascript" src="/js/application/miracle.js"></script>
    
	<!-- Outsider -->
    <script type="text/javascript" src="/js/application/outsider.js"></script>


</head>
<body id="body" scroll="no">

<div id="ux-taskbar">
	<div id="ux-taskbar-start"></div>
	<div id="ux-taskbuttons-panel"></div>
	<div class="x-clear"></div>
    <div id="ux-taskbar-tray"></div>
</div>

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

</body>
</html>
