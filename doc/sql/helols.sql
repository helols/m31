select * from member;
insert into application_info values (application_seq.nextval, 'signout', 'SignOut', '봄 데스크탑에서 나갑니다.', 'Y',9999);
select * from member_apps;

delete member_APPS;
INSERT INTO MEMBER_APPS
SELECT (SELECT ID FROM MEMBER WHERE EMAIL = 'springsprout@springsprout.com') , ID , APP_DEFULT_YN,APP_DEFULT_ORDER from application_info;

select * from application_info;

	SELECT
            AI.ID
          , AI.APP_NAME
          , AI.APP_DESC
          , AI.APP_ID
          , MA.INSTALL_YN
          , MA.APP_ORDER
        FROM
            APPLICATION_INFO AI
            INNER JOIN MEMBER_APPS MA ON AI.ID = MA.APP_ID
            INNER JOIN MEMBER MB
                    ON  MA.MEMBER_ID = MB.ID
                    AND MB.EMAIL = 'helolsjava@gmail.com';
                    
                    insert into role values(role_seq.nextval, 'ADMIN','ADMIN USER');
                    insert into member_roles values(1,3);
                    insert into member_roles values(21,1);
                    select * from member_roles;
                    
                    select * from role;
                    
                    SELECT 
                        R.ID ,
                        R.NAME,
                        R.DESCR
                    FROM MEMBER_ROLES MR 
                    INNER JOIN ROLE R ON R.ID = MR.ROLE_ID
                    WHERE MR.MEMBER_ID = 1