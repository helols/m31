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
    APP_DESC  VARCHAR2 (200) NOT NULL,
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

drop table api_info;
CREATE TABLE M31.API_INFO
(
	ID         NUMBER PRIMARY KEY,
	API_URL    VARCHAR2 (256),
	API_KEY    VARCHAR2 (50)
);
COMMENT ON TABLE M31.API_INFO IS 'API 관련정보 모음' ;
drop table api_target_info;
CREATE TABLE M31.API_TARGET_INFO
(
	API_TYPE   VARCHAR2 (20),
    API_OP     VARCHAR2 (30),
	API_TARGET VARCHAR2 (20),
	API_ID     NUMBER
);
COMMENT ON TABLE M31.API_TARGET_INFO IS 'API 종류 모음' ;


CREATE SEQUENCE M31.MEMBER_SEQ
INCREMENT BY 1 START WITH 1 NOMAXVALUE
MINVALUE 1 NOCYCLE CACHE 20 NOORDER ;


CREATE SEQUENCE M31.APPLICATION_SEQ
INCREMENT BY 1 START WITH 1 NOMAXVALUE
MINVALUE 1 NOCYCLE CACHE 20 NOORDER ;

CREATE SEQUENCE M31.API_SEQ
INCREMENT BY 1 START WITH 1 NOMAXVALUE
MINVALUE 1 NOCYCLE CACHE 20 NOORDER ;

insert into member values (member_seq.nextval , 'helolsjava@gmail.com','is윤군','abc');
select * from api_info;
insert into API_INFO values (api_seq.nextval ,  'http://apis.daum.net/search/OP_TARGET?apikey=OP_API_KEY&q=','d15e82f0b108d06e45ec70a9f7eec3aac3c0c61c');
insert into API_INFO values (api_seq.nextval ,  'http://openapi.naver.com/search?key=OP_API_KEY&target=OP_TARGET&q=','b020ac68a52b2089aae394e4ec7bff2d');
insert into API_INFO values (api_seq.nextval ,  'http://api.flickr.com/services/rest/?&method=OP_TARGET&api_key=OP_API_KEY&tags=','2852d069b0b45bf17cd976d07b2278ca');
insert into API_INFO values (api_seq.nextval ,  'http://ajax.googleapis.com/ajax/services/search/OP_TARGET?hl=ko&v=1.0&q=','');
insert into API_TARGET_INFO values ('IMAGE','FLICKR','image',21, 'JSON');
insert into API_TARGET_INFO values ('IMAGE','GOOGLE','images',22, 'JSON');
insert into API_TARGET_INFO values ('VIDEO','DAUM','vclip',5);
insert into API_TARGET_INFO values ('VIDEO','NAVER','video',6);
INSERT INTO API_TARGET_INFO VALUES('BOOK', 'NAVER', 'book', 6, 'RSS');

select
      ati.api_OP
    , replace(replace(ai.API_URL,'OP_TARGET',ati.API_TARGET),'OP_API_KEY', ai.api_key) as url
from API_TARGET_INFO ati
inner join api_info ai on ati.api_id = ai.id
where
ati.api_type= 'VIDEO'

