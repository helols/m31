package springsprout.m31.module.app.twitter;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.User;
import twitter4j.http.AccessToken;
import twitter4j.http.RequestToken;

public class SpringTwitterAuthorization {
	
	Logger log = LoggerFactory.getLogger(getClass());
	
	private final String CONSUMER_KEY = "gwf70oR6DN1J0jNQmGeSQ";
	private final String CONSUMER_SECRET = "4cYniE2TlosIqplbQGcmkcMtjLG2bFKCcrifemoIu2Q";
	
	public String getAuthorizationURL() throws TwitterException {
		Twitter twitter = new Twitter();
		twitter.setOAuthConsumer(CONSUMER_KEY, CONSUMER_SECRET);
		RequestToken requestToken = twitter.getOAuthRequestToken();
		
//		String userToken = "mNFFhBcIvYSxvHg82QNImEsrihexfriXbUiUd3gM";
//		String userSecretToken = "P0sILcVd5ERJpeiIeJQrXAEmIQ7mqggC5134ATIM";
		String userToken = "7932892-t1WhGYBoUbuufGXqMP7F1H4xIvYDQFilSGZeZcJTbn";
		String userSecretToken = "ukpHS7Kw9DKDQxTvF76vehXxZNUenZ8rixxUyw7ANw";
		
		AccessToken accessToken = null;
		
		log.debug("auth token>1>>" + requestToken.getAuthorizationURL());
		log.debug("auth token>2>>" + requestToken.getToken());
		log.debug("auth token>3>>" + requestToken.getTokenSecret());
//		
		accessToken = twitter.getOAuthAccessToken(userToken, userSecretToken);
		twitter.setOAuthAccessToken(accessToken);
		
        log.debug("auth token>4>>" + accessToken.getToken());
		log.debug("auth token>5>>" + accessToken.getTokenSecret());


		
		int id = accessToken.getUserId();
		User user = twitter.showUser(id+"");
		String screenName = user.getScreenName();

		log.debug("screenname>> " + screenName);
		
		List<Status> statuses = twitter.getFriendsTimeline();
	    System.out.println("Showing friends timeline.");
	    for (Status status : statuses) {
	        System.out.println(status.getUser().getName() + ":" +
	                           status.getText());
	    }
		
		//accessToken = requestToken.getAccessToken();
		//log.debug("auth token>>>" + accessToken);
		
		return requestToken.getAuthorizationURL();
	}
}
