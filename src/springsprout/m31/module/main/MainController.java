/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 1
 * Time: 오후 3:02:18
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.main;

import static springsprout.m31.common.M31System.JSON_VIEW;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import springsprout.m31.dto.SignupDTO;
import springsprout.m31.module.main.support.SignupValidator;
import springsprout.m31.module.member.MemberService;
import springsprout.m31.service.security.SecurityService;

@Controller
public class MainController {
    Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    MemberService memberService;
    @Autowired
    SecurityService securityService;
    @Autowired
    SignupValidator signupValidator;

    @RequestMapping("/main/index")
    public String index(){
        return "/index";
    }

    @RequestMapping("/main/loginSuccessProcess")
    public ModelAndView loginSuccessProcess(HttpServletRequest req, HttpServletResponse res) {
        clearAJAXHeader(res);
        return new ModelAndView(JSON_VIEW).addObject("loginResult", "success").addObject("isGuest", securityService.isGuest());
    }

    @RequestMapping("/main/loginFailProcess")
    public ModelAndView loginFailProcess(HttpServletRequest req, HttpServletResponse res, HttpSession session) {
        log.debug("loginFailProcess");
        clearAJAXHeader(res);
        return new ModelAndView(JSON_VIEW).addObject("loginResult", "fail");
    }

    @RequestMapping(value="/main/signup",method= RequestMethod.POST)
    public ModelAndView signup(SignupDTO signupDTO, BindingResult result){
        signupValidator.validate(signupDTO, result);
        if (result.hasErrors()) {
			return new ModelAndView(JSON_VIEW).addObject("signstat","validate")
                    .addObject("errInfo",result.getFieldErrors());
		}
        Boolean signupStat =  memberService.signup(signupDTO);
        return new ModelAndView(JSON_VIEW).addObject("signstat", signupStat?"success":"fail");
    }

    @RequestMapping(value="/main/emailconfirm")
    public ModelAndView emailconfirm(String email){
        return new ModelAndView(JSON_VIEW).addObject("emailconfirm",memberService.isDuplicated(email));    
    }

    @RequestMapping(value="/main/makememberinfo")
    public ModelAndView makememberinfo(String users){
        if(users == null || !StringUtils.hasText(users)){
            return new ModelAndView(JSON_VIEW).addObject("status","fail");
        }
        return new ModelAndView(JSON_VIEW).addObject("status","success").addObject("userInfo",memberService.makeMemberInfo(users));
    }
    
    @RequestMapping("/app/springguide")
    public String springguide(){
        return "/springguide/contents";
    }    

    private boolean isAjaxLogin(HttpServletRequest req) {
        return (req.getHeader("AJAX") != null && req.getHeader("AJAX").equals("true"));
    }

//    @RequestMapping("/forgetpassword.do")
//    public String forgetPassword(){
//    	return "forget_password";
//    }
//
//    @RequestMapping(value="/forgetpassword.do", method= RequestMethod.POST)
//    public String forgetPassword(@RequestParam("email")String email, @RequestParam("name")String name,
//    		HttpSession session){
//    	Member member = memberService.getMemberByEmail(email);
//    	if(StringUtils.isEmpty(email) || member == null){
//    		session.setAttribute("SESSION_FLASH_MSG", "등록되어 있지 않은 메일 주소입니다.");
//    		return "forget_password";
//    	}
//    	if(!name.equals(member.getName())){
//    		session.setAttribute("SESSION_FLASH_MSG", "입력하신 정보가 맞지 않습니다.");
//    		return "forget_password";
//    	}
//    	memberService.makeNewPassword(member);
//		session.setAttribute("SESSION_FLASH_MSG", "이메일을 발송하였습니다.");
//    	return "redirect:/login.do";
//    }

    private String isGuest() {
        for (GrantedAuthority g : SecurityContextHolder.getContext().getAuthentication().getAuthorities()) {
            if (g.toString().equals("ROLE_GUEST")) return "true";
        }
        return "false";
    }

    private void clearAJAXHeader(HttpServletResponse res) {
        res.setHeader("AJAX", "");
    }
}