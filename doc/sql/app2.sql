select * from application_info;
insert into application_info values (application_seq.nextval, 'springsee', '봄씨', '설명','Y');
delete member_apps;
INSERT INTO MEMBER_APPS
SELECT (SELECT ID FROM MEMBER WHERE EMAIL = 'helolsjava@gmail.com') , ID , APP_DEFULT_YN from application_info;