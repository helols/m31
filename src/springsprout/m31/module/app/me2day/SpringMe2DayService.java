/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 1
 * Time: 오후 3:04:31
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.me2day;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springsprout.m31.module.app.me2day.entity.Me2DayUserInfo;
import springsprout.m31.module.app.me2day.support.Me2DayUserInfoDTO;

@Service
public class SpringMe2DayService {
    
	@Autowired SpringMe2DayRepository me2DayRepository;
	
	public Me2DayUserInfo updateUserInfo(Me2DayUserInfoDTO userInfoDTO) {
		return me2DayRepository.updateMe2DayUserInfo(userInfoDTO);
	}
	
}
