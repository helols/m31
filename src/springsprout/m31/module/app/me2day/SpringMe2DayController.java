package springsprout.m31.module.app.me2day;

import static springsprout.m31.common.M31System.JSON_VIEW;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import springsprout.m31.module.app.me2day.support.SpringMe2DayDTO;

@Controller
@RequestMapping(value="/app/me2day/*")
@SessionAttributes("sessionUserKey")
public class SpringMe2DayController {
	
	@Autowired SpringMe2DayApiService me2DayApiService;

	@RequestMapping
	public ModelAndView isLogin(SpringMe2DayDTO me2DayDTO, ModelMap modelMap) {
		ModelAndView mav = new ModelAndView(JSON_VIEW);
		
		String sessionUserKey = ObjectUtils.toString(modelMap.get("sessionUserKey"), "");
		if(StringUtils.hasText(sessionUserKey)){
			mav.addObject("state", true);
		}
		else{
			mav.addObject("authUrl", me2DayApiService.getAuthenticationUrl(me2DayDTO));
			mav.addObject("state", false);
		}
		
		return mav;
	}
	
}
