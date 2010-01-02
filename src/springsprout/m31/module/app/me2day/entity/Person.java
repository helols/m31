package springsprout.m31.module.app.me2day.entity;

import java.util.List;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

public class Person {
	
	private String id;
	private String openid;
	private String nickname;
	private String face;
	private String description;
	private String homepage;
	private String email;
	private String cellphone;
	private String messenger;
	private Location location;
	private String me2dayHome;
	private String rssDaily;
	private String invitedBy;
	private int friendsCount;
	private String updated;
	private List<PostIcon> postIcons;
	private Flickr flickr;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getOpenid() {
		return openid;
	}
	public void setOpenid(String openid) {
		this.openid = openid;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public String getFace() {
		return face;
	}
	public void setFace(String face) {
		this.face = face;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getHomepage() {
		return homepage;
	}
	public void setHomepage(String homepage) {
		this.homepage = homepage;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getCellphone() {
		return cellphone;
	}
	public void setCellphone(String cellphone) {
		this.cellphone = cellphone;
	}
	public String getMessenger() {
		return messenger;
	}
	public void setMessenger(String messenger) {
		this.messenger = messenger;
	}
	public Location getLocation() {
		return location;
	}
	public void setLocation(Location location) {
		this.location = location;
	}
	public String getMe2dayHome() {
		return me2dayHome;
	}
	public void setMe2dayHome(String me2dayHome) {
		this.me2dayHome = me2dayHome;
	}
	public String getRssDaily() {
		return rssDaily;
	}
	public void setRssDaily(String rssDaily) {
		this.rssDaily = rssDaily;
	}
	public String getInvitedBy() {
		return invitedBy;
	}
	public void setInvitedBy(String invitedBy) {
		this.invitedBy = invitedBy;
	}
	public int getFriendsCount() {
		return friendsCount;
	}
	public void setFriendsCount(int friendsCount) {
		this.friendsCount = friendsCount;
	}
	public String getUpdated() {
		return updated;
	}
	public void setUpdated(String updated) {
		this.updated = updated;
	}
	public List<PostIcon> getPostIcons() {
		return postIcons;
	}
	public void setPostIcons(List<PostIcon> postIcons) {
		this.postIcons = postIcons;
	}
	public Flickr getFlickr() {
		return flickr;
	}
	public void setFlickr(Flickr flickr) {
		this.flickr = flickr;
	}
	
	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}
	
	
}
