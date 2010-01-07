package springsprout.m31.service.security;

import springsprout.m31.domain.Member;
import springsprout.m31.module.app.me2day.entity.Me2DayUserInfo;

public interface SecurityService {

	public Member getCurrentMember();

	public Member getPersistentMember();

	public int getCurrentMemberId();
	
	public boolean isAdmin();

    public boolean isGuest();

	public boolean isCurrentUserOrAdmin(int id);
	
	public Me2DayUserInfo getCurrentMemberMe2DayUserInfo();
	
	public Me2DayUserInfo getPersistentMemberMe2DayUserInfo();
	
}