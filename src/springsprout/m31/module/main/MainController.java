/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 1
 * Time: 오후 3:02:18
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.main;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import springsprout.m31.module.member.MemberService;
import springsprout.m31.service.security.SecurityService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static springsprout.m31.common.M31System.JSON_VIEW;

@Controller
public class MainController {
    Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    MemberService memberService;
    @Autowired
    SecurityService securityService;

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