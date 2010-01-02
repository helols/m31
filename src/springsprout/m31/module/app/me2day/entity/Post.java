package springsprout.m31.module.app.me2day.entity;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.apache.commons.lang.time.FastDateFormat;


public class Post {
	
	private String requestUrl; 
	
	private String post_id;
	private String permalink;
	private String body;
	private String kind;
	private String icon;
	private String tagText;
	private String me2dayPage;
	private Date pubDate;
	private String pubDateText;
	private int commentsCount;
	private int metooCount;
	private boolean commentClosed;
	private String contentType;
	private String callbackUrl;
	private String iconUrl;
	private Author author;
	private Location location;
	
	private List<Tag> tags = Collections.emptyList();
	private List<Comment> comments = Collections.emptyList();
	private List<Metoo> metoos = Collections.emptyList();
	
	public String getRequestUrl() {
		return requestUrl;
	}
	public void setRequestUrl(String requestUrl) {
		this.requestUrl = requestUrl;
	}
	
	public String getPost_id() {
		return post_id;
	}
	public void setPost_id(String postId) {
		post_id = postId;
	}
	
	public String getPermalink() {
		return permalink;
	}
	public void setPermalink(String permalink) {
		this.permalink = permalink;
	}
	
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	
	public String getKind() {
		return kind;
	}
	public void setKind(String kind) {
		this.kind = kind;
	}
	
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	
	public String getTagText() {
		return tagText;
	}
	public void setTagText(String tagText) {
		this.tagText = tagText;
	}
	
	public String getMe2dayPage() {
		return me2dayPage;
	}
	public void setMe2dayPage(String me2dayPage) {
		this.me2dayPage = me2dayPage;
	}
	
	public Date getPubDate() {
		return pubDate;
	}
	public void setPubDate(Date pubDate) {
		this.pubDate = pubDate;
		if(pubDate != null){
			pubDateText = FastDateFormat.getInstance("yyyy/MM/dd hh:mm a", 
					TimeZone.getTimeZone("GMT+09:00"), Locale.ENGLISH).format(pubDate);
		}
	}
	public String getPubDateText() {
		return pubDateText;
	}
	
	public int getCommentsCount() {
		return commentsCount;
	}
	public void setCommentsCount(int commentsCount) {
		this.commentsCount = commentsCount;
	}
	
	public int getMetooCount() {
		return metooCount;
	}
	public void setMetooCount(int metooCount) {
		this.metooCount = metooCount;
	}
	
	public boolean isCommentClosed() {
		return commentClosed;
	}
	public void setCommentClosed(boolean commentClosed) {
		this.commentClosed = commentClosed;
	}
	
	public String getContentType() {
		return contentType;
	}
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	
	public String getCallbackUrl() {
		return callbackUrl;
	}
	public void setCallbackUrl(String callbackUrl) {
		this.callbackUrl = callbackUrl;
	}
	
	public String getIconUrl() {
		return iconUrl;
	}
	public void setIconUrl(String iconUrl) {
		this.iconUrl = iconUrl;
	}
	
	public Author getAuthor() {
		return author;
	}
	public void setAuthor(Author author) {
		this.author = author;
	}
	
	public Location getLocation() {
		return location;
	}
	public void setLocation(Location location) {
		this.location = location;
	}
	
	public List<Tag> getTags() {
		return tags;
	}
	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}
	
	public List<Comment> getComments() {
		return comments;
	}
	public void setComments(List<Comment> comments) {
		this.comments = comments;
	}
	
	public List<Metoo> getMetoos() {
		return metoos;
	}
	public void setMetoos(List<Metoo> metoos) {
		this.metoos = metoos;
	}
	
	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}
	
}
