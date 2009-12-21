/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 7
 * Time: 오후 2:57:42
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.sandbox;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(value="/sandbox/*")
public class RESTfulTest {
    Logger log = LoggerFactory.getLogger(getClass());

    @RequestMapping(method = RequestMethod.GET)
    public String list(Model model){
        log.debug("RESTful GET!!");
        model.addAttribute("r_method","GET");
        return "/sandbox/restful";
    }

    @RequestMapping(method = RequestMethod.POST)
    public String create(Model model){
        log.debug("RESTful POST");
        model.addAttribute("r_method","POST");
        return "/sandbox/restful";
    }

    @RequestMapping(method = RequestMethod.PUT)
    public String update(Model model){
        log.debug("RESTful PUT");
        model.addAttribute("r_method","PUT");
        return "/sandbox/restful";
    }
    @RequestMapping(method = RequestMethod.DELETE)
    public String delete(Model model){
        log.debug("RESTful DELETE");
        model.addAttribute("r_method","DELETE");
        return "/sandbox/restful";
    }

    @RequestMapping(value="join",method = RequestMethod.GET)
    public String join(Model model){
        log.debug("RESTful join");
        model.addAttribute("r_method","join");
        return "/sandbox/join";
    }
    
    // 봄씨 테스트용
    @RequestMapping(value="images",method = RequestMethod.GET)
    public String images(Model model){
    	log.debug("RESTful images");
    	model.addAttribute("r_method","images");
    	return "/sandbox/images";
    }

    @RequestMapping(value="RESTfulTest",method = RequestMethod.GET)
    public String RESTfulTest(){
        return "/RESTfulTest";
    }
}