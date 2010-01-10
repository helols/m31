package springsprout.m31.service.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.userdetails.UserDetails;

import springsprout.m31.domain.Member;
import springsprout.m31.domain.Role;
import springsprout.m31.module.app.me2day.entity.Me2DayUserInfo;
import springsprout.m31.module.app.twitter.support.TwitterAuthorizationDTO;
import twitter4j.Twitter;

@SuppressWarnings("serial")
public class SpringSproutUserDetail implements UserDetails {
	
	private Member member;
	private Me2DayUserInfo me2DayUserInfo;
	private List<GrantedAuthority> authorities;
	private TwitterAuthorizationDTO twitterToken;
	private Twitter twitter;

	public SpringSproutUserDetail(Member member) {
		this.member = member;
		List<Role> roles = member.getRoles();

		if(roles == null || roles.size() == 0) return;

		authorities = new ArrayList<GrantedAuthority>();

		for(Role role : roles){
			authorities.add(new GrantedAuthorityImpl("ROLE_" + role.getName().toUpperCase()));
		}
	}

	public List<GrantedAuthority> getAuthorities() {
		return authorities;
	}

	public String getPassword() {
		return member.getPassword();
	}

	public String getUsername() {
		return member.getEmail();
	}

	public boolean isAccountNonExpired() {
		return true;
	}

	public boolean isAccountNonLocked() {
		return true;
	}

	public boolean isCredentialsNonExpired() {
		return true;
	}

	public boolean isEnabled() {
		return true;
	}

	public Member getMember() {
		return member;
	}

	public Me2DayUserInfo getMe2DayUserInfo() {
		return me2DayUserInfo;
	}
	public void setMe2DayUserInfo(Me2DayUserInfo me2DayUserInfo) {
		this.me2DayUserInfo = me2DayUserInfo;
	}
	
	public TwitterAuthorizationDTO getTwitterToken() {
		return twitterToken;
	}

	public void setTwitterToken(TwitterAuthorizationDTO twitterToken) {
		this.twitterToken = twitterToken;
	}
	
	public Twitter getTwitter() {
		return twitter;
	}

	public void setTwitter(Twitter twitter) {
		this.twitter = twitter;
	}

}
