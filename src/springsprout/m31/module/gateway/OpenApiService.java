/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 2:05:27
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import springsprout.m31.common.OpenApi;
import springsprout.m31.common.OpenApiReadException;
import springsprout.m31.domain.MovieVO;
import springsprout.m31.dto.SpringPlayerCri;
import springsprout.m31.dto.SpringPlayerDTO;
import springsprout.m31.dto.SpringseeDTO;
import springsprout.m31.module.gateway.support.DaumAPIHelper;
import springsprout.m31.module.gateway.support.FlickrAPIHelper;
import springsprout.m31.module.gateway.support.GoogleAPIHelper;
import springsprout.m31.module.gateway.support.NaverAPIHelper;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import static springsprout.m31.common.OpenApi.*;

@Service
public class OpenApiService {

    Logger log = LoggerFactory.getLogger(getClass());
    
    @Autowired
    OpenApiRepository openApiRepository;
    List<ConcurrentHashMap<String, String>> apisInfo = new ArrayList<ConcurrentHashMap<String, String>>();

    @SuppressWarnings("uncheched")
    @PostConstruct
    public void initAPIInfo() {
        apisInfo = openApiRepository.initAPIInfo();
        log.debug("apiInfo" + apisInfo);
    }

    public String[] getAPIInfo(String api_op,String api_type) {
        for(ConcurrentHashMap<String, String> apiInfo : apisInfo){
            if(apiInfo.get("API_OP").equals(api_op) && apiInfo.get("API_TYPE").equals(api_type)){
                return new String[]{apiInfo.get("API_URL"),apiInfo.get("API_OUTPUT")};
            }
        }
        throw new OpenApiReadException(api_op+"/"+api_type+"is none support openApi");
    }

    public HashMap<String,Object> springsee(OpenApi s_type, String query, Integer pageNo) {
        ArrayList<SpringseeDTO> r_list = new ArrayList<SpringseeDTO>();
        Integer totalCount = 0;
        Integer perPage = 20;
        HashMap<String,Object> r_map = new HashMap<String,Object>();
        switch (s_type) {
            case ALL:
            	perPage = 10;
            case DAUM:
                totalCount += DaumAPIHelper.springsee(r_list,getAPIInfo(DAUM.toString(),"IMAGE"),query,pageNo, perPage);
                if(s_type.equals(DAUM)) break;
            case NAVER:
                totalCount += NaverAPIHelper.springsee(r_list,getAPIInfo(NAVER.toString(),"IMAGE"),query,pageNo, perPage);
                if(s_type.equals(NAVER)) break;
            case GOOGLE:
            	totalCount += GoogleAPIHelper.springsee(r_list,getAPIInfo(GOOGLE.toString(),"IMAGE"),query,pageNo, perPage);
                if(s_type.equals(GOOGLE)) break;
            case FLICKR:
            	totalCount += FlickrAPIHelper.springsee(r_list,getAPIInfo(FLICKR.toString(),"IMAGE"),query,pageNo, perPage);
                if(s_type.equals(FLICKR)) break;
            default :
                break;
        }

        r_map.put("imgInfo",r_list);
        r_map.put("totalCount",totalCount);

        return r_map;
    }

    public SpringPlayerDTO springPlayer(final SpringPlayerCri cri) {
        /*
        구글, 다음에서 동영상 검색 및 페이징 처리.
        돌려줄 값. 전체 레코드의 갯수, 리미트까지 결과.
         */
        SpringPlayerDTO dto = null;

        switch (cri.getType()) {
            case DAUM:
                dto = DaumAPIHelper.getMovie(cri);
                break;
            case GOOGLE:
                dto = GoogleAPIHelper.getMovie(cri); 
                break;
        }

        return dto;
    }
}
