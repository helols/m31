/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 8
 * Time: 오후 12:57:49
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.desktop;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/desktop/*")
public class desktopController {
    
    @RequestMapping(value="/desktop/view",method = RequestMethod.GET)
    public String view(){
        return "/desktop/index";
    }
}
