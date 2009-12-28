package springsprout.m31.module.app.me2day;

import java.util.HashMap;

import org.apache.commons.lang.ObjectUtils;
import org.jdom.Document;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import springsprout.m31.module.app.me2day.support.SpringMe2DayDTO;
import springsprout.m31.module.app.me2day.support.SpringMe2DaySession;
import springsprout.m31.utils.OpenApiRequestHelper;

@Service
public class SpringMe2DayApiService {
	
	private final String DefaultApplicationKey = "eb4d74485df2773948ccd8eefdd53ef3";
	private final String me2dayapi_get_auth_url = "http://me2day.net/api/get_auth_url";
	private final String me2dayapi_get_full_auth_token = "http://me2day.net/api/get_full_auth_token";
	
	/**
	 * me2day 인증 페이지 정보 얻어오기
	 * @param me2DayDTO
	 * @return
	 */
	public String getAuthenticationUrl(SpringMe2DayDTO me2DayDTO) {
		if(!StringUtils.hasText(me2DayDTO.getApiUrl())){
			me2DayDTO.setApiUrl(me2dayapi_get_auth_url);
		}
		if(!StringUtils.hasText(me2DayDTO.getApiFormat())){
			me2DayDTO.setApiFormat("json");
		}
		return OpenApiRequestHelper.loadString(createMe2DayRequestUrl(me2DayDTO));
	}
	
	/**
	 * me2day 인증 정보 얻어오기
	 * @param me2DayDTO
	 * @return
	 */
	public SpringMe2DaySession getAuthenticationResult(SpringMe2DayDTO me2DayDTO) {
		SpringMe2DaySession session = null;
		
		if(!StringUtils.hasText(me2DayDTO.getApiUrl())){
			me2DayDTO.setApiUrl(me2dayapi_get_full_auth_token);
		}
		if(!StringUtils.hasText(me2DayDTO.getApiFormat())){
			me2DayDTO.setApiFormat("xml");
		}
		
		String url = createMe2DayRequestUrl(me2DayDTO);
		url += "&token=" + me2DayDTO.getAuthToken();
		
		Document document = OpenApiRequestHelper.loadXml(url);
		if(document != null){
			HashMap<String, Object> resultMap = OpenApiRequestHelper.docElementValueToMap(document, true);
			session = new SpringMe2DaySession();
			session.setUserId(ObjectUtils.toString(resultMap.get("user_id"), ""));
			if(StringUtils.hasText(ObjectUtils.toString(resultMap.get("full_auth_token"), ""))){
				session.setAuthToken(ObjectUtils.toString(resultMap.get("full_auth_token"), ""));
			}
			else{
				session.setAuthToken(ObjectUtils.toString(resultMap.get("auth_token"), ""));
			}
		}
		
		return session;
	}	
	
	private String createMe2DayRequestUrl(SpringMe2DayDTO me2DayDTO){
		String requestUrl = "";
		if(StringUtils.hasText(me2DayDTO.getApiUrl())){
			requestUrl += me2DayDTO.getApiUrl();
			if(StringUtils.hasText(me2DayDTO.getApiFormat())){
				requestUrl += "." + me2DayDTO.getApiFormat();
			}
			if(StringUtils.hasText(me2DayDTO.getAppKey())){
				requestUrl += "?akey=" + me2DayDTO.getAppKey();
			}
			else{
				requestUrl += "?akey=" + DefaultApplicationKey;
			}
		}
		return requestUrl;
	}

}
