select * from spring_finder
;

select finder_seq.nextval from dual
;
insert into spring_finder values(finder_seq.nextval ,	21,	'봄 문서'	,1	, 'F' ,'Y' ,'folder','springdoc');
insert into spring_finder values(finder_seq.nextval ,	21,	'봄 그림'	,1	, 'F' ,'Y' ,'folder','springsee');
insert into spring_finder values(finder_seq.nextval ,	21,	'봄 동영상'	,1	, 'F' ,'Y' ,'folder','springplayer');
insert into spring_finder values(finder_seq.nextval ,	21,	'봄 북'	,1	, 'F' ,'Y' ,   'folder','springbook');
insert into spring_finder values(finder_seq.nextval ,	21,	'간지녀연아'	,6	, 'N' ,'N' , 'file','springbook','http://cfs8.blog.daum.net/image/28/blog/2009/03/04/01/33/49ad5bc8ee09a&filename=2009-03-0221%3B08%3B36.jpg');
delete spring_finder where id = 3;



