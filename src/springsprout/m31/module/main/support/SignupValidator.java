/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 10
 * Time: 오후 12:29:18
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.main.support;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import springsprout.m31.dto.SignupDTO;
import springsprout.m31.module.member.MemberService;

import java.util.regex.Pattern;

@Component
public class SignupValidator {
    @Autowired
    MemberService memberService;

    public void validate(SignupDTO signupDTO, Errors errors) {
        if (!StringUtils.hasLength(signupDTO.getJ_username())){
            errors.rejectValue("j_username", "required", "Email을 입력해주세요!!");
        }else if(!isEmail(signupDTO.getJ_username())) {
            errors.rejectValue("j_username", "required", signupDTO.getJ_username() + "은 email 형식에 맞지 않습니다.");
        }
        if (!StringUtils.hasLength(signupDTO.getJ_password())){
            errors.rejectValue("j_password", "required", "password를 입력해주세요!!");
        }
        if (!StringUtils.hasLength(signupDTO.getJ_nickname())) {
            errors.rejectValue("j_nickname", "required", "nickname을 입력해주세요!!");
        }
        if (memberService.isDuplicated(signupDTO.getJ_username())) {
            errors.rejectValue("j_username", "required", signupDTO.getJ_username() + "은 이미 가입되어 있습니다.(중복)");
        }
    }

    public static boolean isEmail(String email) {
        if (email==null) return false;
        boolean b = Pattern.matches(
            "[\\w\\~\\-\\.]+@[\\w\\~\\-]+(\\.[\\w\\~\\-]+)+",
            email.trim());
        return b;
    }
}
