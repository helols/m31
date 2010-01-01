/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 1
 * Time: 오후 3:02:18
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.main;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import springsprout.m31.module.member.MemberService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static springsprout.m31.common.M31System.JSON_VIEW;

@Controller
@RequestMapping("/login/*")
public class LoginController {

    @Autowired
    MemberService memberService;

    public ModelAndView loginSuccessProcess(HttpServletRequest req, HttpServletResponse res) {
//    	if(isAjaxLogin(req)){
        clearAJAXHeader(res);
        ModelMap model = new ModelMap();
        model.addAttribute("loginResult", "success");
        model.addAttribute("isGuest", isGuest());
        return new ModelAndView(JSON_VIEW).addObject("loginResult", "success").addObject("isGuest", isGuest());
//    	}
//    	return new ModelAndView("redirect:/mypage/index.do");
    }

    public ModelAndView loginFailProcess(HttpServletRequest req, HttpServletResponse res, HttpSession session) {
        Object obj = session.getAttribute("SPRING_SECURITY_LAST_EXCEPTION_KEY");
        if (obj != null) {
            if ("User is disabled".equals(((BadCredentialsException) obj).getMessage())) {
//    			return new ModelAndView("redirect:/signup_joinwait.do?email="+session.getAttribute("SPRING_SECURITY_LAST_USERNAME"));
                return new ModelAndView(JSON_VIEW).addObject("loginResult", "fail").addObject("joinwait", session.getAttribute("SPRING_SECURITY_LAST_USERNAME"));
            }
        }

        clearAJAXHeader(res);
        return new ModelAndView(JSON_VIEW).addObject("loginResult", "fail");

//    	return new ModelAndView("redirect:/login.do?loginFail=true");
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