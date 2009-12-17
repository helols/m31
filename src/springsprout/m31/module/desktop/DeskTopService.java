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
    public ArrayList<Application> getAppList(String memberId) {
        return deskTopRepository.getAppList(memberId);
    }
}
