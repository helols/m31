package springsprout.m31.service.security;

import springsprout.m31.domain.Member;

public interface SecurityService {

	public Member getCurrentMember();

	public Member getPersistentMember();

	public int getCurrentMemberId();

	public boolean isAdmin();

    public boolean isGuest();

	public boolean isCurrentUserOrAdmin(int id);
}