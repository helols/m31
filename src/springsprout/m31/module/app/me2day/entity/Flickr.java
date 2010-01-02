package springsprout.m31.module.app.me2day.entity;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

/**
 * 미투데이 사용자 정보(Person)의 필드값 중 하나
 * @author arawn
 */
public class Flickr {
	
	private String nsid;

	public String getNsid() {
		return nsid;
	}
	public void setNsid(String nsid) {
		this.nsid = nsid;
	}
	
	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}

}
