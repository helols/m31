package springsprout.m31.module.app.me2day.entity;

import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.apache.commons.lang.time.FastDateFormat;

public class Comment {

	private String commentId;
	private String body;
	private Date pubDate;
	private String pubDateText;
	private Author author;
	private boolean remove;
	
	public String getCommentId() {
		return commentId;
	}
	public void setCommentId(String commentId) {
		this.commentId = commentId;
	}
	
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	
	public Date getPubDate() {
		return pubDate;
	}
	public void setPubDate(Date pubDate) {
		this.pubDate = pubDate;
		if(pubDate != null){
			int time = (int)(new Date().getTime() - pubDate.getTime());
			int day = time / 1000 / 60 / 60 / 24;
			if(day == 0){
				int hrs = time / 1000 / 60 / 60;
				if(hrs == 0){
					this.pubDateText = (time / 1000 / 60) + "분전";
				}
				else{
					this.pubDateText = hrs + "시간전";	
				}
			}
			else if(day == 1){
				this.pubDateText = "어제";
			}
			else{
				this.pubDateText = FastDateFormat.getInstance("yyyy/MM/dd", TimeZone.getTimeZone("GMT+09:00"), Locale.ENGLISH).format(pubDate);
			}
		}
	}
	public String getPubDateText() {
		return pubDateText;
	}
	
	public Author getAuthor() {
		return author;
	}
	public void setAuthor(Author author) {
		this.author = author;
	}
	
	/** 삭제권한이 있으면 true, 없으면 false */
	public boolean isRemove() {
		return remove;
	}
	public void setRemove(boolean delete) {
		this.remove = delete;
	}
	
	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}	

}
