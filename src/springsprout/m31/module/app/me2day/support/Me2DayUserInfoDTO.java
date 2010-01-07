package springsprout.m31.module.app.me2day.support;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

public class Me2DayUserInfoDTO {
	
	/** 아이디 */
	private int member_id;	
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
	
	public String getMyPostView() {
		return "on".equals(myPostView) ? "Y" : "N";
	}
	public void setMyPostView(String myPostView) {
		this.myPostView = myPostView;
	}
	
	public String getFriendPostView() {
		return "on".equals(friendPostView) ? "Y" : "N";
	}
	public void setFriendPostView(String friendPostView) {
		this.friendPostView = friendPostView;
	}
	
	public String getCommentView() {
		return "on".equals(commentView) ? "Y" : "N";
	}
	public void setCommentView(String commentView) {
		this.commentView = commentView;
	}
	
	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}
	
}
