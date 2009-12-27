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
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import springsprout.m31.common.OpenApi;
import springsprout.m31.dto.SpringPlayerCri;
import springsprout.m31.dto.SpringPlayerDTO;
import springsprout.m31.utils.OpenAPIEditor;

import java.util.HashMap;

import static springsprout.m31.common.M31System.JSON_VIEW;
import static springsprout.m31.utils.M31Utils.convert;

@Controller
public class OpenApiGateWay {
    Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    OpenApiService applicationService;

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(OpenApi.class, new OpenAPIEditor());
    }

    @RequestMapping("/gateway/springsee/search")
    public ModelAndView springsee(@RequestParam String search_type, @RequestParam String query, @RequestParam(defaultValue = "1") Integer pageNo){
        OpenApi openApiType = convert(search_type.toUpperCase());
        log.debug("encoding !! ["+System.getProperty("file.encoding")+"]"); // 개발때 확인용
        log.debug("search query>>"+query); // 개발때 확인용
        log.debug("openApiType>>"+openApiType);// 개발때 확인용 

        HashMap<String,Object> springsee = applicationService.springsee(openApiType,query,pageNo);
        return new ModelAndView(JSON_VIEW).addObject("totalCount",springsee.get("totalCount"))
                .addObject("imgInfo",springsee.get("imgInfo"));
    }

    @RequestMapping("/gateway/springplayer/search")
    public ModelAndView springplayer(SpringPlayerCri cri){
        log.debug("Criteria : {}",cri);        
        SpringPlayerDTO dto = applicationService.springPlayer(cri);

        /*
         * 이놈 마음에 안듬.. ^^
         */
        return new ModelAndView(JSON_VIEW)
                .addObject("total", dto.getTotal())
                .addObject("success", dto.isSuccess())
                .addObject("items", dto.getList());
    }

    @RequestMapping("/gateway/weathertray/search")
    public ModelAndView weathertray(){
        
        return null;
    }

}
