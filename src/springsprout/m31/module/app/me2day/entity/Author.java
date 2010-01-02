package springsprout.m31.module.app.me2day.entity;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

/**
 * 미투데이 글 작성자 정보
 * @author arawn
 */
public class Author {
	
	private String id;
	private String nickname;
	private String face;
	private String me2dayHome;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	
	public String getMe2dayHome() {
		return me2dayHome;
	}
	public void setMe2dayHome(String me2dayHome) {
		this.me2dayHome = me2dayHome;
	}
	
	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}	
	
}
