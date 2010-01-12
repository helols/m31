package springsprout.m31.module.app.twitter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import springsprout.m31.common.OpenApiReadException;
import springsprout.m31.module.app.twitter.support.TwitterTweetDTO;
import springsprout.m31.service.security.SecurityService;
import twitter4j.DirectMessage;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;

@Service
@Transactional
public class SpringTwitterService {
	
	Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
    SecurityService securityService;
	
	public HashMap<String,Object> getTimeline() {
		Twitter twitter = 	securityService.getTwitterObject();
		List<Status> statuses;
		try {
			statuses = twitter.getFriendsTimeline();
		} catch (TwitterException e) {
			throw new OpenApiReadException(e);
		}
		
		ArrayList<TwitterTweetDTO> timelineList = new ArrayList<TwitterTweetDTO>();
		HashMap<String,Object> timelineMap = new HashMap<String,Object>();
		
		for (Status status : statuses) {
			log.debug("Timeline>>> " + status.getId() + "/" + status.getUser().getName() + "/" + status.getUser().getScreenName() + "/" + status.getUser().getURL() + "/" + status.getText() + "/" + status.getCreatedAt() + "/" + status.getSource());
			timelineList.add(
					new TwitterTweetDTO(
							status.getUser().getScreenName()
							,status.getUser().getURL()
							,status.getText()
							,status.getCreatedAt()
							,status.getUser().getProfileImageURL()
							,status.getSource())
			);
		}
		
		timelineMap.put("timeline",timelineList);
		
		return timelineMap;
	}
	
	public HashMap<String,Object> getMentions() {
		Twitter twitter = 	securityService.getTwitterObject();
		List<Status> statuses;
		try {
			statuses = twitter.getMentions();
		} catch (TwitterException e) {
			throw new OpenApiReadException(e);
		}
		
		ArrayList<TwitterTweetDTO> mentionsList = new ArrayList<TwitterTweetDTO>();
		HashMap<String,Object> mentionsMap = new HashMap<String,Object>();
		
		for (Status status : statuses) {
			log.debug("Mentions>>> " + status.getId() + "/" + status.getUser().getName() + "/" + status.getUser().getScreenName() + "/" + status.getUser().getURL() + "/" + status.getText() + "/" + status.getCreatedAt() + "/" + status.getSource());
			mentionsList.add(
					new TwitterTweetDTO(
							status.getUser().getScreenName()
							,status.getUser().getURL()
							,status.getText()
							,status.getCreatedAt()
							,status.getUser().getProfileImageURL()
							,status.getSource())
			);
		}
		
		mentionsMap.put("mentions",mentionsList);
		
		return mentionsMap;
	}
	
	public HashMap<String,Object> getDirectMessages() {
		Twitter twitter = 	securityService.getTwitterObject();
		List<DirectMessage> directMessages;
		try {
			directMessages = twitter.getDirectMessages();
		} catch (TwitterException e) {
			throw new OpenApiReadException(e);
		}
		
		ArrayList<TwitterTweetDTO> directMessagesList = new ArrayList<TwitterTweetDTO>();
		HashMap<String,Object> directMessagesMap = new HashMap<String,Object>();
		
		for (DirectMessage directMessage : directMessages) {
			log.debug("Mentions>>> " + directMessage.getSenderScreenName() + "/" + directMessage.getSender().getURL() + "/" + directMessage.getText() + "/" + directMessage.getCreatedAt() + "/" + directMessage.getSender().getProfileImageURL());
			directMessagesList.add(
					new TwitterTweetDTO(
							directMessage.getSenderScreenName()
							,directMessage.getSender().getURL()
							,directMessage.getText()
							,directMessage.getCreatedAt()
							,directMessage.getSender().getProfileImageURL()
							,"")
			);
		}
		
		directMessagesMap.put("directMessages",directMessagesList);
		
		return directMessagesMap;
	}
}
