package springsprout.m31.module.app.me2day;

import java.beans.PropertyEditorSupport;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.ObjectUtils;
import org.jdom.Document;
import org.jdom.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import springsprout.m31.module.app.me2day.entity.AuthenticationUrl;
import springsprout.m31.module.app.me2day.entity.Author;
import springsprout.m31.module.app.me2day.entity.Comment;
import springsprout.m31.module.app.me2day.entity.Flickr;
import springsprout.m31.module.app.me2day.entity.Location;
import springsprout.m31.module.app.me2day.entity.Me2DayUserInfo;
import springsprout.m31.module.app.me2day.entity.Metoo;
import springsprout.m31.module.app.me2day.entity.Person;
import springsprout.m31.module.app.me2day.entity.Post;
import springsprout.m31.module.app.me2day.entity.PostIcon;
import springsprout.m31.module.app.me2day.entity.Tag;
import springsprout.m31.module.app.me2day.support.CommentDTO;
import springsprout.m31.module.app.me2day.support.Me2DayApiRequestException;
import springsprout.m31.module.app.me2day.support.PostDTO;
import springsprout.m31.module.app.me2day.support.PostSearchParam;
import springsprout.m31.module.app.me2day.support.SpringMe2DayDTO;
import springsprout.m31.utils.DefaultIntegerEditor;
import springsprout.m31.utils.OpenApiRequestHelper;

@Service
public class SpringMe2DayApiService {
	
	private Logger logger = LoggerFactory.getLogger(SpringMe2DayApiService.class);
	
	private final String me2DayApplicationKey = "eb4d74485df2773948ccd8eefdd53ef3";
	/** 봄미투데이 인증 페이지 요청 주소 */
	private final String me2dayapi_get_auth_url = "http://me2day.net/api/get_auth_url";
	/** 사용자 인증정보 요청 주소 */
	private final String me2dayapi_get_full_auth_token = "http://me2day.net/api/get_full_auth_token";
	/** 사용자 정보 요청 주소 */
	private final String me2dayapi_get_person = "http://me2day.net/api/get_person/%s";
	/** 글목록 요청 주소 */
	private final String me2dayapi_get_posts = "http://me2day.net/api/get_posts";
	/** 친구목록 요청 주소 */
	private final String me2dayapi_get_friends = "http://me2day.net/api/get_friends/%s";
	/** 덧글 가져오기 요청 주소  */
	private final String me2dayapi_get_comments = "http://me2day.net/api/get_comments";
	/** 미투 목록 요청 주소 */
	private final String me2dayapi_get_metoos = "http://me2day.net/api/get_metoos.xml?post_id=%s";
	/** 친구요청 목록 요청 주소 */
	private final String me2dayapi_get_friendship_requests = "http://me2day.net/api/get_friendship_requests/%s";
	/** 인증테스트용 요청 주소 */
	private final String me2dayapi_noop = "http://me2day.net/api/noop";
	/** 미투 글쓰기 요청 주소 */
	private final String me2dayapi_create_post = "http://me2day.net/api/create_post/%s";
	/** 미투 덧글쓰기 요청 주소 */
	private final String me2dayapi_create_comment = "http://me2day.net/api/create_comment";
	/** 미투 덧글삭제 요청 주소 */
	private final String me2dayapi_delete_comment = "http://me2day.net/api/delete_comment";
	
	/** 미투데이 응답형식 지정 */
	private Me2DayResponseType responseType = Me2DayResponseType.xml;
	public Me2DayResponseType getResponseType() {
		return responseType;
	}
	public void setResponseType(Me2DayResponseType responseType) {
		this.responseType = responseType;
	}

	/**
	 * me2day 인증 페이지 정보 얻어오기
	 * @param me2DayDTO
	 * @return
	 * @throws Me2DayApiRequestException 
	 */
	public AuthenticationUrl getAuthenticationUrl() throws Me2DayApiRequestException {
		return (AuthenticationUrl) convertDocumentToBean(
				requestMe2Day(createMe2DayRequestUrl(me2dayapi_get_auth_url)), 
				AuthenticationUrl.class);
	}
	
	/**
	 * me2day 인증 정보 얻어오기
	 * @param me2DayDTO
	 * @return
	 * @throws Me2DayApiRequestException 
	 */
	public Me2DayUserInfo getAuthenticationInfo(SpringMe2DayDTO me2DayDTO) throws Me2DayApiRequestException {
		return (Me2DayUserInfo) convertDocumentToBean(
				requestMe2Day(createMe2DayRequestUrl(me2dayapi_get_full_auth_token) + "&token=" + me2DayDTO.getAuthToken()), 
				Me2DayUserInfo.class);
	}
	
	/**
	 * 글목록
	 * @param id
	 * @return
	 * @throws Me2DayApiRequestException 
	 */
	public List<Post> getPosts(PostSearchParam param, Me2DayUserInfo info) throws Me2DayApiRequestException{
		ArrayList<Post> posts = new ArrayList<Post>();
		
		String requestUrl = "";
		if(StringUtils.hasText(param.getPost_id())){
			requestUrl = createMe2DayRequestUrl(me2dayapi_get_posts) + "&post_id=" + param.getPost_id();
			posts.addAll(getRequestPosts(requestUrl));
		}
		else{
			requestUrl = createMe2DayRequestUrl(me2dayapi_get_posts + "/%s");
			
			ArrayList<String> requestUrlList = new ArrayList<String>();
			
			// 내글 볼꺼야?
			if("Y".equals(param.getMyPostView())){
				requestUrlList.add(String.format(requestUrl, param.getId()));	
			}

			// 친구글도 같이 볼것인가?
			if("Y".equals(param.getFriendPostView())){
				requestUrlList.add(String.format(requestUrl, param.getId()) + "&scope=friend[all]");
			}
			
			String requestParameter = "";
			if(StringUtils.hasText(param.getForm())){
				requestParameter += "&from=" + param.getForm();
			}
			
			if(StringUtils.hasText(param.getTo())){
				requestParameter += "&to=" + param.getTo();
			}
			
			for(String url : requestUrlList){
				posts.addAll(getRequestPosts(url + requestParameter));
			}			
		}
		
		if(!CollectionUtils.isEmpty(posts)){
			// 댓글 가져오기
			if("Y".equals(param.getCommentView())){
				requestUrl = createMe2DayRequestUrl(me2dayapi_get_comments) + "&post_id=%s";
				for(Post post : posts){
					if(post.getCommentsCount() > 0){
						// 삭제가 가능한 댓글인가? ( 자기 글 이하의 모든 댓글은 삭제 가능 )
						boolean isRemove = false;
						if(info.getUser_id().equals(post.getAuthor().getId())){ isRemove = true; }
						post.setComments(getRequestComments(String.format(requestUrl, post.getPost_id()), isRemove));
						post.setCommentView(true);
					}
				}	
			}
			
			// 미투 가져오기
			if(param.isMetooView()){
				requestUrl = createMe2DayRequestUrl(me2dayapi_get_metoos) + "&post_id=%s";
				for(Post post : posts){
					if(post.getMetooCount() > 0){
						post.setMetoos(getRequestMetoos(String.format(requestUrl, post.getPost_id())));
					}
				}	
			}
		}
		
		Collections.sort(posts, new Comparator<Post>() {
			@Override
			public int compare(Post source, Post target) {
				// 내림정렬
				return source.getPubDate().compareTo(target.getPubDate()) * -1;
			}
		});
		
		return posts;
	}

	/**
	 * 글 or 글목록 얻어오기
	 * @param requestUrl 글정보를 얻어올 미투데이 api 주소
	 * @return
	 * @throws Me2DayApiRequestException 
	 */
	@SuppressWarnings("unchecked")
	public List<Post> getRequestPosts(String requestUrl) throws Me2DayApiRequestException {
		List<Element> elements = requestMe2Day(requestUrl).detachRootElement().getChildren("post");
		if(!CollectionUtils.isEmpty(elements)){
			List<Post> posts = new ArrayList<Post>();
			for(Element element : elements){
				// 글 파싱
				Post post = convertElementToPost(element);
				if(post != null){ posts.add(post); }
			}
			return posts;		
		}
		return Collections.emptyList();
	}
	
	/**
	 * Element 로부터 Post 를 만들어낸다!
	 * @param element
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private Post convertElementToPost(Element element) {
		// 글 파싱
		Post post = (Post) convertElementToBean(element.getChildren(), Post.class);
		if(post != null){
			// 작성자 파싱
			Element authorEl = element.getChild("author");
			if(authorEl != null){
				post.setAuthor((Author) convertElementToBean(authorEl.getChildren(), Author.class));							
			}
			// 위치 파싱
			Element locationEl = element.getChild("location"); 
			if(locationEl != null){
				post.setLocation((Location) convertElementToBean(locationEl.getChildren(), Location.class));	
			}
			// tag 파싱
			List<Element> tagEls = element.getChild("tags").getChildren();
			if(!CollectionUtils.isEmpty(tagEls)){
				List<Tag> tags = new ArrayList<Tag>();
				for(Element tagEl : tagEls){
					Tag tag = (Tag) convertElementToBean(tagEl.getChildren(), Tag.class);
					if(tag != null){ tags.add(tag); }
				}
				post.setTags(tags);
			}
		}
		return post;
	}
	
	/**
	 * 덧글 목록 얻어오기
	 * @param requestUrl 덧글을 얻어올 미투데이 api 주소
	 * @return
	 * @throws Me2DayApiRequestException 
	 */
	@SuppressWarnings("unchecked")
	public List<Comment> getRequestComments(String requestUrl, boolean isRemove) throws Me2DayApiRequestException {
		List<Element> elements = requestMe2Day(requestUrl).detachRootElement().getChildren("comment");
		if(!CollectionUtils.isEmpty(elements)){
			List<Comment> comments = new ArrayList<Comment>();
			for(Element element : elements){
				Comment comment = (Comment) convertElementToBean(element.getChildren(), Comment.class);
				if(comment != null){
					Element authorEl = element.getChild("author");
					if(authorEl != null){
						comment.setAuthor((Author) convertElementToBean(authorEl.getChildren(), Author.class));							
					}
					comment.setRemove(isRemove);
					comments.add(comment);
				}
			}
			
			Collections.sort(comments, new Comparator<Comment>() {
				@Override
				public int compare(Comment source, Comment target) {
					// 내림정렬
					return source.getPubDate().compareTo(target.getPubDate());
				}
			});
			
			return comments;
		}
		return Collections.emptyList();
	}
	
	/**
	 * 미투한 사람 목록 얻어오기
	 * @param requestUrl 미투데이 api 주소
	 * @return
	 * @throws Me2DayApiRequestException 
	 */
	@SuppressWarnings("unchecked")
	public List<Metoo> getRequestMetoos(String requestUrl) throws Me2DayApiRequestException {
		List<Element> elements = requestMe2Day(requestUrl).detachRootElement().getChildren("metoo");
		if(!CollectionUtils.isEmpty(elements)){
			List<Metoo> metoos = new ArrayList<Metoo>();
			for(Element element : elements){
				Metoo metoo = (Metoo) convertElementToBean(element.getChildren(), Metoo.class);
				if(metoo != null){
					Element authorEl = element.getChild("author");
					if(authorEl != null){
						metoo.setAuthor((Author) convertElementToBean(authorEl.getChildren(), Author.class));							
					}
					metoos.add(metoo);
				}
			}
			
			Collections.sort(metoos, new Comparator<Metoo>() {
				@Override
				public int compare(Metoo source, Metoo target) {
					// 내림정렬
					return source.getPubDate().compareTo(target.getPubDate()) * -1;
				}
			});
			
			return metoos;
		}
		return Collections.emptyList();
	}		
	
	/**
	 * 친구목록 얻어오기
	 * @param id 미투데이 사용자 id
	 * @return
	 * @throws Me2DayApiRequestException 
	 */
	@SuppressWarnings("unchecked")
	public List<Person> getFriends(String id) throws Me2DayApiRequestException{
		String requestUrl = createMe2DayRequestUrl(String.format(me2dayapi_get_friends, id));
		
		List<Element> elements = requestMe2Day(requestUrl).detachRootElement().getChildren("person");
		if(!CollectionUtils.isEmpty(elements)){
			List<Person> personList = new ArrayList<Person>();
			for(Element element : elements){
				personList.add((Person) convertElementToBean(element.getChildren(), Person.class));
			}
			return personList;		
		}
		
		return Collections.emptyList();
	}
	
	/**
	 * 사용자 얻어오기
	 * @param id 미투데이 사용자 id
	 * @return
	 * @throws Me2DayApiRequestException 
	 */
	@SuppressWarnings("unchecked")
	public Person getPerson(String id) throws Me2DayApiRequestException{
		String requestUrl = createMe2DayRequestUrl(String.format(me2dayapi_get_person, id));
		
		Element personEl = requestMe2Day(requestUrl).getRootElement();
		Person person = (Person) convertElementToBean(personEl.getChildren(), Person.class);
		if(person != null){
			List<Element> iconEls = personEl.getChild("postIcons").getChildren();
			if(!CollectionUtils.isEmpty(iconEls)){
				List<PostIcon> icons = new ArrayList<PostIcon>();
				for(Element tagEl : iconEls){
					PostIcon icon = (PostIcon) convertElementToBean(tagEl.getChildren(), PostIcon.class);
					if(icon != null){
						if(!StringUtils.hasText(icon.getDescription())){
							switch (icon.getIconIndex()) {
							case 1:
								icon.setDescription("생각");
								break;
							case 2:
								icon.setDescription("느낌");
								break;
							case 3:
								icon.setDescription("알림");
								break;
							default:
								icon.setDescription("Empty");
								break;
							}	
						}
						icons.add(icon);
					}
				}
				person.setPostIcons(icons);
			}
			Element flickrEl = personEl.getChild("flickr");
			if(flickrEl != null){
				person.setFlickr((Flickr) convertElementToBean(flickrEl.getChildren(), Flickr.class)); 
			}
		}
		
		return person;
	}
	
	/**
	 * 인증 테스트용
	 * @param info
	 * @return
	 */
	public boolean noop(Me2DayUserInfo info){
		try {
			requestMe2Day(createMe2DayRequestUrl(me2dayapi_noop, info));
			return false;
		} catch (Me2DayApiRequestException e) {
			return e.getCode() == 0 ? true : false;
		}
	}
	
	/**
	 * 글쓰기
	 * @param postDto
	 * @param info
	 * @return
	 * @throws Me2DayApiRequestException
	 */
	public Post createPost(PostDTO postDto, Me2DayUserInfo info) throws Me2DayApiRequestException {
		if(!StringUtils.hasText(postDto.getBody())){
			throw new Me2DayApiRequestException(-1, "springme2day_postsend_body_blank");
		}
		else if(postDto.getBodyLength() > 150){
			throw new Me2DayApiRequestException(-1, "springme2day_postsend_body_maxlength_over");
		}
		
		try {
			String requestUrl = createMe2DayRequestUrl(String.format(me2dayapi_create_post, info.getUser_id()), info);	
			
			requestUrl += "&post[body]=" + URLEncoder.encode(postDto.getBody(), "utf-8");
			if("태그를 입력하세요 (공백으로 구분합니다.)".equals(postDto.getTags())){
				requestUrl += "&post[tags]=" + URLEncoder.encode("봄미투", "utf-8");
			}
			else if(StringUtils.hasText(postDto.getTags())){
				String tempTags = StringUtils.trimWhitespace(postDto.getTags()) + " 봄미투";
				requestUrl += "&post[tags]=" + URLEncoder.encode(tempTags, "utf-8");
			}
			if(postDto.getIcon() > 0){
				requestUrl += "&post[icon]=" + postDto.getIcon();
			}
			requestUrl += "&receive_sms=" + postDto.isReceive_sms();
			if(StringUtils.hasText(postDto.getIcon_url())){
				requestUrl += "&icon_url=" + postDto.getIcon_url();	
			}
			if(StringUtils.hasText(postDto.getCallback_url())){
				requestUrl += "&callback_url=" + postDto.getCallback_url();	
			}
			if(StringUtils.hasText(postDto.getContent_type())){
				requestUrl += "&content_type=" + postDto.getContent_type();	
			}
			if(postDto.getLongitude() > 0){
				requestUrl += "&longitude=" + postDto.getLongitude();	
			}
			if(postDto.getLatitude() > 0){
				requestUrl += "&latitude=" + postDto.getLatitude();	
			}
			requestUrl += "&close_comment=" + postDto.isClose_comment();
			
			return convertElementToPost(requestMe2Day(requestUrl).getRootElement());
		} catch (UnsupportedEncodingException e) {
			throw new Me2DayApiRequestException(-1, "springme2day_postsend_error");
		}
	}
	
	/**
	 * 덧글 쓰기
	 * @param commentDTO 작성할 코멘트
	 * @param info 미투 인증정보
	 * @return
	 * @throws Me2DayApiRequestException
	 */
	public boolean createComment(CommentDTO commentDTO, Me2DayUserInfo info) throws Me2DayApiRequestException {
		if(!StringUtils.hasText(commentDTO.getBody())){
			throw new Me2DayApiRequestException(-1, "springme2day_commentsend_body_blank");
		}
		else if(commentDTO.getBody().length() > 150){
			throw new Me2DayApiRequestException(-1, "springme2day_commentsend_body_maxlength_over");
		}
		else if(!StringUtils.hasText(commentDTO.getPost_id())){
			throw new Me2DayApiRequestException(-1, "springme2day_commentsend_post_id_is_null");
		}
		
		try {
			String requestUrl = createMe2DayRequestUrl(me2dayapi_create_comment, info);
			requestUrl += "&post_id=" + commentDTO.getPost_id();
			requestUrl += "&body=" + URLEncoder.encode(commentDTO.getBody(), "utf-8");
			requestMe2Day(requestUrl);
			return false;
		} catch (Me2DayApiRequestException e) {
			return e.getCode() == 0 ? true : false;
		} catch (UnsupportedEncodingException e) {
			throw new Me2DayApiRequestException(-1, "미투에 덧글 작성 중 네트워크 오류가 발생했습니다.");
		}
	}
	
	/**
	 * 덧글 삭제하기
	 * @param comment_id 삭제할 덧글 id
	 * @param info 인증정보
	 * @return
	 * @throws Me2DayApiRequestException
	 */
	public boolean deleteComment(String comment_id, Me2DayUserInfo info) throws Me2DayApiRequestException {
		if(!StringUtils.hasText(comment_id)){
			throw new Me2DayApiRequestException(-1, "삭제할 덧글 아이디가 올바르지 않습니다.");
		}
		
		try {
			String requestUrl = createMe2DayRequestUrl(me2dayapi_delete_comment, info);
			requestUrl += "&comment_id=" + comment_id;
			requestMe2Day(requestUrl);
			return false;
		} catch (Me2DayApiRequestException e) {
			return e.getCode() == 0 ? true : false;
		}
	}
	
	/**
	 * 미투 API 주소에 응답형식(responseType)과 봄미투데이 어플키를 붙여줍니다.
	 * 기본 주소값만 넣어야합니다.
	 * 올바른 주소 : http://me2day.net/api/delete_comment
	 * 잘못된 주소 : http://me2day.net/api/delete_comment.xml?comment_id=cabztd
	 * @param url
	 * @return
	 */
	private String createMe2DayRequestUrl(String url){
		return createMe2DayRequestUrl(url, null);
	}
	
	/**
	 * 미투 API 주소에 응답형식(responseType)과 봄미투데이 어플키를 그리고 인증정보를 붙여줍니다.
	 * 기본 주소값만 넣어야합니다.
	 * 올바른 주소 : http://me2day.net/api/delete_comment
	 * 잘못된 주소 : http://me2day.net/api/delete_comment.xml?comment_id=cabztd
	 * @param url
	 * @param info
	 * @return
	 */
	private String createMe2DayRequestUrl(String url, Me2DayUserInfo info){
		if(StringUtils.hasText(url)){
			url += "." + responseType.name();
			url += "?akey=" + me2DayApplicationKey;
			if(info != null){
				url += "&uid=" + info.getUser_id();
				url += "&ukey=" + info.getUser_key();
				// url += "&ukey=full_auth_token+" + info.getFull_auth_token();
			}
		}
		return url;
	}
	
	/**
	 * requestUrl 로 요청 후 결과값이 null 이거나 error 가 담겨있으면 예외를 발생시킨다.
	 * @param requestUrl
	 * @return
	 * @throws Me2DayApiRequestException
	 */
	@SuppressWarnings("unchecked")
	private Document requestMe2Day(String requestUrl) throws Me2DayApiRequestException {
		logger.debug(requestUrl);
		
		Document document = OpenApiRequestHelper.loadXml(requestUrl);
		if(document != null){
			Element element = null;
			if(document.hasRootElement()){
				element = document.getRootElement();
			}
			else{
				element = document.detachRootElement();
			}
			if("error".equals(element.getName())){
				throw (Me2DayApiRequestException)convertElementToBean(element.getChildren(), Me2DayApiRequestException.class);
			}
			else{
				return document;
			}
		}
		else{
			throw new Me2DayApiRequestException(-1, "미투데이 서비스 요청 중 네트워크 오류가 발생했습니다.");
		}
	}

	/**
	 * beanClass 객체를 생성해서 document.RootElement 의 값을 담아서 반환 
	 * @param document
	 * @param beanClass
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private Object convertDocumentToBean(Document document, Class beanClass) {
		if(document != null){
			return convertElementToBean(document.getRootElement().getChildren(), beanClass);
		}
		return null;
	}
	
	/**
	 * beanClass 객체를 생성해서  Element 의 값을 담아서 반환 
	 * @param elementList
	 * @param beanClass
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private Object convertElementToBean(List<Element> elementList, Class beanClass) {
		if(!CollectionUtils.isEmpty(elementList)){
			MutablePropertyValues propertyValues = new MutablePropertyValues();
			for(Element element : elementList){
				if(element.getContentSize() <= 1){
					String propertyName = element.getName();
					String propertyValue = element.getValue();
					// element name 이 tags 그냥 넘어간다.
					
					// element name 이 default 라면 뒤에 'v'를 붙여준다. default 는 자바의 예약어 중 하나이다.
					if("default".equals(propertyName)){ propertyName += "v"; }
					// element name 이 pubDate 라면 뒤에 19 자리만 잘라서 값처리. 미투데이에서 일정하지 않은 날짜값이 온다.
					// 1. 2007-08-02T12:51:06+0900  = yyyy-MM-dd'T'hh:mm:ssZ 
					// 2. 2010-01-01T04:56:37+00:00 = 무슨 형식인지 모르겠다!
					// 안정하게 yyyy-MM-dd'T'hh:mm:ss 만 잘라서 쓰자!
					if("pubDate".equals(propertyName)){ propertyValue = propertyValue.substring(0, 19); }
					propertyValues.add(propertyName, element.getValue());	
				}
			}
			
			BeanWrapper beanWrapper = new BeanWrapperImpl(beanClass);
			beanWrapper.registerCustomEditor(Date.class, new CustomDateEditor(new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss"), false));
			beanWrapper.registerCustomEditor(int.class, new DefaultIntegerEditor());
			beanWrapper.registerCustomEditor(List.class, new ListEditor());
			beanWrapper.setPropertyValues(propertyValues, true);

			return beanWrapper.getWrappedInstance();
		}
		return null;
	}
	
	private class ListEditor extends PropertyEditorSupport {
	    @Override
	    public void setAsText(String text) throws IllegalArgumentException {
	    	setValue(Collections.emptyList());
	    }		
	    @Override
	    public String getAsText() {
	        return ObjectUtils.toString(getValue());
	    }
	}
	
}
