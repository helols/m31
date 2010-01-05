package springsprout.m31.service.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import springsprout.m31.domain.Member;
import springsprout.m31.domain.Role;
import springsprout.m31.module.member.MemberRepository;

@Service
@Transactional
public class DefaultSecurityService implements SecurityService {

	@Autowired
    MemberRepository memberRepository;

	public Member getCurrentMember() {
		if(SecurityContextHolder.getContext().getAuthentication() == null)
			return null;
		Object princial = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (princial instanceof UserDetails) {
			return ((SpringSproutUserDetail) princial).getMember();
		}
		else {
			return new NullMember();
		}
	}

	public Member getPersistentMember(){
		return memberRepository.getMemberById(getCurrentMember().getId());
	}

	public int getCurrentMemberId() {
		if(getCurrentMember() != null)
			return getCurrentMember().getId();
		return -1;
	}

	public boolean isAdmin() {
        if (hasRole("ADMIN")) return true;
		return false;
	}

    public boolean isGuest() {
        if (hasRole("GUEST")) return true;
        return false;
    }
    /**
     * role을 가지고 있는지... 확인한다.
     * @param roleName
     * @return
     */
    private boolean hasRole(String roleName) {
        for(Role role :getCurrentMember().getRoles()){
            if(roleName.equals(role.getName())){
                return true;
            }
        }
        return false;
    }

    public boolean isCurrentUserOrAdmin(int id) {
		if(!isCurrentMembersInfo(id) && !isAdmin())
			throw new AccessDeniedException("다른 회원의 정보에 접근을 시도할 경우 계정이 차단 됩니다.");
		return true;
	}
	
	private boolean isCurrentMembersInfo(int id) {
		return getCurrentMemberId() == id;
	}

	class NullMember extends Member {
		public NullMember() {
			setId(-1);
			setName("anonymous");
		}
		
		public boolean isAnonymous() {
			return true;
		}
	}
}
