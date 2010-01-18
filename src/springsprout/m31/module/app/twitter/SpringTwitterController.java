package springsprout.m31.module.app.twitter;

import static springsprout.m31.common.M31System.JSON_VIEW;

import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import springsprout.m31.module.app.twitter.support.TwitterAuthorizationDTO;
import springsprout.m31.module.app.twitter.support.TwitterRequestParam;

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
@RequestMapping(value = "/app/twitter/*")
public class SpringTwitterController {

    Logger log = LoggerFactory.getLogger(getClass());
    @Autowired
    SpringTwitterAuthorization springTwitterAuthorization;
    @Autowired
    SpringTwitterService springTwitterService;
    
    @RequestMapping
    public ModelAndView requestAuthorization() {

        String authURL = "";
        String userScreenName = "";

        if (springTwitterAuthorization.checkAuthorization()) {
        	userScreenName = springTwitterAuthorization.getAuthorization();
            return new ModelAndView(JSON_VIEW).addObject("auth", true).addObject("success", true).addObject("userName", userScreenName);
        } else {
            authURL = springTwitterAuthorization.getAuthorizationURL();
            return new ModelAndView(JSON_VIEW).addObject("auth", false).addObject("success", true).addObject("authURL", authURL);
        }
    }
    
    @RequestMapping
    public String getAccessToken(@RequestParam String oauth_token, Model model) {

    	TwitterAuthorizationDTO authDTO = springTwitterAuthorization.storeAuthToken(oauth_token);
        
    	if (authDTO != null) {
        	model.addAttribute("success", true);
        	model.addAttribute("userName", authDTO.getScreen_name());
        } else {
        	model.addAttribute("success", false);
        	model.addAttribute("userName", "");
        }
        return "/springtwitter/getToken";
    }
    
    @RequestMapping
    public ModelAndView timeline(TwitterRequestParam twitterParam) {
    	HashMap<String,Object> twitterTimeline = springTwitterService.getTimeline(twitterParam);
        return new ModelAndView(JSON_VIEW).addObject("timeline", twitterTimeline.get("timeline"));
    }
    
    @RequestMapping
    public ModelAndView mentions(TwitterRequestParam twitterParam) {
    	HashMap<String,Object> twitterMentions = springTwitterService.getMentions(twitterParam);
    	return new ModelAndView(JSON_VIEW).addObject("mentions", twitterMentions.get("mentions"));
    }
    
    @RequestMapping
    public ModelAndView directMessages(TwitterRequestParam twitterParam) {
    	HashMap<String,Object> twitterDirectMessage = springTwitterService.getDirectMessages(twitterParam);
    	return new ModelAndView(JSON_VIEW).addObject("directMessages", twitterDirectMessage.get("directMessages"));
    }
    
    @RequestMapping
    public ModelAndView update(TwitterRequestParam twitterParam) {
    	Boolean result = springTwitterService.updateTweet(twitterParam);
    	return new ModelAndView(JSON_VIEW).addObject("success", result);
    }
    
}
