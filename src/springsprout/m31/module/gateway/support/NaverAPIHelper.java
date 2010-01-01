/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 10:02:14
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.gateway.support;

import springsprout.m31.dto.SpringseeDTO;

import java.util.ArrayList;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static springsprout.m31.utils.OpenApiRequestHelper.docElementValueToMap;
import static springsprout.m31.utils.OpenApiRequestHelper.loadXml;

public class NaverAPIHelper {
	
	private final static Logger log = LoggerFactory.getLogger(FlickrAPIHelper.class);

    public static Integer springsee(ArrayList<SpringseeDTO> r_list, String[] apiInfo, String query, Integer pageNo, Integer perPage) {
        String api_url = apiInfo[0];
        pageNo = (pageNo -1) * perPage + 1;
        api_url += query;
        api_url += "&sort=sim&start="+pageNo + "&display="+perPage;
        log.debug("Naver api : " + api_url); 
        HashMap<String,Object> rMap =  docElementValueToMap(loadXml(api_url),false);
        if(rMap.get("item") == null){
            return 0;
        }
        for (HashMap<String, String> tmpMap : (ArrayList<HashMap<String, String>>) rMap.get("item")) {
            r_list.add(
                    new SpringseeDTO(
                              tmpMap.get("thumbnail")
                            , tmpMap.get("sizewidth")
                            , tmpMap.get("sizeheight")
                            , tmpMap.get("title")
                            , tmpMap.get("link")
                            , tmpMap.get("link"))
            );
        }
        return new Integer(rMap.get("total").toString());
    }
}
