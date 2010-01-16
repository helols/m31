package springsprout.m31.module.app.timelog;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.Date;

import static springsprout.m31.common.M31System.JSON_VIEW;

@Controller
@RequestMapping("/app/timelog/**")
public class TimeLogController {

    @RequestMapping(value = "/app/timelog/list", method= RequestMethod.GET)
    public ModelAndView getList(Date TimeLogDate) {
        return new ModelAndView(JSON_VIEW).addObject("key", "key");
    }

    @RequestMapping(value = "/app/timelog/thing", method= RequestMethod.GET)
    public ModelAndView getThingList() {
        return new ModelAndView(JSON_VIEW).addObject("key", "key");    
    }
}
