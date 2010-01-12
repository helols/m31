/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 12
 * Time: 오후 4:43:56
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.finder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static springsprout.m31.common.M31System.JSON_VIEW;

@Controller
@RequestMapping("/app/springfinder/*")
public class FinderController {
    @Autowired
    FinderService finderService;

    @SuppressWarnings("unchecked")
    @RequestMapping("/app/springfinder/getTree")
    public ModelAndView getTree(Integer node){
        if(node == null ||node == 0){
            List emptyList = new ArrayList();
            emptyList.add(new HashMap());
            return new ModelAndView(JSON_VIEW).addObject("treeList", emptyList);
        }
        return new ModelAndView(JSON_VIEW).addObject("treeList",finderService.getTree(node));
    }
}
