select * from spring_finder
;

select finder_seq.nextval from dual
;
insert into spring_finder values(finder_seq.nextval ,	21,	'봄 문서'	,1	, 'F' ,'Y' ,1 ,'folder','springdoc');
insert into spring_finder values(finder_seq.nextval ,	21,	'봄 그림'	,1	, 'F' ,'Y' ,2 ,'folder','springsee');
insert into spring_finder values(finder_seq.nextval ,	21,	'봄 동영상'	,1	, 'F' ,'Y' ,3 ,'folder','springplayer');
insert into spring_finder values(finder_seq.nextval ,	21,	'봄 북'	,1	, 'F' ,'Y' ,4,    'folder','springbook');

delete spring_finder where id = 3;



