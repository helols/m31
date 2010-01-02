package springsprout.m31.module.app.me2day.support;

/**
 * scope: 가져올 대상 글을 지정합니다. scope에는 다음과 같은 값을 지정할 수 있습니다. scope 파라미터 값을 지정하지 않은 경우 all 을 지정한 것과 동일하게 동작합니다.
 *
 *   all : 지정한 사용자의 글.
 *   mention : 지정한 사용자가 소환한 글. <미구현>
 *   mentioned : 지정한 사용자를 소환한 글. 
 *   link: 지정한 사용자의 글 중 외부 링크를 포함한 글. <미구현>
 *   location: 지정한 사용자의 글 중 위치정보를 포함하는 글. <미구현>
 *   content[<content_type>]: 지정한 사용자의 글 중 컨텐트타입이 <content_type>인 글.
 *   content_type 으로 지정할 수 있는 값은 글 작성시 content_type 으로 지정되는 값으로 미투데이에서 글 아이콘 하단에 표시됩니다. content_type 값으로 사용할 수 있는 것은 대표적으로 다음과 같은 것들이 있습니다.
 *       o me2photo: 미투포토 글 
 *       o me2cast: 미투캐스트 글 
 *       o me2video: 미투비디오 글
 *       o book: 책관련 글
 *       o music: 음악관련 글 
 *       o movie: 영화관련 글
 *       o me2TV: 방송관련 글
 *       o restaurant: 맛집관련 글
 *       o friend: 친구소개 글
 *       o piczza 등 me2APP 에서 지정한 값: me2APP 을 통해 content_type 이 지정된 글
 *           
 * @author arawn
 *
 */
public enum Me2DayPostSearchScope {

	all, mention, mentioned, link, location, me2photo, me2cast, me2video, book, music,
	movie, me2TV, restaurant, friend, piczza
	
}
