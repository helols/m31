desc desktop_addition_info
select desktop_seq.nextval from dual;
INSERT INTO DESKTOP_ADDITION_INFO 
(
  ID
, MEMBER_ID
, THEME_TYPE
, BK_COLOR
, BK_IMG_SRC
, BK_IMG_POSITION
, BK_IMG_REPEAT )
VALUES
( DESKTOP_SEQ.NEXTVAL , #memberId#, ##, ##,##,##,## );


select * from DESKTOP_ADDITION_INFO;

select * from member_apps;

INSERT INTO DESKTOP_ADDITION_INFO 
select 
DESKTOP_SEQ.NEXTVAL,
21,
THEME_TYPE,
BK_COLOR,
BK_IMG_SRC,
BK_IMG_POSITION,
BK_IMG_REPEAT
from DESKTOP_ADDITION_INFO where member_id = 56;

delete DESKTOP_ADDITION_INFO  where id = 6;
delete member_apps  where member_id = 56;
delete member where id = '56';

select * from member

INSERT INTO MEMBER_APPS
SELECT 
      MEMBER.ID AS MEMBER_ID  
    , APP.ID
    , APP.APP_DEFULT_YN
    , APP.APP_DEFULT_ORDER
FROM MEMBER MEMBER,
 APPLICATION_INFO APP
WHERE MEMBER.ID = 21
ORDER BY APP.APP_DEFULT_ORDER;