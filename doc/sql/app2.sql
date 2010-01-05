select * from application_info;

insert into application_info values (application_seq.nextval, 'springsee', '봄씨', '설명','Y');
insert into application_info values (application_seq.nextval, 'springme2day', '봄미투데이', 'me2day 의 openApi 를 통해서 위젯 서비스를 제공합니다.','Y');
insert into application_info values (application_seq.nextval, 'springplayer', '봄플레이어', '여러 검색 엔진의 OpenAPI를 활용하여, 동영상 검색 및 플레이어 서비스를 제공합니다.', 'Y')
insert into application_info values (application_seq.nextval, 'signout', 'SignOut', '봄 데스크탑에서 나갑니다.', 'Y',9999);
delete member_apps;

INSERT INTO MEMBER_APPS
SELECT (SELECT ID FROM MEMBER WHERE EMAIL = 'helolsjava@gmail.com') , ID , APP_DEFULT_YN from application_info;