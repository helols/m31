CREATE TABLE M31.MEMBER_TWITTER
(
  MEMBER_ID         NUMBER,
  TOKEN           VARCHAR2(60 BYTE) NOT NULL,  
  SECRET_TOKEN          VARCHAR2(50 BYTE) NOT NULL
);

COMMENT ON TABLE M31.MEMBER_TWITTER IS '멤버의 트위터 정보';
COMMENT ON COLUMN M31.MEMBER_TWITTER.MEMBER_ID IS '사용자ID';
COMMENT ON COLUMN M31.MEMBER_TWITTER.TOKEN IS '트위터 인증토큰';
COMMENT ON COLUMN M31.MEMBER_TWITTER.SECRET_TOKEN IS '트위터 인증시크릿토큰';

ALTER TABLE M31.MEMBER_TWITTER ADD (CONSTRAINT MEMBER_TWITTER_PK PRIMARY KEY (MEMBER_ID));

-- ALTER TABLE M31.MEMBER_ME2DAY ADD (CONSTRAINT MEMBER_ME2DAY_R01 FOREIGN KEY (MEMBER_ID) REFERENCES M31.MEMBER (ID));