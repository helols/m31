/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 12
 * Time: 오후 4:43:56
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.finder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import springsprout.m31.domain.FinderFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static springsprout.m31.common.M31System.JSON_VIEW;

@Controller
@RequestMapping("/app/springfinder/**")
public class FinderController {
    Logger log = LoggerFactory.getLogger(getClass());
    @Autowired
    FinderService finderService;

    @SuppressWarnings("unchecked")
    @RequestMapping("/app/springfinder/getTree")
    public ModelAndView getTree(Integer node) {
        if (node == null || node == 0) {
            List emptyList = new ArrayList();
            emptyList.add(new HashMap());
            return new ModelAndView(JSON_VIEW).addObject("treeList", emptyList);
        }
        return new ModelAndView(JSON_VIEW).addObject("treeList", finderService.getTree(node));
    }

    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/app/springfinder/getFiles", method= RequestMethod.POST)
    public ModelAndView getFiles(Integer parentNode, String parentNodeName) {
        if (parentNode == null || parentNode == 0 && parentNodeName == null) {
            List emptyList = new ArrayList();
            emptyList.add(new HashMap());
            return new ModelAndView(JSON_VIEW).addObject("fileList", emptyList);
        }else if(parentNodeName != null && StringUtils.hasText(parentNodeName)){
            parentNode = finderService.getParentNodeId(parentNodeName);
        }

        return new ModelAndView(JSON_VIEW).addObject("fileList", finderService.getFiles(parentNode));
    }

    @RequestMapping(value = "/app/springfinder/insertFile", method= RequestMethod.POST)
    public ModelAndView insertFile(String fileList){
        return new ModelAndView(JSON_VIEW).addObject("fileList", "");
    }

    @RequestMapping(value = "/app/springfinder/updateFile", method= RequestMethod.POST)
    public ModelAndView updateFile(String fileList){
        log.debug("fileList"+fileList);
        return new ModelAndView(JSON_VIEW).addObject("fileList", "").addObject("success",true);
    }


    @RequestMapping(value = "/app/springfinder/deleteFile", method= RequestMethod.POST)
    public ModelAndView deleteFile(String fileList){
        return new ModelAndView(JSON_VIEW).addObject("fileList", "");
    }

    @RequestMapping(value = "/app/springfinder/renameFile", method = RequestMethod.POST)
    public ModelAndView renameFile(FinderFile finderFile){
        if(finderFile.getFileName() == null || !StringUtils.hasText(finderFile.getFileName())){
            return new ModelAndView(JSON_VIEW).addObject("success",true).addObject("msg","폴더명이 없습니다.");
        }
        finderService.renameFile(finderFile);
        return new ModelAndView(JSON_VIEW).addObject("success",true).addObject("msg","폴더명이 변경되었습니다.");
    }
}
