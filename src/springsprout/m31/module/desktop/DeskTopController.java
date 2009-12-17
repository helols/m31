/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 18
 * Time: 오전 3:07:42
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.desktop;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/desktop/*")
public class DeskTopController {
    @RequestMapping(value="/desktop/view",method = RequestMethod.GET)
    public String view(){
        return "/desktop/index";
    }
}
