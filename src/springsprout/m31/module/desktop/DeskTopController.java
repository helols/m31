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
import org.springframework.web.servlet.ModelAndView;
import springsprout.m31.common.M31System;
import springsprout.m31.utils.MD5Util;

import static springsprout.m31.common.M31System.JSON_VIEW;

@Controller
@RequestMapping(value="/desktop/*")
public class DeskTopController {

    @RequestMapping(method = RequestMethod.GET)
    public String index(){
        return "/desktop/index";
    }

    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView initDeskTop(){
        String guestAvartarUrl = M31System.AVATAR_URL + MD5Util.md5Hex(M31System.GUEST_MAIL)+"?r=X&size=128";
        return new ModelAndView(JSON_VIEW).addObject("guestAvartarUrl", guestAvartarUrl);
    }
    @RequestMapping(method = RequestMethod.GET)
    public String view(){
        return "/desktop/view";
    }
}
