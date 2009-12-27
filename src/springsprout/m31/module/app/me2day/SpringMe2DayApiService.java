package springsprout.m31.module.app.me2day;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import springsprout.m31.module.app.me2day.support.SpringMe2DayDTO;
import springsprout.m31.utils.OpenApiRequestHelper;

@Service
public class SpringMe2DayApiService {
	
	private final String DefaultApplicationKey = "eb4d74485df2773948ccd8eefdd53ef3";
	private final String me2dayapi_get_auth_url = "http://me2day.net/api/get_auth_url";
	
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
