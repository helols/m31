package springsprout.m31.service.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import springsprout.m31.domain.Member;
import springsprout.m31.domain.Role;
import springsprout.m31.module.app.me2day.SpringMe2DayRepository;
import springsprout.m31.module.app.me2day.entity.Me2DayUserInfo;
import springsprout.m31.module.app.twitter.support.TwitterAuthorizationDTO;
import springsprout.m31.module.member.MemberRepository;
import twitter4j.Twitter;

@Service
@Transactional
public class DefaultSecurityService implements SecurityService {

	@Autowired MemberRepository memberRepository;
	
	@Autowired SpringMe2DayRepository me2DayRepository;

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
	
	public void setGuestMe2DayUserInfo(Me2DayUserInfo me2DayUserInfo) {
		if(SecurityContextHolder.getContext().getAuthentication() == null) return;
		Object princial = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (princial instanceof SpringSproutUserDetail) {
			((SpringSproutUserDetail) princial).setMe2DayUserInfo(me2DayUserInfo);
		}
	}	

	public Me2DayUserInfo getCurrentMemberMe2DayUserInfo() {
		if(SecurityContextHolder.getContext().getAuthentication() == null) return null;
		Object princial = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (princial instanceof SpringSproutUserDetail) {
			return ((SpringSproutUserDetail) princial).getMe2DayUserInfo();
		}
		return null;
	}

	@Override
	public Me2DayUserInfo getPersistentMemberMe2DayUserInfo() {
		if(SecurityContextHolder.getContext().getAuthentication() == null) return null;
		Object princial = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (princial instanceof SpringSproutUserDetail) {
			((SpringSproutUserDetail) princial).setMe2DayUserInfo(
					me2DayRepository.getMe2DayUserInfoByMemberId(getCurrentMemberId())
			);
			return ((SpringSproutUserDetail) princial).getMe2DayUserInfo();
		}
		return null;
	}
	
	public TwitterAuthorizationDTO getTwitterAuthorizationToken() {
		if(SecurityContextHolder.getContext().getAuthentication() == null) return null;
		Object princial = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (princial instanceof SpringSproutUserDetail) {
			return ((SpringSproutUserDetail) princial).getTwitterToken();
		}
		return null;
	}
	
	public TwitterAuthorizationDTO setTwitterAuthorizationToken(TwitterAuthorizationDTO twitterAuthDTO) {
		if(SecurityContextHolder.getContext().getAuthentication() == null) return null;
		Object princial = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (princial instanceof SpringSproutUserDetail) {
			((SpringSproutUserDetail) princial).setTwitterToken(twitterAuthDTO);
			return ((SpringSproutUserDetail) princial).getTwitterToken();
		}
		return null;
	}
	
	public Twitter getTwitterObject() {
		if(SecurityContextHolder.getContext().getAuthentication() == null) return null;
		Object princial = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (princial instanceof SpringSproutUserDetail) {
			return ((SpringSproutUserDetail) princial).getTwitter();
		}
		return null;
	}
	
	public Twitter setTwitterObject(Twitter twitter) {
		if(SecurityContextHolder.getContext().getAuthentication() == null) return null;
		Object princial = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (princial instanceof SpringSproutUserDetail) {
			((SpringSproutUserDetail) princial).setTwitter(twitter);
			return ((SpringSproutUserDetail) princial).getTwitter();
		}
		return null;
	}

}
