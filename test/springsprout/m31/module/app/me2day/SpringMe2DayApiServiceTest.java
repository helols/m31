package springsprout.m31.module.app.me2day;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import junit.framework.Assert;

import org.apache.commons.lang.time.FastDateFormat;
import org.junit.Test;
import org.springframework.util.CollectionUtils;

import springsprout.m31.module.app.me2day.entity.Comment;
import springsprout.m31.module.app.me2day.entity.Me2DayUserInfo;
import springsprout.m31.module.app.me2day.entity.Metoo;
import springsprout.m31.module.app.me2day.entity.Person;
import springsprout.m31.module.app.me2day.entity.Post;
import springsprout.m31.module.app.me2day.support.CommentDTO;
import springsprout.m31.module.app.me2day.support.Me2DayApiRequestException;
import springsprout.m31.module.app.me2day.support.PostDTO;
import springsprout.m31.module.app.me2day.support.PostSearchParam;
import springsprout.m31.module.app.me2day.support.SpringMe2DayDTO;

public class SpringMe2DayApiServiceTest {
	
	/**
	 * 테스트용 계정 정보
	 * user_id=arawn
	 * full_auth_token=0ab6b84fa20d40947947baa01291f254
	 */
	
	SpringMe2DayApiService service = new SpringMe2DayApiService();

	public void 인증페이지정보얻어오기() throws Me2DayApiRequestException{
		System.out.println(service.getAuthenticationUrl());
	}

	public void 사용자인증정보얻어오기() throws Me2DayApiRequestException{
		SpringMe2DayDTO me2DayDTO =  new SpringMe2DayDTO();
		me2DayDTO.setAuthToken("ed33be270eff42e2bfd670b684d25b38");
		System.out.println(service.getAuthenticationInfo(me2DayDTO));
	}
	
	public void 사용자인증테스트() throws Me2DayApiRequestException, NoSuchAlgorithmException, UnsupportedEncodingException {
		// b08b5e4b6ef0b86cb73729da267139a8
		Me2DayUserInfo info = new Me2DayUserInfo();
		info.setUser_id("arawn");
		
		// 진짜 인증키
		info.setFull_auth_token("b08b5e4b6ef0b86cb73729da267139a8");
		Assert.assertTrue(service.noop(info));
		
		// 가짜 인증키
		info.setFull_auth_token("asdnn29asdfkn409asdfkjnrsf");
		Assert.assertFalse(service.noop(info));
	}
	
	public void 글목록얻어오기() throws Me2DayApiRequestException {
		Me2DayUserInfo info = new Me2DayUserInfo();
		info.setUser_id("arawn");
		info.setFull_auth_token("b08b5e4b6ef0b86cb73729da267139a8");
		
		PostSearchParam param = new PostSearchParam();
		param.setId("arawn");
		param.setForm("2009-12-31T00:00:00+0900");
		// param.setFriendPostView(true);
		// param.setCommentView(true);
		// param.setPost_id("p4vln3");
		List<Post> posts = service.getPosts(param, info);
		if(!CollectionUtils.isEmpty(posts)){
			for(Post post : posts){
				System.out.println(post);
			}
		}
	}

	public void 댓글얻어오기() throws Me2DayApiRequestException {
		Me2DayUserInfo info = new Me2DayUserInfo();
		info.setUser_id("arawn");
		info.setFull_auth_token("b08b5e4b6ef0b86cb73729da267139a8");
		
		List<Comment> comments = service.getRequestComments("http://me2day.net/api/get_comments.xml?akey=eb4d74485df2773948ccd8eefdd53ef3&post_id=p4wlce", info);
		if(!CollectionUtils.isEmpty(comments)){
			for(Comment comment : comments){
				System.out.println(comment);
			}
		}
	}	
	
	public void 친구목록얻어오기() throws Me2DayApiRequestException{
		List<Person> persons = service.getFriends("hellos");
		if(!CollectionUtils.isEmpty(persons)){
			for(Person persion : persons){
				System.out.println(persion);
			}
		}
	}

	public void 사용자정보얻어오기() throws Me2DayApiRequestException{
		System.out.println(service.getPerson("arawn"));
	}	
	
	public void 오류정보확인() throws Me2DayApiRequestException{
		try{
			service.getPerson("saldnasndknasklasndk");
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}	
	
	public void 미투목록얻어오기() throws Me2DayApiRequestException{
		String url = "http://me2day.net/api/get_metoos.xml?post_id=p4wolv";
		List<Metoo> metoos = service.getRequestMetoos(url);
		if(!CollectionUtils.isEmpty(metoos)){
			for(Metoo metoo : metoos){
				System.out.println(metoo);
			}
		}
	}
	
	public void 미투데이날짜파싱() {
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ssZ");
		try {
			// 이건 잘되..
			System.out.println(dateFormat.parse("2010-01-01T04:56:37+0000"));
			
			// 이건 어케 파싱하지... 잘못된 데이터아닌가;;
			System.out.println(dateFormat.parse("2010-01-01T04:56:37+00:00"));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void 글쓰기테스트() throws Me2DayApiRequestException {
		Me2DayUserInfo info = new Me2DayUserInfo();
		info.setUser_id("arawn");
		info.setFull_auth_token("b08b5e4b6ef0b86cb73729da267139a8");

		PostSearchParam param = new PostSearchParam();
		param.setId("arawn");
		
		PostDTO postDto = new PostDTO();
		postDto.setBody("봄미투데이  테스트 글쓰기 " + service.getPosts(param, info).size() + " 번째 글입니다.");
		
		System.out.println(service.createPost(postDto, info));
	}
	
	public void 덧글쓰기테스트() throws Me2DayApiRequestException {
		Me2DayUserInfo info = new Me2DayUserInfo();
		info.setUser_id("arawn");
		info.setFull_auth_token("b08b5e4b6ef0b86cb73729da267139a8");

		CommentDTO commentDTO = new CommentDTO();
		commentDTO.setPost_id("p4vm_8");
		commentDTO.setBody("봄미투데에서 덧글 쓰기 테스트를 합니다.");
		
		System.out.println(service.createComment(commentDTO, info));
	}
	
	@Test
	public void 댓글날짜계산() throws Exception {
		// Calendar.getInstance(TimeZone.getTimeZone("GMT+09:00"), Locale.ENGLISH);
		Date curDate = new Date();
		
		FastDateFormat format = FastDateFormat.getInstance("yyyy/MM/dd", TimeZone.getTimeZone("GMT+09:00"), Locale.ENGLISH);
		
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd hh:mm");
		
		Date date = dateFormat.parse("2010/01/03 08:00");
		
		
	}

}
