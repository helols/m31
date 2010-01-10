package springsprout.m31.module.app.twitter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import springsprout.m31.common.OpenApiReadException;
import springsprout.m31.module.app.twitter.support.TwitterAuthorizationDTO;
import springsprout.m31.service.security.SecurityService;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.http.AccessToken;
import twitter4j.http.RequestToken;

@Service
@Transactional
public class SpringTwitterAuthorization {

    Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    SpringTwitterRepository twitterRepository;
    @Autowired
    SecurityService securityService;

    private final String CONSUMER_KEY = "gwf70oR6DN1J0jNQmGeSQ";
    private final String CONSUMER_SECRET = "4cYniE2TlosIqplbQGcmkcMtjLG2bFKCcrifemoIu2Q";

    public Boolean checkAuthorization() {
        String userToken;
        String userSecretToken;

        TwitterAuthorizationDTO twitterAuthDTO = twitterRepository.getUserAuthTokenByMemberId(securityService.getCurrentMemberId());
        userToken = twitterAuthDTO.getToken();
        userSecretToken = twitterAuthDTO.getSecret_token();

        if (userToken.trim().equals("") || userToken == null || userSecretToken.trim().equals("") || userSecretToken == null) {
            return false;
        } else {
            return true;
        }
    }

    public String getAuthorizationURL() {
        Twitter twitter = new Twitter();
        twitter.setOAuthConsumer(CONSUMER_KEY, CONSUMER_SECRET);
        RequestToken requestToken = null;
        try {
            requestToken = twitter.getOAuthRequestToken();
        } catch (TwitterException e) {
            throw new OpenApiReadException(e);
        }

//		String userRequestToken = "mNFFhBcIvYSxvHg82QNImEsrihexfriXbUiUd3gM";
//		String userSecretToken = "P0sILcVd5ERJpeiIeJQrXAEmIQ7mqggC5134ATIM";
        TwitterAuthorizationDTO authDTO = new TwitterAuthorizationDTO();
        authDTO.setToken(requestToken.getToken());
        authDTO.setSecret_token(requestToken.getTokenSecret());

        securityService.setTwitterAuthorizationToken(authDTO);

        log.debug("redirect URL before Auth>>>" + requestToken.getAuthorizationURL());
        log.debug("token before Auth>>>" + requestToken.getToken());
        log.debug("secrettoken before Auth>>>" + requestToken.getTokenSecret());

        return requestToken.getAuthorizationURL();
    }

    public void getAuthorization() {
//		String userToken;
//		String userSecretToken;

        TwitterAuthorizationDTO twitterAuthDTO = new TwitterAuthorizationDTO();
        twitterAuthDTO = twitterRepository.getUserAuthTokenByMemberId(securityService.getCurrentMemberId());
        //테스트용 Token, Outsider계정
//		userToken = "7932892-t1WhGYBoUbuufGXqMP7F1H4xIvYDQFilSGZeZcJTbn";
//		userSecretToken = "ukpHS7Kw9DKDQxTvF76vehXxZNUenZ8rixxUyw7ANw";
//		userSecretToken = "Gut23fNxEsh60lpQNx46XiYg5iQH9h5zFEOecq5Oqc";

        Twitter twitter = new Twitter();
        twitter.setOAuthConsumer(CONSUMER_KEY, CONSUMER_SECRET);

        AccessToken accessToken = null;
        accessToken = new AccessToken(twitterAuthDTO.getToken(), twitterAuthDTO.getSecret_token());
        twitter.setOAuthAccessToken(accessToken);

        securityService.setTwitterObject(twitter);

        log.debug("token after Auth>>>" + accessToken.getToken());
        log.debug("secrettoken after Auth>>>" + accessToken.getTokenSecret());

//		int id = accessToken.getUserId();
//		User user = twitter.showUser(id+"");
//		String screenName = user.getScreenName();
//
//		log.debug("screenname>> " + screenName);
//		
//		List<Status> statuses = twitter.getFriendsTimeline();
//	    System.out.println("Showing friends timeline.");
//	    for (Status status : statuses) {
//	        System.out.println(status.getUser().getName() + ":" +
//	                           status.getText());
//	    }
    }

    public Boolean storeAuthToken(String oauthToken) {
        Twitter twitter = new Twitter();
        twitter.setOAuthConsumer(CONSUMER_KEY, CONSUMER_SECRET);

        TwitterAuthorizationDTO twitterAuthDTO = new TwitterAuthorizationDTO();
        securityService.getTwitterAuthorizationToken();

        twitterAuthDTO = securityService.getTwitterAuthorizationToken();
        ;

        AccessToken accessToken = null;

        log.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        log.debug("token from Session>>>" + twitterAuthDTO.getToken());
        log.debug("stoken from Session>>>" + twitterAuthDTO.getSecret_token());
        log.debug("receive Token from Twitter>>>" + oauthToken);

        if (twitterAuthDTO.getToken().equals(oauthToken)) {
            log.debug("same Token");
            try {
                accessToken = twitter.getOAuthAccessToken(oauthToken, twitterAuthDTO.getSecret_token());
            } catch (TwitterException e) {
                throw new OpenApiReadException(e);
            }
            twitter.setOAuthAccessToken(accessToken);

            // persist token
            TwitterAuthorizationDTO authDTO = new TwitterAuthorizationDTO();
            authDTO.setMember_id(securityService.getCurrentMemberId());
            authDTO.setToken(accessToken.getToken());
            authDTO.setSecret_token(accessToken.getTokenSecret());
            twitterRepository.insertUserAuthToken(authDTO);

            accessToken = new AccessToken(accessToken.getToken(), accessToken.getTokenSecret());
            twitter.setOAuthAccessToken(accessToken);

            log.debug("auth token>>>" + accessToken.getToken());
            log.debug("auth secrettoken>>>" + accessToken.getTokenSecret());

            securityService.setTwitterObject(twitter);

            return true;
        } else {
            log.debug("request token is not same.");
            return false;
        }
    }
}
