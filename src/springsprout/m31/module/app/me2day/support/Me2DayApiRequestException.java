package springsprout.m31.module.app.me2day.support;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

/**
 * 미투데이에서 api 결과값이 오류일때!
 * @author arawn
 */
public class Me2DayApiRequestException extends Exception {

	private static final long serialVersionUID = -2777349153681535012L;

	private int code;
	private String message;
	private String description;
	
	public Me2DayApiRequestException(){}
	
	public Me2DayApiRequestException(int code, String message){
		this.code = code;
		this.message = message;
	}
	
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	
	@Override
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}
	
}
