CREATE TABLE M31.MEMBER 
(
	ID                   NUMBER PRIMARY KEY,
	USER_ID              VARCHAR2 (50),
	PASSWD               VARCHAR2 (256)
) ;

COMMENT ON TABLE M31.MEMBER IS 'member';


select * from member;