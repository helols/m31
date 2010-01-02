package springsprout.m31.module.app.me2day.entity;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

public class AuthenticationInfo {
	
	/** 사용자 id */
	private String user_id;
	/** 사용자키 */
	private String full_auth_token;
	
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String userId) {
		user_id = userId;
	}
	
	public String getFull_auth_token() {
		return full_auth_token;
	}
	public void setFull_auth_token(String fullAuthToken) {
		full_auth_token = fullAuthToken;
	}
	
	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}
	
}
