/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 18
 * Time: 오전 2:04:54
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.desktop;

import com.ibatis.sqlmap.client.SqlMapClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;
import org.springframework.stereotype.Repository;
import springsprout.m31.domain.Application;

import javax.annotation.PostConstruct;
import java.util.ArrayList;

@Repository
public class DeskTopRepository extends SqlMapClientDaoSupport {

    @Autowired
	private SqlMapClient sqlMapClient;

	@PostConstruct
	public void setSqlMapClient(){
		super.setSqlMapClient(this.sqlMapClient);
	}

    @SuppressWarnings("unchecked")
    public ArrayList<Application> getAppList(String memberId) {
        return  (ArrayList<Application>)getSqlMapClientTemplate().queryForList("desktop.getAppList", memberId);
    }
}