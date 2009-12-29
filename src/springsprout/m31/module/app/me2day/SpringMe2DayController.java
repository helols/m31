package springsprout.m31.module.app.me2day;

import static springsprout.m31.common.M31System.JSON_VIEW;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import springsprout.m31.module.app.me2day.support.SpringMe2DayDTO;

@Controller
@RequestMapping(value="/app/me2day/*")
public class SpringMe2DayController {
	
	private final String SpringMe2DayUserSessionKey = "springMe2DayUserSession";
	
	@Autowired SpringMe2DayApiService me2DayApiService;

	@RequestMapping
	public ModelAndView isLogin(SpringMe2DayDTO me2DayDTO, HttpSession httpSession) {
		ModelAndView mav = new ModelAndView(JSON_VIEW);
		
		if(httpSession.getAttribute(SpringMe2DayUserSessionKey) == null){
			mav.addObject("authUrl", me2DayApiService.getAuthenticationUrl(me2DayDTO));
			mav.addObject("state", false);
		}
		else{
			mav.addObject("state", true);
			mav.addObject(httpSession.getAttribute(SpringMe2DayUserSessionKey));
		}
		
		return mav;
	}
	
	@RequestMapping
	public ModelAndView isAuthentication(SpringMe2DayDTO me2DayDTO, HttpSession httpSession) {
		httpSession.setAttribute(SpringMe2DayUserSessionKey, me2DayApiService.getAuthenticationResult(me2DayDTO));
		return new ModelAndView(JSON_VIEW).addObject(httpSession.getAttribute(SpringMe2DayUserSessionKey));
	}	
	
}
