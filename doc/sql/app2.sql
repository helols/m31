select * from application_info;

insert into application_info values (application_seq.nextval, 'springsee', '봄씨', '설명','Y');
insert into application_info values (application_seq.nextval, 'springme2day', '봄미투데이', 'me2day 의 openApi 를 통해서 위젯 서비스를 제공합니다.','Y');

delete member_apps;

INSERT INTO MEMBER_APPS
SELECT (SELECT ID FROM MEMBER WHERE EMAIL = 'helolsjava@gmail.com') , ID , APP_DEFULT_YN from application_info;