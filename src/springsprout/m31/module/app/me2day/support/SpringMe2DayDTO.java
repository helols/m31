package springsprout.m31.module.app.me2day.support;

public class SpringMe2DayDTO {

	private String appKey;
	private String apiUrl;
	private String apiFormat;
	
	private String authToken;
	
	/** 미투데이 어플케이션 키 */
	public String getAppKey() {
		return appKey;
	}
	public void setAppKey(String appKey) {
		this.appKey = appKey;
	}
	
	/** 요청할 apiUrl */
	public String getApiUrl() {
		return apiUrl;
	}
	public void setApiUrl(String apiUrl) {
		this.apiUrl = apiUrl;
	}
	
	/** api 결과 방식(xml or json) */
	public void setApiFormat(String apiFormat) {
		this.apiFormat = apiFormat;
	}
	public String getApiFormat() {
		return apiFormat;
	}
	
	/** 인증 토큰 */
	public String getAuthToken() {
		return authToken;
	}
	public void setAuthToken(String authToken) {
		this.authToken = authToken;
	}
	
}
