package springsprout.m31.module.app.timelog;

import com.ibatis.sqlmap.client.SqlMapClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;
import org.springframework.stereotype.Repository;
import springsprout.m31.domain.ThingVO;
import springsprout.m31.domain.TimeLogVO;
import springsprout.m31.module.app.timelog.support.TimeLogCri;

import javax.annotation.PostConstruct;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: Miracle
 * Date: 2010. 1. 16
 * Time: 오후 4:58:56
 * To change this template use File | Settings | File Templates.
 */

@Repository
public class TimeLogRepository extends SqlMapClientDaoSupport{
    @Autowired SqlMapClient sqlMapClient;

    @PostConstruct
	public void setSqlMapClient(){
		super.setSqlMapClient(this.sqlMapClient);
	}

    public List<ThingVO> getThingByMember(int memberId) {
        return getSqlMapClientTemplate().queryForList("timelog.getThingByMember", memberId);
    }

    public List<TimeLogVO> getTimeLog(TimeLogCri cri) {
        return getSqlMapClientTemplate().queryForList("timelog.getTimeLog", cri);
    }

    public void addTiemLog(TimeLogVO vo) {
        getSqlMapClientTemplate().insert("timelog.addTiemLog", vo);
    }

    public void addThing(ThingVO vo) {
        getSqlMapClientTemplate().insert("timelog.addThing", vo);
    }

    public int getEndThingID(int currentMemberId) {
        return (Integer)getSqlMapClientTemplate().queryForObject("timelog.getEndThingID", currentMemberId);
    }

    public List<TimeLogVO> getTimeLogAll(TimeLogCri cri) {
        return getSqlMapClientTemplate().queryForList("timelog.getTimeLogAll", cri);
    }
}
