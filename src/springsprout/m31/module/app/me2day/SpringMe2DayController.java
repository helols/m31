package springsprout.m31.module.app.me2day;

import static springsprout.m31.common.M31System.JSON_VIEW;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import springsprout.m31.module.app.me2day.entity.AuthenticationInfo;
import springsprout.m31.module.app.me2day.entity.AuthenticationUrl;
import springsprout.m31.module.app.me2day.entity.Person;
import springsprout.m31.module.app.me2day.entity.Post;
import springsprout.m31.module.app.me2day.support.Me2DayApiRequestException;
import springsprout.m31.module.app.me2day.support.PostSearchParam;
import springsprout.m31.module.app.me2day.support.SpringMe2DayDTO;

@Controller
@RequestMapping(value="/app/me2day/*")
public class SpringMe2DayController {
	
	private final String SpringMe2DayUserSession = "springMe2DayUserSession";
	
	@Autowired SpringMe2DayApiService me2DayApiService;

	/**
	 * 봄미투데이 초기화
	 * 사용자 로그인 여부를 파악하고 로그인이 안되어 있으면 미투데이로부터 인증 주소를 얻어온다.
	 * 로그인이 되어있다면 사용자 인증이 올바르게 일어나는지 확인하고, 기본 사용자 정보를 미투데이로
	 * 부터 얻어온다.
	 * @param me2DayDTO
	 * @param httpSession
	 * @return
	 * @throws Me2DayApiRequestException
	 */
	@RequestMapping
	public ModelAndView initializing(HttpSession httpSession) throws Me2DayApiRequestException {
		ModelAndView mav = new ModelAndView(JSON_VIEW);
		
		boolean state = false;
		AuthenticationUrl authenticationUrl = null;
		AuthenticationInfo authenticationInfo = null;
		Person person = null;
		
		// 테스트를 위해서 무조건 arawn 의 인증정보를 저장해둔다. 
		if(httpSession.getAttribute(SpringMe2DayUserSession) == null){
			AuthenticationInfo info = new AuthenticationInfo();
			info.setUser_id("arawn");
			info.setFull_auth_token("b08b5e4b6ef0b86cb73729da267139a8");
			httpSession.setAttribute(SpringMe2DayUserSession, info);
		}
		
		authenticationInfo = (AuthenticationInfo) httpSession.getAttribute(SpringMe2DayUserSession);
		if(authenticationInfo == null){
			authenticationUrl = me2DayApiService.getAuthenticationUrl();
		}
		else{
			// 미투데이 인증 확인
			if(me2DayApiService.noop(authenticationInfo)){
				state = true;
				person = me2DayApiService.getPerson(authenticationInfo.getUser_id());
			}
			else{
				// 인증실패시 미투데이로부터 인증요청주소를 얻어온다.
				authenticationUrl = me2DayApiService.getAuthenticationUrl();
			}
		}
		
		mav.addObject("state", state);
		mav.addObject("authenticationUrl", authenticationUrl);
		mav.addObject("authenticationInfo", authenticationInfo);
		mav.addObject("person", person);
		
		return mav;
	}
	
	/**
	 * 미투데이 인증하기
	 * @param me2DayDTO
	 * @param httpSession
	 * @return
	 * @throws Me2DayApiRequestException
	 */
	@RequestMapping
	public ModelAndView isAuthentication(SpringMe2DayDTO me2DayDTO, HttpSession httpSession) throws Me2DayApiRequestException {
		httpSession.setAttribute(SpringMe2DayUserSession, me2DayApiService.getAuthenticationInfo(me2DayDTO));
		return new ModelAndView(JSON_VIEW).addObject(httpSession.getAttribute(SpringMe2DayUserSession));
	}

	/**
	 * 글목록
	 * @param param
	 * @return
	 * @throws Me2DayApiRequestException
	 */
	@RequestMapping
	public ModelAndView postList(PostSearchParam param) throws Me2DayApiRequestException {
		List<Post> postList = me2DayApiService.getPosts(param);
		return new ModelAndView(JSON_VIEW).addObject(postList);
	}
	
}
