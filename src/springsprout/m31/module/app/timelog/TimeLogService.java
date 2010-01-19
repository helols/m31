package springsprout.m31.module.app.timelog;

import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import springsprout.m31.domain.ThingVO;
import springsprout.m31.domain.TimeLogStatisticsVO;
import springsprout.m31.domain.TimeLogVO;
import springsprout.m31.module.app.timelog.support.TimeLogCri;
import springsprout.m31.service.security.SecurityService;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by IntelliJ IDEA.
 * User: Miracle
 * Date: 2010. 1. 16
 * Time: 오후 4:58:37
 * To change this template use File | Settings | File Templates.
 */

@Component
public class TimeLogService {

    private static Logger log = LoggerFactory.getLogger(TimeLogService.class);
    
    @Autowired
    private TimeLogRepository timeLogRepository;

    @Autowired
    private SecurityService securityService;
    private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public List<ThingVO> getThingsByMember(int memberID) {
        return timeLogRepository.getThingByMember(memberID);
    }

    public List<TimeLogVO> getTimeLog(TimeLogCri cri) {
        return timeLogRepository.getTimeLog(cri);
    }

    public void addTiemLog(List<TimeLogVO> list) {
        for(TimeLogVO vo : list) {
            vo.setMemberID(securityService.getCurrentMemberId());
            timeLogRepository.addTiemLog(vo);
        }
    }

    public void addThing(List<ThingVO> list) {
        for(ThingVO vo : list) {
            vo.setMemberID(securityService.getCurrentMemberId());
            timeLogRepository.addThing(vo);
        }
    }

    public List<TimeLogStatisticsVO> getstatisticalData(TimeLogCri cri) {
        List<TimeLogStatisticsVO> resultList = new ArrayList<TimeLogStatisticsVO>();

        List<TimeLogVO> list = timeLogRepository.getTimeLogAll(cri);
        int end = timeLogRepository.getEndThingID(cri.getMemberID());


        int size = list.size();

        if(size < 2) {
            return resultList;
        }

        Map<String, TimeLogStatisticsVO> map = new HashMap<String,  TimeLogStatisticsVO>();
        
        for(int i=1; i<size; i++) {
            TimeLogVO first = list.get(i-1);
            TimeLogVO second = list.get(i);

            if(first.getThingID() != end) {
                //소요한 시간 계산
                int duration = covert(first.getRegDate(), second.getRegDate());
                //log.debug(first.getThing() + "S -> " + first.getRegDate() + "E -> " + second.getThing() + " " +second.getRegDate() + " = " + duration);
                //Map에 등록
                String key = "key" + first.getThingID();
                if(map.containsKey(key)) {
                    TimeLogStatisticsVO timeLogStatisticsVO = map.get(key);
                    timeLogStatisticsVO.setTime(timeLogStatisticsVO.getTime()+duration);
                    //map.put(key, timeLogStatisticsVO);
                } else {
                    TimeLogStatisticsVO vo = new TimeLogStatisticsVO();
                    vo.setThing(first.getThing());
                    vo.setTime(duration);
                    map.put(key, vo);
                }
            }
        }

        Set<String> set = map.keySet();

        for(String key : set) {
            resultList.add(map.get(key));
        }

        return resultList;
    }

    public void endLog(int currentMemberId) {
        int endThingID = timeLogRepository.getEndThingID(currentMemberId);

        TimeLogVO vo = new TimeLogVO();
        vo.setMemberID(currentMemberId);
        vo.setThingID(endThingID);
        
        timeLogRepository.addTiemLog(vo);
    }

    private int covert(String start, String end) {
        try {
            Date startDate;
            Date endDate;

            synchronized (simpleDateFormat) {
                startDate = simpleDateFormat.parse(start);
                endDate = simpleDateFormat.parse(end);
            }

            return (int)((endDate.getTime() - startDate.getTime()) / 1000);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    public static void main(String args[]) {
        Map<String, Integer> map = new HashMap<String,  Integer>();
        map.put("일감", 3);
        map.put("등록", 4);

        System.out.println(JSONObject.fromObject(map).toString());
    }
}
