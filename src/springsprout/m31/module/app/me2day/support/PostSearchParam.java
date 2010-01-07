package springsprout.m31.module.app.me2day.support;

public class PostSearchParam {
	
	private String id;
	private String post_id;
	private String scope;
	private String form;
	private String to;
	private int offset = 0;
	private int count = 10;
	private String fromapp;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	public String getPost_id() {
		return post_id;
	}
	public void setPost_id(String postId) {
		post_id = postId;
	}
	
	public String getScope() {
		return scope;
	}
	public void setScope(String scope) {
		this.scope = scope;
	}
	
	public String getForm() {
		return form;
	}
	public void setForm(String form) {
		this.form = form;
	}
	
	public String getTo() {
		return to;
	}
	public void setTo(String to) {
		this.to = to;
	}
	
	public int getOffset() {
		return offset;
	}
	public void setOffset(int offset) {
		this.offset = offset;
	}
	
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	
	public String getFromapp() {
		return fromapp;
	}
	public void setFromapp(String fromapp) {
		this.fromapp = fromapp;
	}

	/** 내글 볼거야? */
	private String myPostView;
	public String getMyPostView() {
		return myPostView;
	}
	public void setMyPostView(String myPostView) {
		this.myPostView = myPostView;
	}

	/** 친구글도 같이 볼것인가? */
	private String friendPostView;
	public String getFriendPostView() {
		return friendPostView;
	}
	public void setFriendPostView(String friendPostView) {
		this.friendPostView = friendPostView;
	}

	/** 덧글도 같이 볼것인가? */
	private String commentView;
	public String getCommentView() {
		return commentView;
	}
	public void setCommentView(String commentView) {
		this.commentView = commentView;
	}

	/** 글에 미투한 사람도 같이 볼것인가? */
	private boolean metooView;
	public boolean isMetooView() {
		return metooView;
	}
	public void setMetooView(boolean metooView) {
		this.metooView = metooView;
	}
	
}