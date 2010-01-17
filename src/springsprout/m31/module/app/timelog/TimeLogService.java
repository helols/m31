package springsprout.m31.module.app.timelog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import springsprout.m31.domain.ThingVO;
import springsprout.m31.domain.TimeLogVO;
import springsprout.m31.module.app.timelog.support.TimeLogCri;
import springsprout.m31.service.security.SecurityService;

import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: Miracle
 * Date: 2010. 1. 16
 * Time: 오후 4:58:37
 * To change this template use File | Settings | File Templates.
 */

@Component
public class TimeLogService {

    @Autowired
    TimeLogRepository timeLogRepository;

    @Autowired
    SecurityService securityService;

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
}
