INSERT INTO application_info VALUES(APPLICATION_SEQ.nextval,'setting','setting','봄데탑의 환경을 설정한다.','Y');

insert into member_apps values(1,2,'Y');

desc member_apps;

select * from application_info;

INSERT INTO MEMBER_APPS
SELECT (SELECT ID FROM MEMBER WHERE EMAIL = 'helolsjava@gmail.com') , ID , APP_DEFULT_YN from application_info