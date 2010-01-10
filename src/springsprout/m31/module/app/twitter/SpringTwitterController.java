package springsprout.m31.module.app.twitter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import static springsprout.m31.common.M31System.JSON_VIEW;

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

    @RequestMapping
    public ModelAndView requestAuthorization() {

        String authURL = "";

        if (springTwitterAuthorization.checkAuthorization()) {
            springTwitterAuthorization.getAuthorization();
            return new ModelAndView(JSON_VIEW).addObject("auth", true).addObject("success", true);
        } else {
            authURL = springTwitterAuthorization.getAuthorizationURL();
            return new ModelAndView(JSON_VIEW).addObject("auth", false).addObject("success", true).addObject("authURL", authURL);
        }
    }

    @RequestMapping(method = RequestMethod.GET)
    public String getAccessToken(@RequestParam String oauth_token, Model model) {
        Boolean result = false;
        result = springTwitterAuthorization.storeAuthToken(oauth_token);
        model.addAttribute("result", result);
        return "/springtwitter/getToken";
    }

    @RequestMapping
    public ModelAndView test() {
        return new ModelAndView(JSON_VIEW).addObject("success", true);
    }


}
