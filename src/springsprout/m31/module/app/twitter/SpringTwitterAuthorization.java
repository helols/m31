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
        TwitterAuthorizationDTO twitterAuthDTO = twitterRepository.getUserAuthTokenByMemberId(securityService.getCurrentMemberId());
        if (twitterAuthDTO == null) {
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

        TwitterAuthorizationDTO authDTO = new TwitterAuthorizationDTO();
        authDTO.setToken(requestToken.getToken());
        authDTO.setSecret_token(requestToken.getTokenSecret());

        securityService.setTwitterAuthorizationToken(authDTO);

        log.debug("redirect URL before Auth>>>" + requestToken.getAuthorizationURL());
        log.debug("token before Auth>>>" + requestToken.getToken());
        log.debug("secrettoken before Auth>>>" + requestToken.getTokenSecret());

        return requestToken.getAuthorizationURL();
    }

    public String getAuthorization() {

        TwitterAuthorizationDTO twitterAuthDTO = new TwitterAuthorizationDTO();
        twitterAuthDTO = twitterRepository.getUserAuthTokenByMemberId(securityService.getCurrentMemberId());

        Twitter twitter = new Twitter();
        twitter.setOAuthConsumer(CONSUMER_KEY, CONSUMER_SECRET);

        AccessToken accessToken = null;
        accessToken = new AccessToken(twitterAuthDTO.getToken(), twitterAuthDTO.getSecret_token());
        twitter.setOAuthAccessToken(accessToken);

        securityService.setTwitterObject(twitter);

        log.debug("token after Auth>>>" + accessToken.getToken());
        log.debug("secrettoken after Auth>>>" + accessToken.getTokenSecret());
        
        return twitterAuthDTO.getScreen_name();
    }

    public TwitterAuthorizationDTO storeAuthToken(String oauthToken) {
        Twitter twitter = new Twitter();
        twitter.setOAuthConsumer(CONSUMER_KEY, CONSUMER_SECRET);

        TwitterAuthorizationDTO twitterAuthDTO = new TwitterAuthorizationDTO();
        securityService.getTwitterAuthorizationToken();

        twitterAuthDTO = securityService.getTwitterAuthorizationToken();

        AccessToken accessToken = null;

        log.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        log.debug("token from Session>>>" + twitterAuthDTO.getToken());
        log.debug("stoken from Session>>>" + twitterAuthDTO.getSecret_token());
        log.debug("receive Token from Twitter>>>" + oauthToken);
        
        TwitterAuthorizationDTO authDTO = null;

        if (twitterAuthDTO.getToken().equals(oauthToken)) {
            log.debug("same Token");
            try {
                accessToken = twitter.getOAuthAccessToken(oauthToken, twitterAuthDTO.getSecret_token());
            } catch (TwitterException e) {
                throw new OpenApiReadException(e);
            }
            twitter.setOAuthAccessToken(accessToken);
            
            // persist token
            authDTO = new TwitterAuthorizationDTO();
            authDTO.setMember_id(securityService.getCurrentMemberId());
            authDTO.setToken(accessToken.getToken());
            authDTO.setSecret_token(accessToken.getTokenSecret());
            authDTO.setScreen_name(accessToken.getScreenName());
            if(!securityService.isGuest()){
            	twitterRepository.insertUserAuthToken(authDTO);
            }

            accessToken = new AccessToken(accessToken.getToken(), accessToken.getTokenSecret());
            twitter.setOAuthAccessToken(accessToken);

            log.debug("auth token>>>" + accessToken.getToken());
            log.debug("auth secrettoken>>>" + accessToken.getTokenSecret());

            securityService.setTwitterObject(twitter);

            return authDTO;
        } else {
            log.debug("request token is not same.");
            return authDTO;
        }
    }
}
