/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 17
 * Time: 오전 1:38:39
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.me2day;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;
import org.springframework.stereotype.Repository;

import springsprout.m31.module.app.me2day.entity.Me2DayUserInfo;
import springsprout.m31.module.app.me2day.support.Me2DayUserInfoDTO;

import com.ibatis.sqlmap.client.SqlMapClient;

@Repository
public class SpringMe2DayRepository extends SqlMapClientDaoSupport {
	
    @Autowired SqlMapClient sqlMapClient;

	@PostConstruct
	public void setSqlMapClient(){
		super.setSqlMapClient(this.sqlMapClient);
	}

    public Me2DayUserInfo getMe2DayUserInfoByMemberId(Integer member_id) {
        return (Me2DayUserInfo)getSqlMapClientTemplate().queryForObject("me2day.getMe2DayUserInfoByMemberId", member_id);
    }
    
    public Me2DayUserInfo updateMe2DayUserInfo(Me2DayUserInfoDTO userInfoDTO) {
    	getSqlMapClientTemplate().update("me2day.updateMe2DayUserInfo", userInfoDTO);
    	return getMe2DayUserInfoByMemberId(userInfoDTO.getMember_id());
    }

}
