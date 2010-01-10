package springsprout.m31.module.app.twitter.support;

public class TwitterAuthorizationDTO {
	private int member_id;
	private String token;
	private String secret_token;
	
	public int getMember_id() {
		return member_id;
	}
	public void setMember_id(int memberId) {
		member_id = memberId;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getSecret_token() {
		return secret_token;
	}
	public void setSecret_token(String secretToken) {
		secret_token = secretToken;
	}
}
