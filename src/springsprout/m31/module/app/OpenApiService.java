/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 2:05:27
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import springsprout.m31.common.OpenApi;
import springsprout.m31.common.OpenApiReadException;
import springsprout.m31.module.app.support.DaumAPIHelper;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

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
        throw new OpenApiReadException("none support openApi");
    }

    public ArrayList<HashMap<String, String>> springsee(OpenApi s_type, String query, Integer pageNo) {
        ArrayList<HashMap<String,String>> r_list = new ArrayList<HashMap<String,String>>();
        switch (s_type) {
            case DAUM:
                DaumAPIHelper.springsee(r_list,getAPIInfo(s_type.toString(),"IMAGE"),query,pageNo);
                break;
            case NAVER:
                break;
            case GOOGLE:
                break;
            case FLICKR:
                break;
        }

        return null;
    }
}
