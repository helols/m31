/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 9:44:31
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app;

import com.ibatis.sqlmap.client.SqlMapClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.List;

@Repository
public class OpenApiRepository extends SqlMapClientDaoSupport {
    @Autowired
    private SqlMapClient sqlMapClient;

    @PostConstruct
    public void setSqlMapClient() {
        super.setSqlMapClient(this.sqlMapClient);
    }

    public List initAPIInfo(){
        return getSqlMapClientTemplate().queryForList("openapi.initapiinfo");
    }
}

