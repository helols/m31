/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 1
 * Time: 오후 3:04:31
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import springsprout.m31.domain.DeskTopAdditionInfo;
import springsprout.m31.dto.SignupDTO;
import springsprout.m31.utils.MD5Util;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import static springsprout.m31.common.M31System.AVATAR_URL;

@Service
@Transactional
public class MemberService {

    @Autowired
    MemberRepository memberRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    /**
     * 가입 프로세스.
     * @param signupDTO
     * @return
     */
    public Boolean signup(SignupDTO signupDTO) {
        signupDTO.setJ_password(passwordEncoder.encodePassword(signupDTO.getJ_password(),null));
        Integer memberId =  memberRepository.signup(signupDTO);
        if(memberId > 0){
            DeskTopAdditionInfo deskTopAdditionInfo = new DeskTopAdditionInfo();
            deskTopAdditionInfo.setMemberId(memberId);
            deskTopAdditionInfo.setDeskTopThemeId("vistaglass");
            deskTopAdditionInfo.setDeskTopBKImgRepeat("nr");
            deskTopAdditionInfo.setDeskTopBKcolor("#FFF");
            deskTopAdditionInfo.setDeskTopBKImgSrc("../../images/desktop/wallpapers/springsprout-disit.jpg");
            deskTopAdditionInfo.setDeskTopBKImgPosition("tc");
            memberRepository.initDesktopAdditon(deskTopAdditionInfo);
            return memberRepository.installApp(memberId) >0?true:false;
        }
        return false;
    }

    @Transactional(readOnly=true)
    public Boolean isDuplicated(String email) {
		return memberRepository.getMemberByEmail(email) != null? true:false ;
	}

    public List<HashMap<String, String>> makeMemberInfo(String users) {
        List<HashMap<String,String>> userList = memberRepository.makeMemberInfo(Arrays.asList(users.split(";")));
        for(HashMap<String,String> userInfo : userList){
            userInfo.put("IMGSRC", AVATAR_URL+MD5Util.md5Hex(userInfo.get("EMAIL"))+ "?r=x&s=256");
        }
        return userList;
    }
}
