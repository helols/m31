package springsprout.m31.service.security;

import springsprout.m31.domain.Member;
import springsprout.m31.module.app.me2day.entity.Me2DayUserInfo;
import springsprout.m31.module.app.twitter.support.TwitterAuthorizationDTO;
import twitter4j.Twitter;

public interface SecurityService {

	public Member getCurrentMember();

	public Member getPersistentMember();

	public int getCurrentMemberId();

    public String getCurrentMemberName();

	public boolean isAdmin();

    public boolean isGuest();

    public boolean isFirst();

    public void setFirst(String location);

	public boolean isCurrentUserOrAdmin(int id);
	
	public void setGuestMe2DayUserInfo(Me2DayUserInfo me2DayUserInfo);
	
	public Me2DayUserInfo getCurrentMemberMe2DayUserInfo();
	
	public Me2DayUserInfo getPersistentMemberMe2DayUserInfo();
	
	public TwitterAuthorizationDTO getTwitterAuthorizationToken();
	
	public TwitterAuthorizationDTO setTwitterAuthorizationToken(TwitterAuthorizationDTO taDTO);
	
	public Twitter getTwitterObject();
	
	public Twitter setTwitterObject(Twitter twitter);
	
}