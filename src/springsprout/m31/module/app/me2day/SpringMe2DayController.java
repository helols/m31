package springsprout.m31.module.app.me2day;

import static springsprout.m31.common.M31System.JSON_VIEW;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import springsprout.m31.module.app.me2day.support.SpringMe2DayDTO;

@Controller
@RequestMapping(value="/app/me2day/*")
@SessionAttributes("springMe2DaySession")
public class SpringMe2DayController {
	
	@Autowired SpringMe2DayApiService me2DayApiService;

	@RequestMapping
	public ModelAndView isLogin(SpringMe2DayDTO me2DayDTO, ModelMap modelMap) {
		ModelAndView mav = new ModelAndView(JSON_VIEW);
		
		if(modelMap.get("springMe2DaySession") != null){
			mav.addObject("state", true);
		}
		else{
			mav.addObject("authUrl", me2DayApiService.getAuthenticationUrl(me2DayDTO));
			mav.addObject("state", false);
		}
		
		return mav;
	}
	
	@RequestMapping
	public ModelAndView isAuthentication(SpringMe2DayDTO me2DayDTO) {
		return new ModelAndView(JSON_VIEW).addObject("springMe2DaySession", me2DayApiService.getAuthenticationResult(me2DayDTO));
	}	
	
}
