DROP TABLE M31.MEMBER;
CREATE TABLE M31.MEMBER 
(
	ID                   NUMBER PRIMARY KEY,
	EMAIL                VARCHAR2 (50),
	PASSWD               VARCHAR2 (256),
    NAME                 VARCHAR2 (50)
) ;

COMMENT ON TABLE M31.MEMBER IS 'member';

CREATE TABLE M31.APPLICATION_INFO 
(
	ID        NUMBER PRIMARY KEY,
	APP_ID    VARCHAR2 (30) UNIQUE,
	APP_NAME  VARCHAR2 (30) NOT NULL,
    APP_DESC  VARCHAR2 (30) NOT NULL,
    APP_DEFULT_YN VARCHAR2(1) DEFAULT 'N' NOT NULL 
);
COMMENT ON TABLE M31.APPLICATION_INFO IS 'APPLICATION INFO';


CREATE TABLE M31.MEMBER_APPS 
(
	MEMBER_ID NUMBER ,	
    APP_ID    NUMBER,
    INSTALL_YN VARCHAR2(1) NOT NULL 
);
COMMENT ON TABLE M31.MEMBER_APPS IS 'MEMBER APPLICATION MAPPING';

CREATE SEQUENCE M31.MEMBER_SEQ 
INCREMENT BY 1 START WITH 1 NOMAXVALUE
MINVALUE 1 NOCYCLE CACHE 20 NOORDER ;


CREATE SEQUENCE M31.APPLICATION_SEQ 
INCREMENT BY 1 START WITH 1 NOMAXVALUE
MINVALUE 1 NOCYCLE CACHE 20 NOORDER ;

insert into member values (member_seq.nextval , 'helolsjava@gmail.com','is����','abc');

