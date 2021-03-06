select 
    * 
from spring_finder;

insert into spring_finder values(finder_seq.nextval ,	21,	'간지녀연아'	,6	, 'N' ,'N' , 'file','springbook','http://cfs8.blog.daum.net/image/28/blog/2009/03/04/01/33/49ad5bc8ee09a&filename=2009-03-0221%3B08%3B36.jpg');

        SELECT
            6 as ID,
            '..' as FILE_NAME,
            (select parent_id from spring_finder where id = '6') as PARENT_ID,
            'Y' as DEFAULT_YN,
            'up-folder' as ICONCLS, 
            'springfinder' as LINK_APP_ID,
            '#' as FILE_ADDITION_INFO
        FROM dual
        union all
        SELECT
            ID,
            FILE_NAME,
            PARENT_ID,
            DEFAULT_YN,
            ICONCLS||'-'||LINK_APP_ID as ICONCLS,
            LINK_APP_ID,
            nvl(FILE_ADDITION_INFO,'#')
        FROM SPRING_FINDER
        WHERE MEMBER_ID = '21'
        AND PARENT_ID = '1';        


update  spring_finder set link_app_id = 'springfinder' where link_app_id = 'springdoc'

