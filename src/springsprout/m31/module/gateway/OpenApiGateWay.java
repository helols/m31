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
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import springsprout.m31.common.OpenApi;
import springsprout.m31.common.util.M31Utils;
import springsprout.m31.module.app.OpenApiService;

import static springsprout.m31.common.M31System.JSON_VIEW;

@Controller
public class OpenApiGateWay {
    Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    OpenApiService applicationService;
    @Autowired
    ConversionService conversionService;

    @RequestMapping("/gateway/springsee/{search_type}")
    public ModelAndView springsee(@PathVariable String search_type, @RequestParam String query, @RequestParam(defaultValue = "1") Integer pageNo){
        OpenApi openApiType = conversionService.convert(search_type.toUpperCase(),OpenApi.class);
        query = M31Utils.urlDecode(query);
        log.debug("search query"+query);

        return new ModelAndView(JSON_VIEW).addObject("springsee",applicationService.springsee(openApiType,query,pageNo));
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
