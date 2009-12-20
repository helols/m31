/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 17
 * Time: 오후 5:56:02
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import springsprout.m31.module.app.OpenApiService;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import static springsprout.m31.common.M31System.ENCODING;
import static springsprout.m31.common.M31System.JSON_VIEW;

@Controller
public class OpenApiGateWay {
    Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    OpenApiService applicationService;

    @RequestMapping("/gateway/springsee/{search_type}")
    public ModelAndView springsee(@PathVariable String search_type, @RequestParam String query){
        try {
            query = URLDecoder.decode(query, ENCODING);
            log.debug("query!! ["+query+"]");
        } catch (UnsupportedEncodingException e) {
            log.error("/gateway/springsee/",e);
        }
        return new ModelAndView(JSON_VIEW).addObject("springsee",applicationService.springsee(search_type,query));
    }

    @RequestMapping("/gateway/springplayer")
    public ModelAndView springplayer(){

        return null;
    }

    @RequestMapping("/gateway/weathertray")
    public ModelAndView weathertray(){

        return null;
    }

}
