package springsprout.m31.module.app.timelog;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import springsprout.m31.domain.ThingVO;
import springsprout.m31.domain.TimeLogVO;
import springsprout.m31.module.app.timelog.support.TimeLogCri;
import springsprout.m31.service.security.SecurityService;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static springsprout.m31.common.M31System.JSON_VIEW;
import static springsprout.m31.utils.JSONHelper.getJsonTOList;

@Controller
@RequestMapping("/app/timelog/**")
public class TimeLogController {
    private static Logger logger = LoggerFactory.getLogger(TimeLogController.class);
    @Autowired
    private TimeLogService service;
    
    @Autowired
    SecurityService securityService;

    @RequestMapping("/app/timelog/thing/list")
    public ModelAndView getThingList() {

        List<ThingVO> list = service.getThingsByMember(securityService.getCurrentMemberId());
        return new ModelAndView(JSON_VIEW).addObject("items", list);
    }

    @RequestMapping("/app/timelog/thing/add")
    public ModelAndView addThing(String items) {
        List list = getJsonTOList(items, ThingVO.class);
        service.addThing(list);
        return new ModelAndView(JSON_VIEW).addObject("success", true).addObject("items", list);
    }
    
    @RequestMapping("/app/timelog/list")
    public ModelAndView getList(@RequestParam String regDate) {
        TimeLogCri cri = new TimeLogCri();
        if(regDate != null) {
            cri.setRegDate(regDate);
        } else {
            cri.setRegDate(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        }
        cri.setMemberID(securityService.getCurrentMemberId());

        List<TimeLogVO> list = service.getTimeLog(cri);

        return new ModelAndView(JSON_VIEW).addObject("items", list);
    }

    @RequestMapping("/app/timelog/add")
    public ModelAndView addLog(String items) {

        List list = getJsonTOList(items, TimeLogVO.class);
        service.addTiemLog(list);
        
        return new ModelAndView(JSON_VIEW).addObject("success", true).addObject("items", list);
    }
}
