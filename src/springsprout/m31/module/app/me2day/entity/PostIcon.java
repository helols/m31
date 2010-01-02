package springsprout.m31.module.app.me2day.entity;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

/**
 * 미투데이 사용자 정보(Person)의 필드값 중 하나로 글쓰기에 사용가능한 아이콘 목록
 * @author arawn
 */
public class PostIcon {

	private int iconIndex;
	private int iconType;
	private String url;
	private String description;
	private boolean defaultv;
	
	public int getIconIndex() {
		return iconIndex;
	}
	public void setIconIndex(int iconIndex) {
		this.iconIndex = iconIndex;
	}
	
	public int getIconType() {
		return iconType;
	}
	public void setIconType(int iconType) {
		this.iconType = iconType;
	}
	
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public boolean isDefaultv() {
		return defaultv;
	}
	public void setDefaultv(boolean defaultv) {
		this.defaultv = defaultv;
	}
	
	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}
	
}
