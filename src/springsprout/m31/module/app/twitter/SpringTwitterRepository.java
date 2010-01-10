package springsprout.m31.module.app.twitter;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;
import org.springframework.stereotype.Repository;

import springsprout.m31.module.app.twitter.support.TwitterAuthorizationDTO;

import com.ibatis.sqlmap.client.SqlMapClient;

@Repository
public class SpringTwitterRepository extends SqlMapClientDaoSupport {
	
	@Autowired SqlMapClient sqlMapClient;

	@PostConstruct
	public void setSqlMapClient(){
		super.setSqlMapClient(this.sqlMapClient);
	}
	
	public TwitterAuthorizationDTO getUserAuthTokenByMemberId(Integer member_id) {
		return (TwitterAuthorizationDTO)getSqlMapClientTemplate().queryForObject("twitter.getTwitterUserAuthTokenByMemberId", member_id);
	}
	
	public TwitterAuthorizationDTO insertUserAuthToken(TwitterAuthorizationDTO twitterAuthDTO) {
		getSqlMapClientTemplate().insert("twitter.insertTwitterUserAuthToken", twitterAuthDTO);
		return getUserAuthTokenByMemberId(twitterAuthDTO.getMember_id());
	}
}
