/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 18
 * Time: 오전 1:58:12
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.desktop;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import springsprout.m31.domain.Application;

import java.util.ArrayList;

@Service
public class DeskTopService {
    @Autowired
    DeskTopRepository deskTopRepository;

    /**
     * member id로 해당 유저의 applist 정보를 가져옵니다.
     * @param memberId
     * @return appList 정보.
     */
    public ArrayList<Application> getAppList(Integer memberId) {
        return deskTopRepository.getAppList(memberId);
    }
}
