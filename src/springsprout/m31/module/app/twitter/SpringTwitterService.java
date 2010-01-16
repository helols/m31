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
import springsprout.m31.module.app.twitter.support.TwitterRequestParam;
import springsprout.m31.module.app.twitter.support.TwitterTweetDTO;
import springsprout.m31.service.security.SecurityService;
import twitter4j.DirectMessage;
import twitter4j.Paging;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;

@Service
@Transactional
public class SpringTwitterService {
	
	Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
    SecurityService securityService;
	
	public HashMap<String,Object> getTimeline(TwitterRequestParam twitterParam) {
		Twitter twitter = 	securityService.getTwitterObject();
		List<Status> statuses;
		
		Paging page = new Paging();
		page.count(twitterParam.getCount());
		page.setPage(twitterParam.getPageno());
		
		try {
			statuses = twitter.getHomeTimeline(page);
		} catch (TwitterException e) {
			throw new OpenApiReadException(e);
		}
		
		ArrayList<TwitterTweetDTO> timelineList = new ArrayList<TwitterTweetDTO>();
		HashMap<String,Object> timelineMap = new HashMap<String,Object>();
		
		for (Status status : statuses) {
			log.debug("Timeline>>> " + status.getId() + "/" + status.getUser().getName() + "/" + status.getUser().getScreenName() + "/" + status.getUser().getURL() + "/" + status.getText() + "/" + status.getCreatedAt() + "/" + status.getSource() + "/" + status.getInReplyToStatusId());
			log.debug("Timeline>>> " + twitter.getUserId());
			timelineList.add(
					new TwitterTweetDTO(
							status.getId()
							,status.getUser().getScreenName()
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
	
	public HashMap<String,Object> getMentions(TwitterRequestParam twitterParam) {
		Twitter twitter = 	securityService.getTwitterObject();
		List<Status> statuses;
		
		Paging page = new Paging();
		page.count(twitterParam.getCount());
		page.setPage(twitterParam.getPageno());
		
		try {
			statuses = twitter.getMentions(page);
		} catch (TwitterException e) {
			throw new OpenApiReadException(e);
		}
		
		ArrayList<TwitterTweetDTO> mentionsList = new ArrayList<TwitterTweetDTO>();
		HashMap<String,Object> mentionsMap = new HashMap<String,Object>();
		
		for (Status status : statuses) {
			log.debug("Mentions>>> " + status.getId() + "/" + status.getUser().getName() + "/" + status.getUser().getScreenName() + "/" + status.getUser().getURL() + "/" + status.getText() + "/" + status.getCreatedAt() + "/" + status.getSource() + "/" + status.getInReplyToStatusId());
			mentionsList.add(
					new TwitterTweetDTO(
							status.getId()
							,status.getUser().getScreenName()
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
	
	public HashMap<String,Object> getDirectMessages(TwitterRequestParam twitterParam) {
		Twitter twitter = 	securityService.getTwitterObject();
		List<DirectMessage> directMessages;
		
		Paging page = new Paging();
		page.count(twitterParam.getCount());
		page.setPage(twitterParam.getPageno());
		
		try {
			directMessages = twitter.getDirectMessages(page);
		} catch (TwitterException e) {
			throw new OpenApiReadException(e);
		}
		
		ArrayList<TwitterTweetDTO> directMessagesList = new ArrayList<TwitterTweetDTO>();
		HashMap<String,Object> directMessagesMap = new HashMap<String,Object>();
		
		for (DirectMessage directMessage : directMessages) {
			log.debug("Mentions>>> " + directMessage.getSenderScreenName() + "/" + directMessage.getSender().getURL() + "/" + directMessage.getText() + "/" + directMessage.getCreatedAt() + "/" + directMessage.getSender().getProfileImageURL());
			directMessagesList.add(
					new TwitterTweetDTO(
							directMessage.getId()
							,directMessage.getSenderScreenName()
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
	
	public Boolean updateTweet(TwitterRequestParam twitterParam) {
		Twitter twitter = 	securityService.getTwitterObject();
		Status status = null;
		
		log.debug("update>>> " + twitterParam.getStatusText());
		
		if (twitterParam.getReplyId() > 0) {
			try {
				status = twitter.updateStatus(twitterParam.getStatusText());
			} catch (TwitterException e) {
				throw new OpenApiReadException(e);
			}
		} else {
			try {
				status = twitter.updateStatus(twitterParam.getStatusText(), twitterParam.getReplyId());
			} catch (TwitterException e) {
				throw new OpenApiReadException(e);
			}
		}
		
		return true;
	}
}
