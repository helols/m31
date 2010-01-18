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
import springsprout.m31.domain.FinderFile;
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
        return finderRepository.getTree(makeConditionMap(parentId));
    }

    @Transactional(readOnly = true)
    public List<FinderFile> getFiles(Integer parentId) {
        return finderRepository.getFiles(makeConditionMap(parentId));
    }

    private HashMap<String,Integer> makeConditionMap(Integer parentId) {
        HashMap<String,Integer> conditionMap = new HashMap<String,Integer>();
        conditionMap.put("parentId",parentId);
        conditionMap.put("memberId",securityService.getCurrentMemberId());

        return conditionMap;
    }

    public Integer getParentNodeId(String parentNodeName) {
        HashMap<String,Object> conditionMap = new HashMap<String,Object>();
        conditionMap.put("link_app_id",parentNodeName.toLowerCase());
        conditionMap.put("memberId",securityService.getCurrentMemberId());

        return finderRepository.getParentNodeId(conditionMap);
    }

    public void renameFile(FinderFile finderFile) {
        finderRepository.updateFile(finderFile);
    }

    public void updateFile(List<FinderFile> finderFileList) {
        for(FinderFile finderFile : finderFileList){
            finderRepository.updateFile(finderFile);
        }
    }

    public void insertFile(List<FinderFile> finderFileList) {
        Integer memberId = securityService.getCurrentMemberId();
        for(FinderFile finderFile : finderFileList){
            finderFile.setMemberId(memberId);
            finderFile.setFileId(finderRepository.insertFile(finderFile));
            finderFile.setIconCls(finderFile.getIconCls()+"-"+finderFile.getLinkAppId());
        }
    }

    public void deleteFile(Object[] fileIds) {
        Integer memberId = securityService.getCurrentMemberId();
        for(Object fileId : fileIds){
            finderRepository.deleteFile(Integer.parseInt(fileId.toString()));
        }
    }
}
