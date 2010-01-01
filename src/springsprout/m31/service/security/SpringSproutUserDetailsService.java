package springsprout.m31.service.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import springsprout.m31.domain.Member;
import springsprout.m31.module.member.MemberRepository;

@Service
@Transactional
public class SpringSproutUserDetailsService implements UserDetailsService {

	@Autowired
    MemberRepository mr;

	public UserDetails loadUserByUsername(String email)
			throws UsernameNotFoundException, DataAccessException {
		Member member = mr.getMemberByEmail(email);
		if(member == null)
			throw new UsernameNotFoundException(email + " 에 해당하는 사용자가 존재하지 않습니다.");
		return new SpringSproutUserDetail(member);
	}

}
