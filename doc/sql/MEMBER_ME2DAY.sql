CREATE TABLE M31.MEMBER_ME2DAY
(
  MEMBER_ID         NUMBER,
  USER_ID           VARCHAR2(20 BYTE) NOT NULL,  
  USER_KEY          VARCHAR2(50 BYTE) NOT NULL,  
  MY_POST_VIEW      VARCHAR2(1 BYTE),
  FRIEND_POST_VIEW  VARCHAR2(1 BYTE),
  COMMENT_VIEW      VARCHAR2(1 BYTE)
);

COMMENT ON TABLE M31.MEMBER_ME2DAY IS '멤버의 미투데이 정보';
COMMENT ON COLUMN M31.MEMBER_ME2DAY.MEMBER_ID IS '사용자ID';
COMMENT ON COLUMN M31.MEMBER_ME2DAY.USER_ID IS '미투데이 사용자 아이디';
COMMENT ON COLUMN M31.MEMBER_ME2DAY.USER_KEY IS '미투데이 사용자 인증키';
COMMENT ON COLUMN M31.MEMBER_ME2DAY.MY_POST_VIEW IS '내글 보기설정(Y:보기, N:안보기)';
COMMENT ON COLUMN M31.MEMBER_ME2DAY.FRIEND_POST_VIEW IS '친구글 보기설정내글 보기설정';
COMMENT ON COLUMN M31.MEMBER_ME2DAY.COMMENT_VIEW IS '댓글 보기설정내글 보기설정';

ALTER TABLE M31.MEMBER_ME2DAY ADD (CONSTRAINT MEMBER_ME2DAY_PK PRIMARY KEY (MEMBER_ID));

-- ALTER TABLE M31.MEMBER_ME2DAY ADD (CONSTRAINT MEMBER_ME2DAY_R01 FOREIGN KEY (MEMBER_ID) REFERENCES M31.MEMBER (ID));
