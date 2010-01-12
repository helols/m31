/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 12
 * Time: 오후 11:17:05
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.finder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import springsprout.m31.domain.FinderTree;
import springsprout.m31.service.security.SecurityService;

import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class FinderService {
    Logger log = LoggerFactory.getLogger(getClass());
    @Autowired
    FinderRepository finderRepository;
    @Autowired
    SecurityService securityService;

    @Transactional(readOnly = true)
    public List<FinderTree> getTree(Integer parentId){
        HashMap<String,Integer> conditionMap = new HashMap<String,Integer>();
        conditionMap.put("parentId",parentId);
        conditionMap.put("memberId",securityService.getCurrentMemberId());
        log.debug("conditionMap >> "+conditionMap);
        return finderRepository.getTree(conditionMap);
    }
}
