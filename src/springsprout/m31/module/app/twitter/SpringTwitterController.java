package springsprout.m31.module.app.twitter;

import static springsprout.m31.common.M31System.JSON_VIEW;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import twitter4j.TwitterException;

/*
 * 
 * Consumer key
 * 		gwf70oR6DN1J0jNQmGeSQ
 * Consumer secret
 * 		4cYniE2TlosIqplbQGcmkcMtjLG2bFKCcrifemoIu2Q
 * Request token URL
 * 		http://twitter.com/oauth/request_token
 * Access token URL
 * 		http://twitter.com/oauth/access_token
 * Authorize URL
 * 		http://twitter.com/oauth/authorize
 * 
 */

@Controller
@RequestMapping(value="/app/twitter/*")
public class SpringTwitterController {
	
	Logger log = LoggerFactory.getLogger(getClass());
	
	private final String SpringTwitterUserSession = "springTwitterUserSession";
	
	@RequestMapping
	public ModelAndView requestAuthToTwitter() throws TwitterException {
	//public ModelAndView requestAuthToTwitter(@RequestParam String userName, @RequestParam String userPw) throws TwitterException {
//		log.debug("userName>>"+userName);// 개발때 확인용
//		log.debug("password>>"+userPw);// 개발때 확인용
		
		SpringTwitterAuthorization st = new SpringTwitterAuthorization();
		String authURL = st.getAuthorizationURL();
		
		
		return new ModelAndView(JSON_VIEW).addObject("success",true).addObject("authURL", authURL);
	}
	
	@RequestMapping
	public ModelAndView test() {
		return new ModelAndView(JSON_VIEW).addObject("success",true);
	}
	
	
}
