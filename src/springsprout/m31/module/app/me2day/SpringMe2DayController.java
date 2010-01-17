package springsprout.m31.module.app.me2day;

import static springsprout.m31.common.M31System.JSON_VIEW;

import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import springsprout.m31.module.app.me2day.entity.AuthenticationUrl;
import springsprout.m31.module.app.me2day.entity.Me2DayUserInfo;
import springsprout.m31.module.app.me2day.entity.Person;
import springsprout.m31.module.app.me2day.entity.Post;
import springsprout.m31.module.app.me2day.support.CommentDTO;
import springsprout.m31.module.app.me2day.support.Me2DayApiRequestException;
import springsprout.m31.module.app.me2day.support.Me2DayUserInfoDTO;
import springsprout.m31.module.app.me2day.support.PostDTO;
import springsprout.m31.module.app.me2day.support.PostSearchParam;
import springsprout.m31.module.app.me2day.support.SpringMe2DayDTO;
import springsprout.m31.service.security.SecurityService;
import springsprout.m31.utils.MD5Util;

@Controller
@RequestMapping(value="/app/me2day/*")
public class SpringMe2DayController {
	
	@Autowired SpringMe2DayApiService me2DayApiService;
	@Autowired SpringMe2DayService me2DayService;
	@Autowired SecurityService securityService;

	/**
	 * 봄미투데이 초기화
	 * 사용자 로그인 여부를 파악하고 로그인이 안되어 있으면 미투데이로부터 인증 주소를 얻어온다.
	 * 로그인이 되어있다면 사용자 인증이 올바르게 일어나는지 확인하고, 기본 사용자 정보를 미투데이로
	 * 부터 얻어온다.
	 * @param httpSession
	 * @return
	 * @throws Me2DayApiRequestException
	 */
	@RequestMapping
	public ModelAndView initializing(HttpSession httpSession) throws Me2DayApiRequestException {
		ModelAndView mav = new ModelAndView(JSON_VIEW);
		
		boolean state = false;
		AuthenticationUrl authenticationUrl = null;
		Me2DayUserInfo userInfo = null;
		Person person = null;
		
		userInfo = securityService.getPersistentMemberMe2DayUserInfo();
		if(userInfo == null){
			authenticationUrl = me2DayApiService.getAuthenticationUrl();
		}
		else{
			// 미투데이 인증 확인
			if(StringUtils.hasText(userInfo.getUser_key()) && me2DayApiService.noop(userInfo)){
				state = true;
				person = me2DayApiService.getPerson(userInfo.getUser_id());
			}
			else{
				// 인증실패시 미투데이로부터 인증요청주소를 얻어온다.
				authenticationUrl = me2DayApiService.getAuthenticationUrl();
			}
		}
		
		mav.addObject("state", state);
		mav.addObject("authenticationUrl", authenticationUrl);
		mav.addObject("userInfo", userInfo);
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
	public ModelAndView isAuthentication(SpringMe2DayDTO me2DayDTO) throws Me2DayApiRequestException {
		return new ModelAndView(JSON_VIEW).addObject(me2DayApiService.getAuthenticationInfo(me2DayDTO));
	}
	
	/**
	 * 미투데이 인증경과 받기
	 * @param me2DayDTO
	 * @param httpSession
	 * @return
	 * @throws Me2DayApiRequestException
	 */
	@RequestMapping
	public String me2dayAuthenticationResult(Me2DayUserInfo userInfo, Model model) throws Me2DayApiRequestException {
		if(userInfo.isResult()){
			// 기본적으로 첫 로그인시에는 모든 필터는 보기!
			userInfo.setMyPostView("Y");
			userInfo.setFriendPostView("Y");
			userInfo.setCommentView("Y");
			
			// 사용자키를 MD5 로 암호화시킨다
			String md5Ukey = "1A3B5C7D" + MD5Util.md5Hex("1A3B5C7D" + userInfo.getUser_key());
			userInfo.setUser_key(md5Ukey);
			
			// Guest User 가 아니면 인증정보를 저장해둔다.
			if(!securityService.isGuest()){
				userInfo.setMember_id(securityService.getCurrentMemberId());
				if(securityService.getPersistentMemberMe2DayUserInfo() == null){
					me2DayService.addAuthenticationInfo(userInfo);
				}
				else{
					me2DayService.editAuthenticationInfo(userInfo);
				}
			}
			
			Person person = me2DayApiService.getPerson(userInfo.getUser_id());
			if(person != null && !CollectionUtils.isEmpty(person.getPostIcons())){
				model.addAttribute("postIcons", JSONArray.fromObject(person.getPostIcons()).toString());
			}
			
			// 게스트 인증정보를 담아두자
			securityService.setGuestMe2DayUserInfo(userInfo);
		}
		
		model.addAttribute("userInfo", userInfo);
		
		return "springme2day/me2dayAuthenticationResult";
	}	

	/**
	 * 글목록
	 * @param param
	 * @return
	 * @throws Me2DayApiRequestException
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping
	public ModelAndView postList(PostSearchParam param) throws Me2DayApiRequestException {
		List<Post> postList = Collections.EMPTY_LIST;
		Me2DayUserInfo userInfo = securityService.getCurrentMemberMe2DayUserInfo();
		if(userInfo != null){
			postList = me2DayApiService.getPosts(param, userInfo);
		}
		return new ModelAndView(JSON_VIEW).addObject(postList);
	}
	
	/**
	 * 글쓰기
	 * @param param
	 * @return
	 * @throws Me2DayApiRequestException
	 */
	@RequestMapping
	public ModelAndView postSend(PostDTO postDTO) {
		String msg = "";
		Me2DayUserInfo userInfo = securityService.getCurrentMemberMe2DayUserInfo();
		if(userInfo == null){
			msg = "springme2day_not_login";
		}
		else{
			try{
				me2DayApiService.createPost(postDTO, userInfo);
				msg = "springme2day_postsend_success";
			}
			catch (Me2DayApiRequestException e) {
				msg = e.getMessage();
			}
		}
		return new ModelAndView(JSON_VIEW)
			.addObject("success", true)
			.addObject("msg", msg);
	}	
	
	/**
	 * 댓글 전송
	 * @param commentDTO
	 * @param httpSession
	 * @return
	 */
	@RequestMapping
	public ModelAndView commentSend(CommentDTO commentDTO){
		String msg = "";
		Me2DayUserInfo userInfo = securityService.getCurrentMemberMe2DayUserInfo();
		if(userInfo == null){
			msg = "springme2day_not_login";
		}
		else{
			try{
				me2DayApiService.createComment(commentDTO, userInfo);
				msg = "springme2day_commentsend_success";
			}
			catch (Me2DayApiRequestException e) {
				msg = e.getDescription();
			}
		}
		return new ModelAndView(JSON_VIEW)
			.addObject("success",true)
			.addObject("msg", msg);
	}
	
	/**
	 * 댓글 삭제
	 * @param commentDTO
	 * @param httpSession
	 * @return
	 */
	@RequestMapping
	public ModelAndView commentDelete(CommentDTO commentDTO){
		String msg = "";
		Me2DayUserInfo userInfo = securityService.getCurrentMemberMe2DayUserInfo();
		if(userInfo == null){
			msg = "springme2day_not_login";
		}
		else{
			try{
				me2DayApiService.deleteComment(commentDTO.getCommentId(), userInfo);
				msg = "springme2day_commentdelete_success";
			}
			catch (Me2DayApiRequestException e) {
				msg = e.getDescription();
			}
		}
		return new ModelAndView(JSON_VIEW).addObject("msg", msg);
	}
	
	@RequestMapping
	public ModelAndView configSave(Me2DayUserInfoDTO infoDTO){
		String msg = "";
		Me2DayUserInfo userInfo = securityService.getCurrentMemberMe2DayUserInfo();
		if(userInfo == null){
			msg = "springme2day_not_login";
		}
		else{
			infoDTO.setMember_id(userInfo.getMember_id());
			userInfo = me2DayService.editFilter(infoDTO);
			msg = "springme2day_configsave_success";
		}
		return new ModelAndView(JSON_VIEW)
			.addObject("success", true)
			.addObject("msg", msg)
			.addObject("userInfo", userInfo);
	}
	
}
