package springsprout.m31.module.app.me2day.support;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

public class CommentDTO {

	private String post_id;
	private String body;
	
	public String getPost_id() {
		return post_id;
	}
	public void setPost_id(String postId) {
		post_id = postId;
	}

	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}

	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}	

}
