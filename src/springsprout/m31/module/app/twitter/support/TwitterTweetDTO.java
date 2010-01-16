package springsprout.m31.module.app.twitter.support;

import java.net.URL;
import java.util.Date;

public class TwitterTweetDTO {
	private long id;
	private String screenName;
	private URL url;
	private String text;
	private Date createAt;
	private URL profileImageUrl;
	private String source;
	
	public TwitterTweetDTO(long id, String screenName, URL url, String text, Date createAt, URL profileImageUrl, String source) {
		this.id = id;
		this.screenName = screenName;
		this.url = url;
		this.text = text;
		this.createAt = createAt;
		this.profileImageUrl = profileImageUrl;
		this.source = source;
	}
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getScreenName() {
		return screenName;
	}
	public void setScreenName(String screenName) {
		this.screenName = screenName;
	}
	public URL getUrl() {
		return url;
	}
	public void setUrl(URL url) {
		this.url = url;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Date getCreateAt() {
		return createAt;
	}
	public void setCreateAt(Date createAt) {
		this.createAt = createAt;
	}
	public URL getProfileImageUrl() {
		return profileImageUrl;
	}
	public void setProfileImageUrl(URL profileImageUrl) {
		this.profileImageUrl = profileImageUrl;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	
}
