/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 17
 * Time: 오전 1:38:39
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.member;

import com.ibatis.sqlmap.client.SqlMapClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;
import org.springframework.stereotype.Repository;
import springsprout.m31.domain.Member;
import springsprout.m31.domain.Role;

import javax.annotation.PostConstruct;

@Repository
public class MemberRepository extends SqlMapClientDaoSupport{
    @Autowired
	private SqlMapClient sqlMapClient;

	@PostConstruct
	public void setSqlMapClient(){
		super.setSqlMapClient(this.sqlMapClient);
	}

    public Member getMemberByEmail(String email){
        return (Member)getSqlMapClientTemplate().queryForObject("member.getMemberByEmail", email);
    }

    public Member getMemberById(Integer id) {
        return (Member)getSqlMapClientTemplate().queryForObject("member.getMemberById", id);
    }

    public Role getAdminRole() {
        return (Role)getSqlMapClientTemplate().queryForObject("member.getAdminRole");
    }
}
