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
import springsprout.m31.domain.DeskTopAdditionInfo;
import springsprout.m31.domain.Member;
import springsprout.m31.dto.SignupDTO;

import javax.annotation.PostConstruct;

@Repository
public class MemberRepository extends SqlMapClientDaoSupport{
    @Autowired
	private SqlMapClient sqlMapClient;

	@PostConstruct
	public void setSqlMapClient(){
		super.setSqlMapClient(this.sqlMapClient);
	}

    /**
     * email로 member 정보를 가져온다.
     * @param email
     * @return
     */
    public Member getMemberByEmail(String email){
        Object member  = getSqlMapClientTemplate().queryForObject("member.getMemberByEmail", email);
        if(member == null) return null;
        return getMemberRoles((Member)member);
    }

    /**
     * member ID로 member 정보를 가져온다.
     * @param id
     * @return
     */
    public Member getMemberById(Integer id) {
         Object member  = getSqlMapClientTemplate().queryForObject("member.getMemberById", id);
        if(member == null) return null;
        return getMemberRoles((Member)member);
    }

    /**
     * member에 해당하는 권한을 가져온다.
     * @param member
     * @return
     */
    @SuppressWarnings("unchecked")
    private Member getMemberRoles(Member member){
        if(member == null) {
            return member;
        }
        member.setRoles(getSqlMapClientTemplate().queryForList("member.getMemberRoles",member.getId()));
        return member;

    }

    /**
     * 가입을 시도한다.
     * @param signupDTO
     * @return // 새로 발생된 member Id
     */
    public Integer signup(SignupDTO signupDTO) {
        return (Integer)getSqlMapClientTemplate().insert("member.signup", signupDTO);
    }

    /**
     * 가입한 member에게 기본적으로 application을 인스톨 해준다.
     * @param memberId
     * @return
     */
    public Integer installApp(Integer memberId){
        return getSqlMapClientTemplate().update("member.installApp", memberId);
    }

    public void initDesktopAdditon(DeskTopAdditionInfo deskTopAdditionInfo) {
        getSqlMapClientTemplate().update("member.initDesktopAdditon", deskTopAdditionInfo);
    }
}
