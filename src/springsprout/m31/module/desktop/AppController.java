/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 18
 * Time: 오전 1:32:36
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.desktop;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import static springsprout.m31.common.M31System.JSON_VIEW;


@Controller
@RequestMapping("/application/*")
public class AppController {
    Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    DeskTopService deskTopService;
    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView list(){        
        return new ModelAndView(JSON_VIEW).addObject("appList",deskTopService.getAppList("helolsjava@gmail.com"));
    }
}
