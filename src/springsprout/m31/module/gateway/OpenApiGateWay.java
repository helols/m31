/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 17
 * Time: 오후 5:56:02
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.gateway;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class OpenApiGateWay {

    @RequestMapping("/gateway/single")
    public ModelAndView singleRequest(){
        return null;
    }

}
