package springsprout.m31.module.app.me2day.entity;

import java.io.Serializable;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@SuppressWarnings("serial")
public class Me2DayUserInfo implements Serializable {
	
	/** 아이디 */
	private int member_id;
	/** 사용자 id */
	private String user_id;
	/** 사용자키 - 데스크탑 인증일 경우 */
	private String full_auth_token;
	/** 사용자키 - 웹 인증일 경우 */
	private String user_key;
	/** 인증용 토큰 - 웹 인증일 경우 */
	private String token;
	/** 웹인증결과 */
	private boolean result;
	/** 내글 볼거야? */
	private String myPostView;
	/** 친구글도 같이 볼것인가? */
	private String friendPostView;
	/** 덧글도 같이 볼것인가? */
	private String commentView;
	
	public int getMember_id() {
		return member_id;
	}
	public void setMember_id(int memberId) {
		member_id = memberId;
	}
	
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
	
	public String getUser_key() {
		return user_key;
	}
	public void setUser_key(String userKey) {
		user_key = userKey;
	}
	
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	public boolean isResult() {
		return result;
	}
	public void setResult(boolean result) {
		this.result = result;
	}
	
	public String getMyPostView() {
		return myPostView;
	}
	public void setMyPostView(String myPostView) {
		this.myPostView = myPostView;
	}
	
	public String getFriendPostView() {
		return friendPostView;
	}
	public void setFriendPostView(String friendPostView) {
		this.friendPostView = friendPostView;
	}
	
	public String getCommentView() {
		return commentView;
	}
	public void setCommentView(String commentView) {
		this.commentView = commentView;
	}
	
	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}
	
}
