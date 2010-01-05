package springsprout.m31.service.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.userdetails.UserDetails;
import springsprout.m31.domain.Member;
import springsprout.m31.domain.Role;

import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("serial")
public class SpringSproutUserDetail implements UserDetails {
	
	private Member member;
	private List<GrantedAuthority> authorities;

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

}
