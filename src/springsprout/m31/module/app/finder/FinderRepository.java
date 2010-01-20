/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 12
 * Time: 오후 11:18:52
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.finder;

import com.ibatis.sqlmap.client.SqlMapClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;
import org.springframework.stereotype.Repository;
import springsprout.m31.domain.FinderFile;
import springsprout.m31.domain.FinderTree;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;

@Repository
public class FinderRepository  extends SqlMapClientDaoSupport {

	@Autowired
    SqlMapClient sqlMapClient;

	@PostConstruct
	public void setSqlMapClient(){
		super.setSqlMapClient(this.sqlMapClient);
	}

    @SuppressWarnings("unchecked")
    public List<FinderTree> getTree(HashMap<String, Integer> conditionMap) {
        return getSqlMapClientTemplate().queryForList("finder.getTree",conditionMap);
    }

    public List<FinderFile> getFiles(HashMap<String, Integer> conditionMap) {
        return getSqlMapClientTemplate().queryForList("finder.getFiles",conditionMap);
    }

    public Integer getParentNodeId(HashMap<String, Object> conditionMap) {
        return (Integer) getSqlMapClientTemplate().queryForObject("finder.getParentNodeId",conditionMap);
    }

    public void updateFile(FinderFile finderFile) {
        getSqlMapClientTemplate().update("finder.updateFile",finderFile);
    }

    public Integer insertFile(FinderFile finderFile) {
        return (Integer)getSqlMapClientTemplate().insert("finder.insertFile",finderFile);
    }

    public void deleteFile(HashMap<String, Object> finderFile) {
        getSqlMapClientTemplate().update("finder.deleteFile",finderFile);
    }
}
